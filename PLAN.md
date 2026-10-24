# PLAN-463 — Positive servings and amounts, non-negative nutrition

Issue: [#463](https://github.com/kensodemann-projects/meal-planner/issues/463) (OPEN).

`RecipeEditor.vue` servings uses only `validationRules.required`, so `0` and negatives pass and Save can enable. `disableNutritionButton` already requires servings greater than `0`. Prep and cook time already use `required` and `zeroOrGreater`. `IngredientEditorRow.vue` quantity uses only `required`, with `hide-details` set. `isValidIngredient` in `RecipeEditor.vue` treats any truthy `units` as present, so a negative amount counts as a valid ingredient and `0` does not. Calories, sodium, sugar, carbs, fat, and protein are entered only in `NutritionEditorRows.vue`. `RecipeEditor.vue` and `MealItemEditor.vue` both render that component. Those inputs use only `required`, so negatives pass and Save can enable. Zero is already accepted there.

**Decisions**

- Non-negative nutrition is applied in `NutritionEditorRows.vue`, so the recipe editor and the meal item editor both reject negative calories, sodium, sugar, carbs, fat, and protein.
- Servings and ingredient units use the existing `validationRules.positive`. Nutrition fields use the existing `validationRules.zeroOrGreater`.
- The ingredient units input keeps `hide-details`. Its spec asserts the messages returned by the input's `validate()` method.

**Out of scope**

- Daily nutrient targets in `SettingsEditor.vue`, `NutrientRangeRow.vue`, and `NutrientMaxRow.vue`.
- Read-only nutrition display, and nutrition calculation request or response handling.
- Prep and cook time rules. They already allow zero.
- Meal item servings. That field already uses `positive`.

**Contract**

- Servings and ingredient units of `0` or less fail with `Must be a positive number`.
- A positive fraction such as `0.25` remains a valid ingredient amount.
- A negative calorie, sodium, sugar, carb, fat, or protein value fails with `Must be zero or greater`.
- `0` remains valid for those nutrition fields and for prep and cook time.

**File order**

| Order | Step       | Status   | Files                                                                                                                                                                                                                                               |
| ----- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | [STEP-001] | complete | `src/components/recipes/RecipeEditor.vue`, then `src/components/recipes/__tests__/RecipeEditor.spec.ts`                                                                                                                                             |
| 2     | [STEP-002] | complete | `src/components/recipes/IngredientEditorRow.vue`, then `src/components/recipes/RecipeEditor.vue`, then `src/components/recipes/__tests__/IngredientEditorRow.spec.ts`, then `src/components/recipes/__tests__/RecipeEditor.spec.ts`                 |
| 3     | [STEP-003] |          | `src/components/portions/NutritionEditorRows.vue`, then `src/components/portions/__tests__/NutritionEditorRows.spec.ts`, then `src/components/recipes/__tests__/RecipeEditor.spec.ts`, then `src/components/meals/__tests__/MealItemEditor.spec.ts` |

**Commit gate** — the human commits. A spot-check does not replace the gate.

```bash
pnpm build
pnpm test
pnpm lint
```

All three must succeed with no warning or error before that commit.

## [STEP-001] Require positive recipe servings

**Status:** complete

**Acceptance criteria:** Servings of `0` or less fail validation and keep Save disabled on homemade and prepared recipes. A positive servings value still allows Save when the rest of the form is valid. Prep and cook time still allow `0`.

**Files**

1. `src/components/recipes/RecipeEditor.vue` — servings rules gain `validationRules.positive`.
2. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — servings validation and Save coverage for both recipe kinds.

**Change**

On the servings `v-number-input`, set `:rules` to `[validationRules.required, validationRules.positive]`. Leave prep time and cook time on `[validationRules.required, validationRules.zeroOrGreater]`. Leave `disableNutritionButton` as it is.

In the existing homemade `validation` / `servings` block, add a case that calls `numberInputMustBePositive` for `servings-input`. That helper already expects `Must be a positive number` for `0` and for a negative value, and no such message for a positive value.

In the homemade create Save tests, fill the form with `fillHomemade`, then set servings to `0` and expect Save disabled. Set servings to a negative number and expect Save disabled. Set servings back to a positive number and expect Save enabled.

In the prepared create Save tests, do the same after `fillPrepared`: `0` and a negative servings value keep Save disabled, and a positive value enables it.

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- Servings of `0` and a negative value show `Must be a positive number` and leave Save disabled for homemade and prepared recipes.
- A positive servings value enables Save on an otherwise valid form.
- The existing prep time and cook time cases still allow `0` and reject negatives.

**Done when:** acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.

## [STEP-002] Require positive ingredient amounts

**Status:** complete

**Acceptance criteria:** Ingredient units of `0` or less fail validation and are not treated as a valid ingredient. A positive fraction such as `0.25` remains valid. Save, Add Ingredient, and Calculate Nutrition stay disabled while the only ingredient has a non-positive amount, and they enable once that amount is positive and the rest of the homemade form is valid.

**Files**

1. `src/components/recipes/IngredientEditorRow.vue` — units rules gain `validationRules.positive`.
2. `src/components/recipes/RecipeEditor.vue` — `isValidIngredient` rejects non-positive units.
3. `src/components/recipes/__tests__/IngredientEditorRow.spec.ts` — units bounds.
4. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — a non-positive amount is not a valid ingredient and blocks Save.

**Change**

On the units `v-number-input`, set `:rules` to `[validationRules.required, validationRules.positive]`. Keep `hide-details`.

In `isValidIngredient`, require `units` to be a number greater than `0`. Leave the name and unit-of-measure checks as they are. `0.25` stays valid. `0`, negatives, and a missing amount do not.

In `IngredientEditorRow.spec.ts`, under `units`, set the units input to `0`, blur, and await that input's `validate()`. The returned messages include `Must be a positive number`. Repeat for a negative number. Set `0.25`, blur, validate, and expect the returned messages not to include that string. Do not assert `wrapper.text()` for this field.

In `RecipeEditor.spec.ts`, on a homemade create form filled with `fillHomemade`, add one ingredient with a name, a unit of measure, and units `0.25`. Save, Add Ingredient, and Calculate Nutrition are enabled. Set that ingredient's units to `0` through its units input. All three controls are disabled. Set the units to a negative number. All three stay disabled. Set the units back to `0.25`. All three are enabled again.

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/IngredientEditorRow.spec.ts src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- Units of `0` and a negative value fail with `Must be a positive number`.
- Units of `0.25` do not fail that rule, and that ingredient counts as valid.
- Save, Add Ingredient, and Calculate Nutrition follow that validity on an otherwise complete homemade form.

**Done when:** acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.

## [STEP-003] Reject negative nutrition wherever it is entered

**Status:**

**Acceptance criteria:** A negative calorie, sodium, sugar, carb, fat, or protein value fails validation in the shared nutrition inputs, and it keeps Save disabled in the recipe editor and the meal item editor. `0` remains valid for each of those fields and still allows Save when the rest of the form is valid.

**Files**

1. `src/components/portions/NutritionEditorRows.vue` — each nutrition field gains `validationRules.zeroOrGreater`.
2. `src/components/portions/__tests__/NutritionEditorRows.spec.ts` — each field allows zero and rejects negatives.
3. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — recipe Save follows those bounds for homemade and prepared recipes.
4. `src/components/meals/__tests__/MealItemEditor.spec.ts` — meal item Save follows those bounds for create and edit.

**Change**

On calories, sodium, sugar, carbs, fat, and protein, set `:rules` to `[validationRules.required, validationRules.zeroOrGreater]`.

In `NutritionEditorRows.spec.ts`, import `numberInputMustBeZeroOrGreater`. For each of `calories-input`, `sodium-input`, `sugar-input`, `carbs-input`, `fat-input`, and `protein-input`, add a case that calls that helper. It already expects no `Must be zero or greater` message for `0`, and that message for a negative value.

In `RecipeEditor.spec.ts`, add the same helper cases for those six inputs on the homemade editor. Then, after `fillHomemade`, set each nutrition field to a negative number and expect Save disabled. Set calories to `0` and expect Save enabled. The other nutrition fields already default to `0` in that helper path. Repeat the Save checks after `fillPrepared`.

In `MealItemEditor.spec.ts`, after the create form is valid, set each nutrition field to a negative number and expect Save disabled. Set calories to `0` and expect Save enabled. When editing an existing meal item, set calories to a negative number and expect Save to stay disabled. Set calories to `0` and expect Save enabled, because that is a real change from the loaded value.

**Spot-check**

```bash
pnpm vitest run src/components/portions/__tests__/NutritionEditorRows.spec.ts src/components/recipes/__tests__/RecipeEditor.spec.ts src/components/meals/__tests__/MealItemEditor.spec.ts
```

- Each nutrition field rejects a negative value with `Must be zero or greater` and accepts `0`.
- Save stays disabled for a negative nutrition value on homemade recipes, prepared recipes, new meal items, and edited meal items.
- Save enables when that value is `0` and the rest of the form is valid.

**Done when:** acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
