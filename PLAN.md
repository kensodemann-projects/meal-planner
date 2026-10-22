# PLAN-461 — Recipe editor save matches real edits

Issue: [#461](https://github.com/kensodemann-projects/meal-planner/issues/461) (open).

`RecipeEditor.vue` copies `props.recipe.ingredients` and `props.recipe.steps` with a shallow spread into `ingredients` and `steps`, so those row objects are the ones on the recipe prop until a row is replaced. `listChanged` is set from each `SortableListEditor` `list-modified` event and never cleared. `isModified` treats that flag as a permanent edit. Name and description are compared to the raw field strings (`props.recipe.name !== name.value`, `(props.recipe.description || '') !== description.value`), while `createRecipeFromForm` trims the name and stores `description.trim() || null`. The save button stays disabled unless `valid && isModified`.

**Decisions**

- Compare the editor's full ingredient and step arrays, including partial rows, by value and index to clones taken when the editor opens. Do not compare only the rows `createRecipeFromForm` would persist.
- Normalize name and description on the form the way save does, then compare to the opened recipe: trimmed name against `props.recipe.name`, and trimmed description or `null` when that trim is empty. Treat an opened description of `null` or `''` as `null`. Do not trim the opened name.

**Out of scope**

- `SortableListEditor` still emits `list-modified`. Leave that event and `src/components/core/__tests__/SortableListEditor.spec.ts` alone.
- Save payload shape stays as it is. Prepared recipes still save empty ingredient and step arrays.
- Dirty checks for category, cuisine, difficulty, servings, times, source, and nutrition stay as they are.
- No new test file. Extend `src/components/recipes/__tests__/RecipeEditor.spec.ts` only.

**File order**

| Order | Step       | Status   | Files                                                                                                   |
| ----- | ---------- | -------- | ------------------------------------------------------------------------------------------------------- |
| 1     | [STEP-001] | complete | `src/components/recipes/RecipeEditor.vue`, then `src/components/recipes/__tests__/RecipeEditor.spec.ts` |
| 2     | [STEP-002] | complete | `src/components/recipes/RecipeEditor.vue`, then `src/components/recipes/__tests__/RecipeEditor.spec.ts` |

**Commit gate** — the human commits. A spot-check does not replace the gate.

```bash
pnpm build
pnpm test
pnpm lint
```

All three must succeed with no warning or error before that commit.

## [STEP-001] Compare ingredient and step lists to the opened recipe

**Status:** complete

**Acceptance criteria:** Save stays disabled when an ingredient or step is edited and then restored, and when a row is added and then removed. Save enables when ingredient or step content or order differs from the opened recipe. Editing a list item does not change the recipe object passed into the editor. `listChanged` is gone.

**Files**

1. `src/components/recipes/RecipeEditor.vue` — clone the lists, compare them in `isModified`, and remove `listChanged`.
2. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — cover list revert, order, and the non-mutation case in the homemade update "the save button" block.

**Change**

In `RecipeEditor.vue`, initialize `ingredients` and `steps` with `structuredClone` of `props.recipe.ingredients` and `props.recipe.steps` when a recipe is passed, and with `[]` otherwise. Keep a second `structuredClone` of those same arrays as the opened baseline (empty arrays when there is no recipe).

Remove `listChanged`, both `@list-modified` handlers, and its use in `isModified`.

When `props.recipe` is absent, `isModified` still returns `true`. Otherwise, lists differ when the lengths differ or when the item at any index differs:

- Ingredient: `id`, `units`, `name`, and `unitOfMeasure` (`id`, `name`, `type`, `system`). Missing fields on a partial row count as different from a complete opened row.
- Step: `id` and `instruction`.

Same items in a different order count as different. Create mode is unchanged: there is no recipe, so Save still depends only on `valid`.

In the homemade update "the save button" block of `RecipeEditor.spec.ts`, using `BEER_CHEESE` and the existing `SortableListEditor` stub:

- Editing ingredient index 2 to another valid ingredient enables Save. Emitting `changed` again with the original ingredient disables Save.
- The same revert for a step: a different `instruction` enables Save, and emitting the original step disables it.
- Adding an ingredient and deleting that new row leaves Save disabled. The same for a step.
- Emitting `update:modelValue` on the ingredients `SortableListEditor` with that list reversed enables Save. Emitting the opened order again disables Save. The same for steps.
- Pass a clone of `BEER_CHEESE` as the recipe prop. Mutate `name` on the ingredient object the first `IngredientEditorRow` receives, and `instruction` on the step object the first `StepEditorRow` receives. The recipe prop still deep-equals the pre-edit clone, and those row objects are not the same references as the prop's rows.

Keep the existing cases in that block: Save begins disabled, an ingredient change or delete enables Save, and an invalid ingredient or step disables Save.

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- The new revert, reorder, and non-mutation cases pass.
- Existing save-button cases in that file still pass, including create mode and prepared update.

**Done when:** the acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.

## [STEP-002] Ignore name and description whitespace that save trims

**Status:** complete

**Acceptance criteria:** Save stays disabled when name or description differs from the opened recipe only by surrounding whitespace that save would trim away. A whitespace-only description leaves Save disabled when the opened description is null, and enables Save when the opened description is non-empty text.

**Files**

1. `src/components/recipes/RecipeEditor.vue` — compare name and description in `isModified` with save's trim rules.
2. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — cover those whitespace cases for homemade and prepared update.

**Change**

In `isModified`, replace the raw name and description comparisons. Name is modified when `name.value.trim() !== props.recipe.name`. Description is modified when `(description.value.trim() || null)` differs from the opened description, treating `null` and `''` as `null`. Other `isModified` checks stay as they are.

In the homemade update "the save button" block, with `BEER_CHEESE`:

- Setting name to the opened name plus leading and trailing spaces leaves Save disabled.
- Setting description to the opened description plus leading and trailing spaces leaves Save disabled.
- Setting description to spaces only enables Save.
- Remount with `description: null`, set description to spaces only, and Save stays disabled.

In the prepared update "the save button" block, with `prepared`:

- Setting name to the opened name plus leading and trailing spaces leaves Save disabled.
- Setting description to the opened description plus leading and trailing spaces leaves Save disabled.
- Remount with `description: null`, set description to spaces only, and Save stays disabled.

Keep the existing "begins disabled", "begins disabled for a recipe with a null description", and field-change cases in both blocks.

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- The whitespace cases pass for homemade and prepared update.
- Existing save-button cases in that file still pass, including a real name or description change still enabling Save.

**Done when:** the acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
