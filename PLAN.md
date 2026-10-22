# PLAN-465 — Unique recipe names after load

Issue: [#465](https://github.com/kensodemann-projects/meal-planner/issues/465) (OPEN).

`RecipeEditor.vue` calls `useRecipesData()`, builds `recipeNames` from `recipes` (excluding `props.recipe?.id`), and passes that array to `validationRules.mustBeUnique` on the name field. `useRecipesData` already exposes `loading` (`recipes.pending` in `src/data/recipes.ts`), and the test mock's `loading` ref defaults to `false`, but the editor never reads it. While the collection is still pending, `recipes` is `[]`, so `mustBeUnique` returns true and a duplicate name can pass. `RecipeEditor.spec.ts` only checks uniqueness after `TEST_RECIPES` is assigned.

**Decisions**

- A non-empty name fails with the text `Recipes are still loading` while `loading` is true.
- The name field revalidates when `loading` or `recipeNames` changes, so the message updates without another edit.
- After `loading` is false, the editor still uses `validationRules.mustBeUnique`: comparison stays case-insensitive, the recipe being edited stays excluded by id, and a duplicate still reports `"${trimmed input}" already exists`.
- An empty name still passes the uniqueness rule so the existing `Required` rule remains the empty-name error.

**Out of scope**

- Removing `RecipeEditor`'s `useRecipesData()` call, or passing the page's recipe list into the editor.
- A new Firestore query, and any change to `validationRules.mustBeUnique` or `SourceEditor.vue`.

**Contract**

- While recipes are pending, a non-empty name shows `Recipes are still loading` and does not show `already exists`.
- After `Classic Spaghetti Carbonara` has loaded, the input `classic spaghetti carbonara` shows `"classic spaghetti carbonara" already exists` and does not show `Recipes are still loading`.
- The recipe being edited can keep its own name. The existing spec `allows the name to be reset` remains that check: another recipe's name shows `already exists`, and restoring the edited recipe's name clears it.

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

## [STEP-001] Fail the recipe name rule until recipes finish loading

**Status:**

**Acceptance criteria:** While recipes are loading, a non-empty name shows `Recipes are still loading` and does not pass. After the list loads, a duplicate is rejected case-insensitively with `"${trimmed input}" already exists`, the loading message is gone, and the recipe being edited can still keep its own name.

**Files**

1. `src/components/recipes/RecipeEditor.vue` — read `loading`, fail a non-empty name until loading finishes, then keep the current uniqueness check, and revalidate when that result can change.
2. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — reset `loading` between tests, and cover a pending empty list that then loads a case-insensitive duplicate.

**Change**

In `RecipeEditor.vue`, destructure `loading` from the existing `useRecipesData()` call. Keep `recipeNames` as the computed list of `recipes` names whose id is not `props.recipe?.id`.

Replace the name field's inline rules with a computed `nameRules` array bound as `:rules="nameRules"`:

1. `validationRules.required` stays first.
2. The uniqueness rule returns `true` when the trimmed value is empty.
3. When `loading` is true, it returns `Recipes are still loading`.
4. Otherwise it returns `validationRules.mustBeUnique(recipeNames.value)(value)`.

Import `watch` from `vue`. After `nameInput` and `recipeNames` exist, watch `loading` and `recipeNames` (not immediate) and call `nameInput.validate()`. The rule reads `loading` and `recipeNames` at validation time, so this refresh picks up the loaded list even though Vuetify does not re-run rules on its own. Leave `validation-rules.ts` unchanged.

In `RecipeEditor.spec.ts`, the suite `beforeEach` already assigns `TEST_RECIPES`. Also set the shared `loading` ref to `false` there so a later test cannot inherit `true`.

Add a name-validation spec beside `must be unique`. It remounts, matching `allows the name to be reset`, after setting `loading` to `true` and `recipes` to `[]`. Focus the name input, set it to `classic spaghetti carbonara`, and blur. The text contains `Recipes are still loading` and does not contain `already exists`. Then assign `recipes` to `TEST_RECIPES` (`Classic Spaghetti Carbonara` is `TEST_RECIPES[0]`), set `loading` to `false`, and `await flushPromises()`. The text contains `"classic spaghetti carbonara" already exists` and does not contain `Recipes are still loading`.

Leave `allows the name to be reset` in place. With `loading` false, it still shows `already exists` for another recipe's name and clears that message when the input is set back to the edited recipe's own name.

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- The new pending-then-loaded case passes.
- `is required`, `must be unique`, and `allows the name to be reset` still pass.

**Done when:** a pending duplicate shows `Recipes are still loading`; after load, `classic spaghetti carbonara` shows `"classic spaghetti carbonara" already exists`; the edited recipe can keep its own name; and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
