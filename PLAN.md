# PLAN-464 — Empty nutrition fields on create

Issue: [#464](https://github.com/kensodemann-projects/meal-planner/issues/464) (open).

Creating a recipe in `RecipeEditor` leaves calories unset and sets sodium, sugar, carbs, fat, and protein to `0` through `|| 0` on the `nutrition` ref. `NutritionEditorRows` marks every nutrition field `required`, and `validationRules.required` accepts `0`, so Save can enable without the user entering those five fields. Add pages mount `RecipeEditor` with no recipe. Edit pages pass the stored recipe, and the same `|| 0` still shows a stored `0` because `0 || 0` is `0`.

**Decisions**

- Leave each nutrition field `undefined` when the recipe has no value for it, the same way `calories` is assigned today. Do not substitute `0`, `null`, or `''` in the model. `undefined` renders as an empty number input and fails `required`. A stored `0` stays `0`.

**Out of scope**

- `NutritionEditorRows` rules, `validationRules`, and treating a user-entered `0` as invalid.
- Add and update pages. They pass the recipe through and do not seed nutrition.

**Contract**

- Create, homemade and prepared: the calories, sodium, sugar, carbs, fat, and protein inputs are `''`.
- Edit: each input shows the stored number. A stored `0` shows `'0'`.
- Create Save stays disabled while any of those six inputs is empty. It enables after each has a number, or after Calculate Nutrition writes all six.

**File order**

| Order | Step       | Status | Files                                                                                                   |
| ----- | ---------- | ------ | ------------------------------------------------------------------------------------------------------- |
| 1     | [STEP-001] |        | `src/components/recipes/RecipeEditor.vue`, then `src/components/recipes/__tests__/RecipeEditor.spec.ts` |

**Commit gate** — the human commits. A spot-check does not replace the gate.

```bash
pnpm build
pnpm test
pnpm lint
```

All three must succeed with no warning or error before that commit.

## [STEP-001] Leave nutrition empty when creating a recipe

**Status:**

**Acceptance criteria:** A new homemade or prepared recipe shows all six nutrition inputs empty, and Save stays disabled until each has a number or Calculate Nutrition fills them. Editing still shows each stored nutrition value, including 0.

**Files**

1. `src/components/recipes/RecipeEditor.vue` — stop defaulting the five nutrition fields to `0`.
2. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — expect empty create fields, enter nutrition before Save can enable, and keep a stored `0` visible.

**Change**

In the `nutrition` ref, assign sodium, sugar, carbs, fat, and protein the same way calories is assigned: `props.recipe?.sodium`, `props.recipe?.sugar`, `props.recipe?.carbs`, `props.recipe?.fat`, and `props.recipe?.protein`. Remove each `|| 0`.

`NutritionEditorRows` already binds those fields and applies `validationRules.required`. Empty `undefined` keeps `valid` false. On create, `isModified` is already true, so Save stays disabled until the form is valid. `calculateNutritionInformation` already replaces `nutrition` with the generator result, which fills all six fields.

In `RecipeEditor.spec.ts`:

- In `for create` / `homemade` and `for create` / `prepared`, `initializes the inputs with blank values` expects `''` for sodium, sugar, carbs, fat, and protein, as it already does for calories.
- `fillHomemade` also sets sodium `120`, sugar `8`, carbs `40`, fat `12`, and protein `6`. `fillPrepared` also sets sodium `210`, sugar `4`, carbs `33`, fat `11`, and protein `22`. Calories stay `325` and `540`.
- Homemade `emits the entered data on click` expects those six numbers. Prepared `emits the entered data on click` expects calories `540` and the five prepared numbers above. The other emitted fields stay as they are.
- Homemade `is disabled until all required fields are filled in`: after category, cuisine, difficulty, name, servings, prep time, and cook time are set, and before the six nutrition values are set, Save is disabled. After `fillHomemade`, Save is enabled.
- Prepared `is disabled until all required fields are filled in`: after category, cuisine, name, servings, calories, and source are set, Save is still disabled. After sodium, sugar, carbs, fat, and protein are set to the prepared numbers above, Save is enabled.
- Homemade create Save: with every non-nutrition required field set and one valid ingredient (same shape `addValidIngredient` uses), Save is disabled. After Calculate Nutrition resolves to `{ calories: 350, sodium: 500, sugar: 8, carbs: 25, fat: 12, protein: 18 }`, Save is enabled.
- Prepared create Save: with category, cuisine, name, servings, and source set, and nutrition left empty, Save is disabled. After Calculate Nutrition resolves to that same object, Save is enabled.
- Under `for update` / `homemade`, mount `{ ...BEER_CHEESE, calories: 0, sodium: 0, sugar: 0, carbs: 0, fat: 0, protein: 0 }` and expect each nutrition input to be `'0'`. Prepared edit uses the same `nutrition` ref, so this one case covers a stored zero.

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- Create homemade and prepared nutrition inputs are `''`.
- Save stays disabled until the six nutrition values are entered, and until Calculate Nutrition fills them.
- A stored `0` still renders as `'0'`.
- The file passes.

**Done when:** acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
