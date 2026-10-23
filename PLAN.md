# PLAN-464 — Empty nutrition fields on create

Issue: [#464](https://github.com/kensodemann-projects/meal-planner/issues/464) (OPEN).

On create, `RecipeEditor.vue` initializes `nutrition` with `calories` from the (missing) recipe but coerces sodium, sugar, carbs, fat, and protein to `0` via `|| 0`. Those zeros satisfy `validationRules.required` in `NutritionEditorRows.vue`, so Save can enable without the user entering nutrition. Create-form specs in `RecipeEditor.spec.ts` assert `'0'` for those five fields. Edit mode loads values from `props.recipe` through the same object; removing the coercion must preserve stored `0` when editing.

## Contract

- **Create (homemade or prepared):** DOM values for calories, sodium, sugar, carbs, fat, and protein are all empty (`''`).
- **Edit:** Each nutrition input shows the stored number as a string, including `0`.
- **Create Save:** Save stays disabled until every nutrition field is filled (manually or via Calculate Nutrition), in addition to existing required fields.

**Out of scope**

- Changes to `NutritionEditorRows.vue`, validation rules, or Calculate Nutrition behavior beyond what empty initial state implies.
- New page-level or integration tests outside `RecipeEditor.spec.ts`.

**File order**

| Order | Step       | Status | Files                                           |
| ----- | ---------- | ------ | ----------------------------------------------- |
| 1     | [STEP-001] |        | `RecipeEditor.vue`, then `RecipeEditor.spec.ts` |

**Commit gate**

```bash
pnpm build
pnpm test
pnpm lint
```

All three must succeed with no warning or error before that commit.

## [STEP-001] Empty nutrition on create and align create-form tests

**Status:**

**Acceptance criteria:** New recipes show six empty nutrition fields; editing still displays stored values including zero; create Save requires all nutrition fields; create-form specs no longer expect `'0'` for empty fields.

**Files**

1. `src/components/recipes/RecipeEditor.vue` — Initialize all six nutrition properties from `props.recipe` without `|| 0` (use optional chaining so create leaves them `undefined` and edit keeps numeric `0`).
2. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — Update create-form expectations and helpers so tests match the contract.

**Change**

In `RecipeEditor.vue`, replace the `nutrition` ref initializer (lines 224–231) so each field is assigned directly, for example:

```typescript
const nutrition = ref<Partial<Nutrition>>({
  calories: props.recipe?.calories,
  sodium: props.recipe?.sodium,
  sugar: props.recipe?.sugar,
  carbs: props.recipe?.carbs,
  fat: props.recipe?.fat,
  protein: props.recipe?.protein,
});
```

In `RecipeEditor.spec.ts`:

- In both homemade and prepared `for create` → `initializes the inputs with blank values`, expect all six nutrition inputs to be `''` (not `'0'` for sodium through protein).
- Extend `fillHomemade` and `fillPrepared` to set all six nutrition inputs (not only calories) so existing save flows still reach a valid form after this change.
- Update create `emits the entered data on click` expectations for homemade and prepared so emitted sodium, sugar, carbs, fat, and protein match the values set in the helpers (not implicit zeros).
- Adjust prepared `is disabled until all required fields are filled in` if needed: after source is set, Save must stay disabled until the remaining empty nutrition fields are filled (mirror the issue’s Save rule).

Leave edit-mode tests (e.g. `BEER_CHEESE` initialization) unchanged except where they accidentally depended on create defaults.

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- All examples pass, including `for create` homemade/prepared initialization and save-button behavior.

**Done when:** Acceptance criteria hold, and `pnpm build`, `pnpm test`, and `pnpm lint` succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
