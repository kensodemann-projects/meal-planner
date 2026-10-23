# PLAN-462 — Validated recipe builder and nutrition request

Issue: [#462](https://github.com/kensodemann-projects/meal-planner/issues/462) (OPEN).

`createRecipeFromForm` in `src/components/recipes/RecipeEditor.vue` builds the homemade and prepared recipes as two object literals. Both repeat name, description, kind, category, cuisine, servings, and the six nutrition fields, and both fill required fields with non-null assertions. `save` always emits that value. The emit is wrapped in a spread that copies the object unchanged, and it sets `id` from `props.recipe.id` when a recipe prop is present. Prepared saves already force difficulty `Easy`, prep and cook times `0`, and empty ingredient and step lists. `calculateNutritionInformation` does not call that builder. It calls `nutritionPromptFromForm`, which returns a `NutritionPromptRecipe` and still asserts `servings.value!`. Prepared calculation passes the matching source as the second argument to `generateNutritionData` in `src/core/nutrition-generator.ts`. `src/components/recipes/__tests__/RecipeEditor.spec.ts` already asserts both save payloads and those generator arguments.

**Decisions**

- Calculate Nutrition keeps the current `NutritionPromptRecipe` (name, description, kind, optional category and cuisine, servings, ingredients, steps, and `sourceId` for prepared) and still passes the selected source as the second argument for prepared recipes.
- `createRecipeFromForm` stays in `RecipeEditor.vue` and returns `Recipe | undefined`. A null or undefined required field makes it return undefined. `0` is a present value for servings, prep time, cook time, and each nutrition number.
- `save` emits the returned recipe and sets `id` from `props.recipe.id` when `props.recipe` is present. It returns without emitting when the builder returns undefined.

**Out of scope**

- `src/core/nutrition-generator.ts`, the `NutritionPromptRecipe` type, and the prepared-source prompt.
- Narrowing the nutrition request to name, servings, and ingredients and steps.
- Save-button enablement, `isModified`, and form validation rules.
- New editor spec cases. The existing save and calculate-nutrition cases are the coverage.

**Contract**

- A prepared save emits `difficulty: 'Easy'`, `prepTimeMinutes: 0`, `cookTimeMinutes: 0`, `ingredients: []`, and `steps: []`, including when the opened recipe stored other difficulty, times, ingredients, or steps.
- An update emit includes `id` from the recipe prop. A create emit does not add `id`.
- Homemade generator calls stay one argument: kind `homemade`, name, servings, and the valid ingredients and steps.
- Prepared generator calls stay two arguments: the prompt (kind `prepared`, name, servings, `sourceId`) and the selected source. A prepared recipe whose source is missing from the source list is still passed through with the second argument undefined.

**File order**

| Order | Step       | Status | Files                                                                                                   |
| ----- | ---------- | ------ | ------------------------------------------------------------------------------------------------------- |
| 1     | [STEP-001] |        | `src/components/recipes/RecipeEditor.vue`, then `src/components/recipes/__tests__/RecipeEditor.spec.ts` |
| 2     | [STEP-002] |        | `src/components/recipes/RecipeEditor.vue`, then `src/components/recipes/__tests__/RecipeEditor.spec.ts` |

**Commit gate** — the human commits. A spot-check does not replace the gate.

```bash
pnpm build
pnpm test
pnpm lint
```

All three must succeed with no warning or error before that commit.

## [STEP-001] Assemble a recipe from shared and kind-specific fields

**Status:**

**Acceptance criteria:** Homemade and prepared saves are built from one shared set of fields plus kind-specific fields. The builder uses checked values and contains no non-null assertions. Save emits that recipe only when the builder returns one, and includes the existing id when editing. Prepared saves still force difficulty Easy, zero prep and cook times, and empty ingredients and steps.

**Files**

1. `src/components/recipes/RecipeEditor.vue` — replace `createRecipeFromForm` and the `save` emit.
2. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — leave the existing save cases in place. They are the coverage for this step.

**Change**

Change `createRecipeFromForm` so it returns `Recipe | undefined`.

Read the six nutrition fields from `nutrition.value`. Return undefined when `category`, `cuisine`, `servings`, or any nutrition field is null or undefined. Otherwise assemble one shared object:

- `name` from `name.value.trim()`
- `description` from `description.value.trim() || null`
- `kind` from `props.kind`
- `category`, `cuisine`, and `servings` from the checked refs
- `calories`, `sodium`, `sugar`, `carbs`, `fat`, and `protein` from the checked nutrition fields

For `props.kind === 'homemade'`, return undefined when `difficulty`, `prepTimeMinutes`, or `cookTimeMinutes` is null or undefined. Otherwise add those three values, `ingredients` filtered with `isValidIngredient`, and `steps` filtered with `isValidStep`.

For prepared, return undefined when `sourceId` is null. Otherwise add `sourceId`, `difficulty: 'Easy'`, `prepTimeMinutes: 0`, `cookTimeMinutes: 0`, `ingredients: []`, and `steps: []`.

In `save`, call `createRecipeFromForm`. When the result is undefined, return without emitting. Otherwise emit that recipe, and when `props.recipe` is present emit it with `id` set to `props.recipe.id`. Remove the outer spread that only copied the object.

The spec already asserts this. These cases must keep passing with the same payloads:

- create homemade, `emits the entered data on click`: trimmed name, `description: null`, kind `homemade`, the entered category, cuisine, difficulty, servings, prep and cook times, nutrition numbers, and empty ingredient and step lists, with no `id`
- create prepared, `emits the entered data on click`: trimmed name, kind `prepared`, `sourceId`, and the prepared forced fields above
- update homemade, `emits the entered data on click`: `id` `fie039950912` plus the edited fields and the opened ingredients and steps
- update prepared, `emits the entered data on click`: `id` from the opened recipe, the edited source and category, and the prepared forced fields even though the opened recipe had another difficulty, times, ingredients, and steps

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- The four save cases above pass with the payloads already in the spec.
- The rest of the editor spec passes.

**Done when:** the acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.

## [STEP-002] Drop the servings assertion on the nutrition prompt

**Status:**

**Acceptance criteria:** Calculate Nutrition still sends the current `NutritionPromptRecipe` and, for a prepared recipe, the selected source. The prompt is built from a checked servings value, with no non-null assertion. A missing servings value does not call the generator.

**Files**

1. `src/components/recipes/RecipeEditor.vue` — change `nutritionPromptFromForm` and the start of `calculateNutritionInformation`.
2. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — leave the existing calculate-nutrition cases in place. They are the coverage for this step.

**Change**

Change `nutritionPromptFromForm` so it returns `NutritionPromptRecipe | undefined`. When `servings.value` is null or undefined, return undefined. Otherwise build the same prompt as today, assigning `servings: servings.value` with no `!`:

- shared fields stay `name` (trimmed), `description` (trimmed or null), `kind`, `category`, `cuisine`, and `servings`
- homemade still adds ingredients filtered with `isValidIngredient` and steps filtered with `isValidStep`
- prepared still adds `sourceId: sourceId.value ?? undefined`, `ingredients: []`, and `steps: []`

In `calculateNutritionInformation`, call `nutritionPromptFromForm` before setting `nutritionInfoLoading`. When the prompt is undefined, return without calling `generateNutritionData` and without changing the loading flag or the snackbars. When the prompt exists, keep the current call: prepared passes the prompt and `sources.value.find((source) => source.id === recipe.sourceId)`, including when that find is undefined; homemade passes the prompt as the only argument.

The spec already asserts this. These cases must keep passing:

- `sends a homemade recipe with no source`: one argument, kind `homemade`, name `Test Recipe`, servings `4`, and the valid ingredient
- `sends a prepared recipe with the selected source`: kind `prepared`, name, servings, `sourceId`, and the source object as the second argument
- `shows an error and leaves nutrition unchanged when the prepared source is missing`: the generator is called once and the second argument is undefined

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- The three generator cases above pass with the arguments already in the spec.
- The rest of the editor spec passes.

**Done when:** the acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
