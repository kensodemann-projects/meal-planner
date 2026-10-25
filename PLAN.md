# PLAN-444 — RecipeView nested heading

Issue: [#444](https://github.com/kensodemann-projects/meal-planner/issues/444) (open).
Depends on [#442](https://github.com/kensodemann-projects/meal-planner/issues/442).
Related to [#436](https://github.com/kensodemann-projects/meal-planner/issues/436).

`RecipeView` in `src/components/recipes/RecipeView.vue` always renders `recipe.name` in an `h1`. Ingredients, Steps, and Nutritional Information are hardcoded `h2` elements. `defineProps` accepts only `recipe`. `isHomemade` (`recipe.kind !== 'prepared'`) shows difficulty, prep time, cook time, ingredients, and steps for homemade recipes. Prepared recipes show source and servings and omit those cook sections. `src/components/recipes/__tests__/RecipeView.spec.ts` asserts the default `h1` name and the homemade `h2` section titles, and it asserts the prepared field split, but it never passes a second heading level. `src/pages/recipes/[id]/index.vue` renders `<RecipeView :recipe="recipe" />` and does not pass a heading prop.

## Out of scope

- The dashboard meal recipes page (`src/pages/dashboard/recipes.vue`) and its meal-name `h1` (#445).
- Any edit to `src/pages/recipes/[id]/index.vue`. The omitted prop keeps today's detail-page outline.
- Homemade versus prepared fields, chips, source lookup, and nutrition values from #442.
- Heading levels other than `1` and `2`.

## Contract

| `headingLevel` | Recipe name | Ingredients, Steps, Nutritional Information |
| -------------- | ----------- | ------------------------------------------- |
| `1` (default)  | `h1`        | `h2`                                        |
| `2`            | `h2`        | `h3`                                        |

Section title text stays `Ingredients`, `Steps`, and `Nutritional Information`. The nutrition heading keeps `class="mx-4"`. Prepared recipes still omit Ingredients and Steps, so those headings are absent. Nutritional Information still renders and follows the table.

## File order

| Order | Step       | Status   | Files                                                                                               |
| ----- | ---------- | -------- | --------------------------------------------------------------------------------------------------- |
| 1     | [STEP-001] | complete | `src/components/recipes/RecipeView.vue`, then `src/components/recipes/__tests__/RecipeView.spec.ts` |

## Commit gate

The human commits. A spot-check does not replace the gate. All three commands must succeed with no warning or error before that commit.

```bash
pnpm build
pnpm test
pnpm lint
```

## [STEP-001] Cascade RecipeView headings from headingLevel

**Status:** complete

**Acceptance criteria:** `RecipeView` accepts optional `headingLevel: 1 | 2` defaulting to `1`. The recipe name renders as `h${headingLevel}`. Ingredients, Steps, and Nutritional Information render as `h${headingLevel + 1}` when those sections are shown. The recipe detail page is unchanged. Homemade versus prepared display from #442 is unchanged. Unit tests cover both heading levels for the recipe name and for the section headings.

**Files**

1. `src/components/recipes/RecipeView.vue` — add `headingLevel` and bind the name and section tags from it.
2. `src/components/recipes/__tests__/RecipeView.spec.ts` — cover `headingLevel` `2` for homemade and prepared recipes. Existing default cases stay.

**Change**

Add optional `headingLevel` with `withDefaults`, type `1 | 2`, default `1`, beside the existing `recipe` prop.

Derive two computed tag names from that prop:

- name tag: `'h1'` when `headingLevel` is `1`, otherwise `'h2'`
- section tag: `'h2'` when `headingLevel` is `1`, otherwise `'h3'`

Render the recipe name with `<component :is="nameTag">`. Render Ingredients, Steps, and Nutritional Information with `<component :is="sectionTag">`. Keep `class="mx-4"` on the nutrition heading only. Leave `isHomemade`, `metadataItems`, `sourceName`, and the `v-if="isHomemade"` wrappers as they are.

In the spec, widen `mountComponent` so its props type is `{ recipe: Recipe; headingLevel?: 1 | 2 }`. Keep the current default homemade assertions (`h1` name; Ingredients, Steps, and Nutritional Information as `h2`).

Add a homemade case mounted with `headingLevel: 2`:

- no `h1`
- the `h2` text is `TEST_HOMEMADE_RECIPE.name`
- the ingredients section's `h3` text is `Ingredients`, and that section has no `h2`
- the steps section's `h3` text is `Steps`
- the nutritional information section's `h3` text is `Nutritional Information`

Add a prepared case mounted with `headingLevel: 2` and `TEST_SOURCES` loaded the same way as the existing prepared `beforeEach`:

- the `h2` text is `TEST_PREPARED_RECIPE.name`
- the nutritional information section's `h3` text is `Nutritional Information`
- the ingredients and steps sections are absent
- the Source card still shows the prepared source name
- Difficulty, Prep Time, and Cook Time stay absent

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeView.spec.ts
```

- The file passes, including the existing default `h1` / `h2` cases and the new `headingLevel: 2` homemade and prepared cases.

**Done when:** the acceptance criteria hold, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
