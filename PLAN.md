# PLAN-445 — Today's meal recipes page

Issue: [#445](https://github.com/kensodemann-projects/meal-planner/issues/445) (OPEN).
Depends on [#444](https://github.com/kensodemann-projects/meal-planner/issues/444).
Depends on [#442](https://github.com/kensodemann-projects/meal-planner/issues/442).
Related to [#436](https://github.com/kensodemann-projects/meal-planner/issues/436).

`src/pages/dashboard/recipes.vue` renders the placeholder “The meal recipes page is under construction. Please check back later.” `src/pages/dashboard/index.vue` already opens that route with `?mealType=breakfast|lunch|dinner|snack`. `getMealPlanForDate` in `src/data/meal-plans.ts` returns the `MealPlan` for an ISO date, or null. `getRecipe` in `src/data/recipes.ts` returns the library `Recipe`, or null. `RecipeView` renders one recipe. `CloseButton` is the shared Close control. The dashboard route is `/dashboard`.

**Decisions**

- Valid `mealType` values are the exact strings `breakfast`, `lunch`, `dinner`, and `snack`. Any other value, including a missing query, a different case, or an array, is unrecognized.
- An unrecognized `mealType` shows no meal heading and does not call `getMealPlanForDate` or `getRecipe`.
- A valid meal with no plan, a plan that has no meal of that type, a meal with no items, or a rejected `getMealPlanForDate` uses the empty copy below. The meal heading still shows.
- A meal item whose `getRecipe` returns null or rejects shows that item’s name and the unavailable copy. Other items on the meal still render, in `meal.items` order.
- Planned servings are a paragraph immediately before each `RecipeView`. Unavailable items do not get that paragraph or a `RecipeView`.
- Pass `headingLevel` `2` to `RecipeView`. Do not change `RecipeView`. Implement this plan only after #444 is on the branch.
- Close always calls `router.push('/dashboard')`. This page does not use `ViewPageActionButtons`.
- Do not show the empty copy or the recipe list until the plan request and that meal’s recipe lookups have settled. No loading spinner. The meal heading and Close may show during that wait.
- Today is `dateToISO(new Date())` from `@/core/dates`. Ignore any date query.

**Out of scope**

- Other dates, editing the plan, and dashboard card navigation (`src/pages/dashboard/index.vue`).
- Homemade versus prepared fields inside `RecipeView` (#442) and the `headingLevel` prop itself (#444).
- Modify and delete actions.

**Contract**

| `mealType`  | Heading   | `MealType` used to select items |
| ----------- | --------- | ------------------------------- |
| `breakfast` | Breakfast | Breakfast                       |
| `lunch`     | Lunch     | Lunch                           |
| `dinner`    | Dinner    | Dinner                          |
| `snack`     | Snacks    | Snack                           |

- Empty: `No recipes planned for this meal today.`
- Unrecognized `mealType`: `This meal type is not recognized.`
- Missing recipe: the meal item `name`, then `Recipe unavailable.`
- Found recipe: `Planned servings: {mealItem.servings}` immediately before `RecipeView`. `{mealItem.servings}` is the planned count, not `recipe.servings`.

**File order**

| Order | Step       | Status | Files                                           |
| ----- | ---------- | ------ | ----------------------------------------------- |
| 1     | [STEP-001] |        | `src/pages/dashboard/recipes.vue`               |
| 2     | [STEP-002] |        | `src/pages/dashboard/__tests__/recipes.spec.ts` |

**Commit gate** — the human commits. A spot-check does not replace the gate.

```bash
pnpm build
pnpm test
pnpm lint
```

All three must succeed with no warning or error before that commit.

## [STEP-001] Replace the meal recipes placeholder

**Status:**

**Acceptance criteria:** `/dashboard/recipes` shows today’s recipes for a valid `mealType`, with the contract copy for empty, unrecognized, and missing-recipe states, and Close returns to `/dashboard`.

**Files**

1. `src/pages/dashboard/recipes.vue` — replace the placeholder with the meal recipes page.

**Change**

Remove the placeholder sentence. `RecipeView` and `CloseButton` are auto-imported; do not import them. Import `dateToISO`, `useMealPlansData`, `useRecipesData`, `useRoute`, `useRouter`, and the Vue watch/ref APIs this page uses.

Read `route.query.mealType` and watch it with `immediate: true`, so a later query change reloads. Map the four exact strings through this table:

- `breakfast` → heading `Breakfast`, meal type `Breakfast`
- `lunch` → heading `Lunch`, meal type `Lunch`
- `dinner` → heading `Dinner`, meal type `Dinner`
- `snack` → heading `Snacks`, meal type `Snack`

For an unrecognized value, render a paragraph `This meal type is not recognized.` and `CloseButton`. Render no `h1` and do not call `getMealPlanForDate` or `getRecipe`.

For a valid value, render `h1` with the heading. Call `getMealPlanForDate(dateToISO(new Date()))`. Select `plan.meals` entries whose `type` is that meal type. Keep `meal.items` order. Look up each item with `getRecipe(item.recipeId)`, and catch each call on its own so one failure does not drop the other items. Ignore a response if `mealType` has already changed.

When the request settles:

- No plan, no matching meal, no items, or a rejected `getMealPlanForDate`: paragraph `No recipes planned for this meal today.` No `RecipeView`.
- Resolved recipe: a paragraph `Planned servings: {item.servings}`, then `RecipeView` with that `recipe` and `heading-level` `2`.
- Null or rejected `getRecipe`: the item `name`, then a paragraph `Recipe unavailable.` No planned-servings paragraph and no `RecipeView` for that item.

Until the request settles, do not render the empty paragraph or any recipe row. Do not add a progress indicator. Do not branch on `recipe.kind`.

On every state, including while a valid meal is loading, render only `CloseButton` (not `ViewPageActionButtons`) and handle its click with `router.push('/dashboard')`.

**Done when:** the acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.

## [STEP-002] Cover the meal recipes page

**Status:**

**Acceptance criteria:** `src/pages/dashboard/__tests__/recipes.spec.ts` covers a populated homemade meal, a populated prepared meal, planned servings, and the empty, unrecognized, and missing-recipe states.

**Files**

1. `src/pages/dashboard/__tests__/recipes.spec.ts` — add page tests for `src/pages/dashboard/recipes.vue`.

**Change**

Follow `src/pages/dashboard/__tests__/index.spec.ts` and `src/pages/planning/__tests__/week.spec.ts`: mount with Vuetify, `vi.mock('vue-router')`, `vi.mock('@/data/meal-plans')`, `vi.mock('@/data/recipes')`, and `vi.mock('@/data/sources')` because the real `RecipeView` reads sources. Do not stub `RecipeView`. Use `TEST_HOMEMADE_RECIPE` and `TEST_PREPARED_RECIPE` from `src/data/__tests__/test-data.ts`. Build a small meal plan in the spec. Freeze time the way the dashboard spec does (`new Date(2025, 11, 25)` → `2025-12-25`) and set `useRoute`’s `query.mealType`.

Assert:

- The placeholder sentence is absent.
- `breakfast`, `lunch`, `dinner`, and `snack` render the contract headings. The meal heading is the only `h1`.
- Missing `mealType`, `''`, `Breakfast`, `brunch`, and an array each show `This meal type is not recognized.`, render no `h1`, and do not call `getMealPlanForDate` or `getRecipe`.
- A valid meal calls `getMealPlanForDate` once with `2025-12-25` and calls `getRecipe` only with the `recipeId`s of that meal’s items.
- A null plan, a plan without that meal type, a meal with `items: []`, and a rejected `getMealPlanForDate` each show the meal heading and `No recipes planned for this meal today.`, and render no `RecipeView`. That copy is absent while `getMealPlanForDate` is still pending.
- A homemade item and a prepared item each render `RecipeView` with that recipe and `headingLevel` `2`, and the recipe name is in an `h2`. A meal item whose `servings` differ from `recipe.servings` shows `Planned servings:` with the meal item count. Do not assert ingredients, steps, cook time, or source; `src/components/recipes/__tests__/RecipeView.spec.ts` owns those.
- In one meal, a resolved recipe and a null `getRecipe`, and a resolved recipe and a rejected `getRecipe`, stay in `meal.items` order. The failed item shows its name and `Recipe unavailable.` and has no `RecipeView` and no planned-servings line. The resolved item still renders.
- `CloseButton` on a populated page, the empty state, and the unrecognized state calls `router.push` with `'/dashboard'`.
- `ViewPageActionButtons` is absent.

**Spot-check**

`pnpm vitest run src/pages/dashboard/__tests__/recipes.spec.ts`

- The new file passes, including homemade, prepared, empty, unrecognized, and missing-recipe cases.

**Done when:** the acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
