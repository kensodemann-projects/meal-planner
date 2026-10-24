## Summary

Reviewed [PR #490](https://github.com/kensodemann-projects/meal-planner/pull/490) (`466 Recipe editor: Valid nutrition results only`), which updates `src/core/nutrition-generator.ts` and `src/core/__tests__/nutrition-generator.spec.ts` to delimit untrusted recipe fields (`name`, `ingredients`, `steps`) as JSON data in nutrition prompts and validate that parsed model replies contain finite, non-negative numbers for all six nutrition fields before returning a clean `Nutrition` object. **Recommendation: Approve** after removing the temporary `PLAN.md` file and considering two minor test-assertion improvements.

## Finding counts

| Category                                   | Count |
| ------------------------------------------ | ----: |
| 🔒 Security concerns (immediate attention) |     0 |
| ⚡ Performance issues/optimizations        |     0 |
| 🧹 Code cleanup and maintainability        |     3 |
| 📚 Documentation gaps                      |     0 |
| ✅ Positive feedback                       |     2 |
| 🚨 Critical blockers                       |     0 |
| 💭 Questions for discussion                |     0 |
| **Total**                                  |     5 |

## Findings

[CLN-001]

**Issue:** `PLAN.md` (151 lines) is tracked at the repository root in the resulting diff.  
**Suggestion:** Remove `PLAN.md` from the branch before merging:

```bash
git rm PLAN.md
```

**Why:** Keeps temporary task-planning artifacts out of `main`, matching the cleanup done in previous pull requests.

[CLN-002]

**Issue:** In `src/core/__tests__/nutrition-generator.spec.ts`, the new response-validation tests assert `.rejects.toThrow(Error)`, and the `rejects NaN` test (lines 274–280) mocks the model response text as `'{"calories":NaN,"sodium":0,"sugar":0,"carbs":0,"fat":0,"protein":0}'`. Because `NaN` is not valid JSON syntax, `JSON.parse` throws a `SyntaxError` before `nutritionFromReply` or `isFiniteNonNegative` is ever reached, and `.toThrow(Error)` still passes because `SyntaxError` inherits from `Error`.  
**Suggestion:** Assert the specific validation error message (`'Invalid nutrition response'`) on the `nutritionFromReply` rejection cases so they cannot pass via `SyntaxError`, and either assert `SyntaxError` for raw `NaN` text or test `NaN` against `nutritionFromReply` directly:

```typescript
it('rejects a string calorie value', async () => {
  mockGenerateContent.mockResolvedValue({
    response: { text: () => JSON.stringify({ ...mockNutrition, calories: '250' }) },
  });
  const { generateNutritionData } = useNutritionGenerator();
  await expect(generateNutritionData(mockRecipe)).rejects.toThrow('Invalid nutrition response');
});

it('rejects NaN in JSON text as a syntax error', async () => {
  mockGenerateContent.mockResolvedValue({
    response: { text: () => '{"calories":NaN,"sodium":0,"sugar":0,"carbs":0,"fat":0,"protein":0}' },
  });
  const { generateNutritionData } = useNutritionGenerator();
  await expect(generateNutritionData(mockRecipe)).rejects.toThrow(SyntaxError);
});
```

**Why:** Ensures the validation test cases verify `nutritionFromReply` rather than accidentally passing on `JSON.parse` failures, and accurately reflects how `NaN` in raw response text is rejected.

[CLN-003]

**Issue:** In `src/core/__tests__/nutrition-generator.spec.ts`, the homemade suite verifies that the recipe name is not interpolated outside the JSON payload (`keeps an injected homemade name only inside the recipe JSON`), and the Generic Restaurant suite verifies that `'Burger King'` appears only once (`expect(whopperPrompt.match(/Burger King/g)).toEqual(['Burger King'])`), but `describe('prepared recipes with a named source')` only checks `expect(prompt).toContain(JSON.stringify({ name: preparedRecipe.name }))`. If `namedSourceUserPrompt` still interpolated `recipe.name` in prose alongside the JSON payload, all tests in that block would still pass.  
**Suggestion:** In `sends only the item name in the recipe JSON` (lines 383–388), also assert that the item name does not appear once the JSON payload is removed:

```typescript
it('sends only the item name in the recipe JSON', async () => {
  const { prompt } = await promptFor(preparedRecipe, cookUnity);
  const payload = JSON.stringify({ name: preparedRecipe.name });
  expect(prompt).toContain(payload);
  expect(prompt.replace(payload, '')).not.toContain(preparedRecipe.name);
  expect(prompt).not.toContain('"ingredients"');
  expect(prompt).not.toContain('"steps"');
});
```

**Why:** Guards `namedSourceUserPrompt` against regressions where `recipe.name` is interpolated into the instruction prose in addition to the JSON object.

[POS-001]

**Issue:** Prompt data delimiting in `src/core/nutrition-generator.ts`.  
**Suggestion:** Extracting `recipeDataJson` and instructing the model to treat the JSON block as data rather than instructions across `homemadeUserPrompt`, `namedSourceUserPrompt`, and `genericRestaurantUserPrompt` cleanly separates untrusted user-entered fields (`name`, `ingredients`, `steps`) from prompt instructions while preserving the prepared-meal prompt semantics.  
**Why:** Reduces prompt-injection risk from recipe names, ingredient names, or step instructions without complicating the prompt builders.

[POS-002]

**Issue:** Runtime response validation in `nutritionFromReply` (`src/core/nutrition-generator.ts`).  
**Suggestion:** Replacing the unchecked `as Nutrition` type assertion with `isFiniteNonNegative` checks on all six required fields and returning a newly constructed `{ calories, sodium, sugar, carbs, fat, protein }` object guarantees both type safety and property whitelisting at the boundary.  
**Why:** Prevents malformed AI responses (`null`, arrays, numeric strings, negative numbers, `Infinity`, or extra properties) from corrupting the recipe editor's form state.
