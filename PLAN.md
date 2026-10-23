# PLAN-479 — Align README recipe categories

Issue: [#479](https://github.com/kensodemann-projects/meal-planner/issues/479) (OPEN).

The Core Concepts **Categories** section in `README.md` lists Beans, Produce, Nuts & Seeds, Dairy, and Snack, and it names Bread as "Bread & Bakery" and Grain as "Grains". `RecipeCategory` in `src/models/recipe.ts` and the matching `recipeCategories` array in `src/data/recipe-categories.ts` are the categories the recipe editor and recipe list actually offer. Those values stay as they are.

**Out of scope** — `RecipeCategory`, `recipeCategories`, and the recipe editor options. Other README mentions of Snack or Snacks as a meal slot (`MealType`) stay as they are.

## Categories contract

The Categories list under Core Concepts becomes exactly:

- Beef, Pork, Lamb, Poultry, Seafood
- Vegetarian
- Bread, Grain, Pasta
- Appetizer, Breakfast, Soup, Salad, Side Dish, Sauce
- Dessert, Beverage

## File order

| Order | Step       | Status | Files       |
| ----- | ---------- | ------ | ----------- |
| 1     | [STEP-001] |        | `README.md` |

**Commit gate** — the human commits. A spot-check does not replace the gate.

```bash
pnpm build
pnpm test
pnpm lint
```

All three must succeed with no warning or error before that commit.

## [STEP-001] Replace the README category list

**Status:**

**Acceptance criteria:** The Categories section lists every value of `RecipeCategory` and no others, using the type's names, including `Bread` and `Grain`.

**Files**

1. `README.md` — replace the five category bullets under Core Concepts → Categories with the contract list.

**Change**

In the Categories section, keep the heading and the sentence "A category classifies the type of recipe. The following categories are supported:". Replace the bullet list with the Categories contract above. Leave Cuisine, Unit of Measure, and the rest of the README unchanged.

**Done when:** the Categories section matches the contract, and build, test, and lint succeed with no warning or error.

**Commit:** the commit-gate commands succeed with no warning or error.
