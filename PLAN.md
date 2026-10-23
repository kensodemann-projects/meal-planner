# PLAN-481 — Trim ingredient names and step instructions

Issue: [#481](https://github.com/kensodemann-projects/meal-planner/issues/481) (OPEN). Related to [#461](https://github.com/kensodemann-projects/meal-planner/issues/461).

On `main` (`9bb486b`), `src/components/recipes/RecipeEditor.vue` compares lists with `listDiffers`, `ingredientAtIndexDiffers`, and `stepAtIndexDiffers`. `isModified` trims the recipe name and description before comparing them to the opened values. `createRecipeFromForm` trims `name` and `description`, then stores `ingredients.value.filter(isValidIngredient)` and `steps.value.filter(isValidStep)` with the raw strings. `ingredientAtIndexDiffers` compares `current.name !== opened.name`. `stepAtIndexDiffers` compares `current.instruction !== opened.instruction`. `isValidStep` already rejects a blank instruction via `instruction?.trim()`. `isValidIngredient` treats any non-empty `name` as present, including a name that is only spaces. This branch does not contain `9bb486b` yet; it still uses the `listChanged` latch. Update this branch onto `main` before implementing a step.

**Decisions**

- Steps edit the `main` editor (`listDiffers` and the two `*AtIndexDiffers` helpers). They do not reintroduce `listChanged`.
- Compare the trimmed form value to the opened value as stored, the same way `name.value.trim() !== props.recipe.name` works. Do not trim the stored value before compare.
- Use `String.prototype.trim` only. Spaces inside the text are a real edit.
- A whitespace-only ingredient name is invalid the same way a whitespace-only step instruction already is.

**Out of scope**

- Prepared recipes still save empty `ingredients` and `steps` arrays.
- Do not trim names or instructions inside `nutritionPromptFromForm`. The shared validity filter may drop a whitespace-only row from that prompt.
- Do not change recipe name or description trimming.
- Do not change `SortableListEditor`, `IngredientEditorRow`, or `StepEditorRow`. `validationRules.required` already rejects whitespace-only text, which keeps the form invalid.
- Do not add create-form cases. Homemade create uses the same `createRecipeFromForm` branch, and the issue only requires homemade update specs.

**Contract**

- A saved ingredient name is the form name after `trim`.
- A saved step instruction is the form instruction after `trim`.
- `  Chopped Onion  ` against stored `Chopped Onion` leaves Save disabled.
- `   ` as a name or instruction leaves Save disabled, and that row is omitted by the validity filter.
- `  Extra Onion  ` against stored `Chopped Onion` enables Save, and the saved name is `Extra Onion`.

**File order**

| Order | Step       | Status | Files                                                                                                   |
| ----- | ---------- | ------ | ------------------------------------------------------------------------------------------------------- |
| 1     | [STEP-001] |        | `src/components/recipes/RecipeEditor.vue`, then `src/components/recipes/__tests__/RecipeEditor.spec.ts` |

**Commit gate**

The human commits. A spot-check does not replace the gate. All three must succeed with no warning or error before that commit.

```bash
pnpm build
pnpm test
pnpm lint
```

## [STEP-001] Trim ingredient names and step instructions

**Status:**

**Acceptance criteria:** On homemade update, Save stays disabled when an ingredient name or step instruction differs from the opened recipe only by surrounding whitespace, or is only whitespace. Save enables when the trimmed text differs, and the saved name or instruction is that trimmed text.

**Files**

1. `src/components/recipes/RecipeEditor.vue` — validity, list comparison, and the homemade save payload.
2. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — homemade update save-button cases, beside the existing name and description whitespace cases.

**Change**

In `isValidIngredient`, require `item.name?.trim()` along with `units` and `unitOfMeasure`, keeping the `item is RecipeIngredient` predicate. Leave `isValidStep` as it is.

In `ingredientAtIndexDiffers`, compare `(current.name ?? '').trim()` to `opened.name`. In `stepAtIndexDiffers`, compare `(current.instruction ?? '').trim()` to `opened.instruction`. Leave id, units, unit of measure, order, and length checks unchanged.

In the homemade branch of `createRecipeFromForm` only, map the filtered ingredients and steps so each saved `name` and `instruction` is the trimmed form value. Keep ids and the other fields. Leave the prepared branch as empty arrays.

In the homemade update `the save button` block, add cases that emit `changed` on ingredient row 2 (`Chopped Onion`) and step row 2, matching the existing row-edit tests:

- Surrounding spaces only (`  ${opened}  `) leave `[data-testid="save-button"]` disabled.
- A whitespace-only value (`   `) leaves Save disabled, and clicking Save does not emit `save`.
- A trimmed value that differs (`  Extra Onion  `, and a step instruction with surrounding spaces around new text) enables Save. The `save` payload has the trimmed name or instruction, and the other rows stay as opened.
- An internal space change (`Chopped  Onion`) enables Save and is stored with that internal space.

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- The new homemade update cases pass, and the existing revert, reorder, and save-payload cases still pass.

**Done when:** the acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
