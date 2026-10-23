# PLAN-483 — Recipe editor name uniqueness by source

Issue: [#483](https://github.com/kensodemann-projects/meal-planner/issues/483) (OPEN).

`RecipeEditor` treats every other recipe name as taken. `recipeNames` in `src/components/recipes/RecipeEditor.vue` keeps every recipe except the one being edited (`x.id !== props.recipe?.id`), and `nameRules` passes that list to `validationRules.mustBeUnique`. That helper already trims and compares case-insensitively. A `watch` on `loading` and `recipeNames` calls `nameInput.validate()` again, but `recipeNames` does not read `sourceId`, so changing the selected source does not recheck the name. Homemade recipes in `TEST_RECIPES` have no `sourceId`. Prepared recipes (`prepared-1` through `prepared-4`) each have one `sourceId`.

**Out of scope**

- `validationRules.mustBeUnique` in `src/core/validation-rules.ts`, and callers such as `SourceEditor`. Comparison stays a flat trimmed, case-insensitive string check.
- Duplicate checks outside this editor (Firestore writes, the recipe list).

## File order

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

## [STEP-001] Limit recipe name uniqueness to homemade or the selected source

**Status:**

**Acceptance criteria:** A homemade name may match a prepared recipe, and a prepared name may match a homemade recipe or a prepared recipe from another source. A second homemade name, or a second prepared name for the same selected source, is rejected after trim and case folding. Editing still allows the open recipe to keep its own name. Changing the selected source runs the name rule again against that source. With no source selected, a prepared name is not rejected for uniqueness.

**Files**

1. `src/components/recipes/RecipeEditor.vue` — `recipeNames` includes only the current name group, so the existing `watch` revalidates when `sourceId` changes.
2. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — `describe('validation')` / `describe('name')` covers the groups above. Existing homemade uniqueness, loading, and own-name cases stay.

**Change**

Keep excluding `props.recipe?.id`. Build `recipeNames` from the remaining recipes as follows:

- When `props.kind` is `'prepared'`, keep recipes whose `sourceId` equals the selected `sourceId`. When `sourceId` is null, that list is empty.
- Otherwise keep recipes that have no `sourceId`. Those are the homemade name group, including recipes stored without a source.

Leave `mustBeUnique` and the `"…" already exists` message as they are. `recipeNames` must read `sourceId` so a source change produces a new list. Keep the `watch` on `loading` and `recipeNames` that calls `nameInput.validate()` when the trimmed name is non-empty. That is the recheck when the selected source changes.

In `RecipeEditor.spec.ts`, under the existing `name` validation block, assert:

- A homemade editor accepts `Harissa Chicken with Couscous` (prepared, CookUnity `fiie002934009ser`) and does not show `already exists`.
- A homemade editor rejects `  classic spaghetti carbonara  ` (same homemade recipe as `TEST_RECIPES[0]`, different case and surrounding spaces) and shows `already exists`. The current exact-name, loading, and own-name tests still pass.
- A prepared editor with CookUnity selected accepts `Classic Spaghetti Carbonara`.
- A prepared editor with BistroMD (`iir00305003lfkdj`) selected accepts `Harissa Chicken with Couscous`.
- A prepared editor with CookUnity selected rejects `  harissa chicken with couscous  `.
- Opening `prepared-1` does not show `already exists` for its own name. Setting the name to another CookUnity recipe's name is rejected; restoring `Harissa Chicken with Couscous` clears the error. (`TEST_RECIPES` has only one CookUnity recipe, so use a second prepared recipe with `sourceId: 'fiie002934009ser'` in the mocked `recipes` list for the same-source clash.)
- On a new prepared editor, select CookUnity, enter `Harissa Chicken with Couscous`, and expect `already exists`. Change the source to BistroMD and expect the error to clear. Change it back to CookUnity and expect the error again.

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

- The new name-group cases pass, and the existing homemade uniqueness, loading, and own-name cases still pass.

**Done when:** acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
