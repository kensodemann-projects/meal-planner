# PLAN-441 — Prepared meals: nutrition AI uses source

Issue: [#441](https://github.com/kensodemann-projects/meal-planner/issues/441) (open).
Depends on #439 (`kind` and `sourceId` on `Recipe`). Related epic: #435.

`Source` already has optional `url` and `description` (`32e2e31`). `GENERIC_RESTAURANT_SOURCE_ID` is `'restaurant'` in `src/data/sources.ts`. Calculate Nutrition lives on `RecipeEditor` and calls `generateNutritionData(recipe)` with one homemade-shaped prompt.

## Decisions

- The editor passes the selected `Source`. The generator does not call `useSourcesData`. `Recipe` only stores `sourceId`, and the editor already has the source list. That keeps `generateNutritionData` a function of the recipe plus an optional source, which matches the existing Firebase AI unit test (no Firestore mock).
- Signature: `generateNutritionData(recipe: Recipe, source?: Source): Promise<Nutrition>`. Homemade calls omit `source`. Prepared calls pass the source whose `id` equals `recipe.sourceId`.
- Generic Restaurant is `source.id === GENERIC_RESTAURANT_SOURCE_ID`, not a name check. A user-added source with a different id is a named source even if its name resembles a restaurant.
- One Gemini model and one response parser. Kind and source change the user prompt only. The JSON object stays the six nutrition numbers. No estimated-vs-label field.
- The system instruction keeps the JSON schema and the “nutrition JSON only” rules. Its opening line stops assuming every request includes ingredients and steps, so a prepared prompt is not contradicted by the system text.
- Shared context on every prompt, included only when the value is present: description (non-blank), category, cuisine, and servings.
- A named source with a non-blank `url` includes that URL in the prompt. The generic Restaurant prompt does not include `source.url` or the name `Generic Restaurant`.
- A prepared recipe with no resolved source throws before `generateContent`. The editor’s existing error snackbar covers that failure. The button stays disabled until a source id is selected.
- A missing `kind` stays homemade, matching the editor.

## Out of scope

- Nutrition model, Firestore recipe shape, and meal-plan scaling.
- Source admin, the recipe form layout, and when the Calculate button is enabled (prepared already requires a source id; homemade already requires a valid ingredient).
- Looking up live web pages in application code. The model is told the URL; the app does not fetch it.
- `src/core/recipe-generator.ts`.

## Prompt text the tests should find

These phrases are the contract. Wording around them can vary. Assertions use `toContain` on the string passed to `generateContent`, the same way `nutrition-generator.spec.ts` checks the recipe name today.

**Homemade** (current lead-in stays):

- recipe name, the servings number, each ingredient name, and each step instruction
- `Here are the ingredients`
- `Here are the steps`
- description, `Category`, and `Cuisine` only when those values are set

**Prepared, named source:**

- source name and recipe name
- `ready-to-eat`
- `published` (prefer published per-serving nutrition)
- an estimate fallback when published numbers are unknown (`best estimate` is enough)
- the source URL when `source.url` is non-blank
- servings, and description / category / cuisine when set
- does not contain `Here are the ingredients`

**Prepared, generic Restaurant:**

- recipe name
- `typical restaurant serving`
- permission to use a chain only when the dish name includes one (`unless the dish name`)
- servings, and description / category / cuisine when set
- does not contain `Generic Restaurant`, `published`, or `Here are the ingredients`

## File order

| Order | Step       | Status   | Files                                                                                                                                                     |
| ----- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | [STEP-001] | complete | `src/core/__tests__/nutrition-generator.spec.ts`, then `src/core/nutrition-generator.ts`                                                                  |
| 2     | [STEP-002] | complete | same two files                                                                                                                                            |
| 3     | [STEP-003] | complete | same two files                                                                                                                                            |
| 4     | [STEP-004] |          | `src/core/__mocks__/nutrition-generator.ts`, then `src/components/recipes/RecipeEditor.vue`, then `src/components/recipes/__tests__/RecipeEditor.spec.ts` |

Within a step, add the failing spec cases first, then change production code until those cases pass. Each step changes at least one file. The existing parser cases (plain JSON, fenced JSON, malformed JSON, and backend failures) stay in `nutrition-generator.spec.ts` and keep passing as part of the commit gate. They are not their own step.

## Commit gate

Every step ends in a commit to be performed by a human. The focused `pnpm vitest run` under a step is the spot-check for that step’s new behavior. It does not replace the gate. Before committing, all three of these must succeed:

```bash
pnpm build
pnpm test
pnpm lint
```

---

## [STEP-001] Homemade prompt keeps ingredients and steps

**Status:** complete

**Acceptance criteria:** Homemade prompts still include recipe name, servings, ingredients, and steps. Description, category, cuisine, and servings are included when present.

**Files**

1. `src/core/__tests__/nutrition-generator.spec.ts` — extend `describe('generate nutrition data')`. `mockRecipe` is already `kind: 'homemade'` and has a description, category, cuisine, ingredients, and steps.
2. `src/core/nutrition-generator.ts` — user-prompt builder and the system-instruction opening. Leave `captureJson` and `JSON.parse` on the single path they use now.

**Change**

Build the homemade user prompt from the recipe alone. Keep the current ingredients and steps sentences, including `JSON.stringify` of those arrays. Append description, category, and cuisine only when they have values. Servings stay in the prompt.

Adjust the system instruction’s first sentence so it asks for a per-serving breakdown without requiring ingredients and steps on every request. Leave the JSON example and the “only respond with the nutrition information JSON” rules in place.

Call shape for this step is still `generateNutritionData(recipe)`. The optional source argument arrives in [STEP-002].

**Spot-check**

```bash
pnpm vitest run src/core/__tests__/nutrition-generator.spec.ts
```

- Existing name, servings, and ingredient assertions still pass.
- A new assertion finds `Grill chicken for 20 minutes` (the mock step) and `Here are the steps`.
- The prompt contains `Simple grilled chicken breast`, `Poultry`, and `American`.
- A recipe with `description: null` and no category or cuisine omits those three. Servings and the ingredients sentence remain.
- `getGenerativeModel` is still called once per `useNutritionGenerator()` call. The system instruction still lists `calories`, `sodium`, `sugar`, `carbs`, `fat`, and `protein`.

**Done when:** a homemade call produces the ingredients/steps prompt plus the extra context fields that are set, and `captureJson` then `JSON.parse` is still the only response path.

**Commit:** `pnpm build`, `pnpm test`, and `pnpm lint` all succeed.

---

## [STEP-002] Named source asks for published nutrition

**Status:** complete

**Acceptance criteria:** Prepared prompts include the source name and recipe name. Named-source wording asks to look up published nutrition for that source. A source URL is given to the model when the source has one.

**Files**

1. `src/core/__tests__/nutrition-generator.spec.ts` — new `describe('prepared recipes with a named source')`.
2. `src/core/nutrition-generator.ts` — branch the user prompt when `recipe.kind === 'prepared'` and `source.id` is not `GENERIC_RESTAURANT_SOURCE_ID`.

**Change**

Add the optional `source?: Source` argument. Import `GENERIC_RESTAURANT_SOURCE_ID` from `@/data/sources` and the `Source` type from `@/models/source`.

For a prepared recipe and a named source, the user prompt says the item is a prepared, ready-to-eat item from `{source.name}` named `{recipe.name}`, prefers published per-serving nutrition, and falls back to a best estimate. Append `source.url` only when it is a non-blank string. Append the same optional description, category, cuisine, and servings context as [STEP-001]. Do not append the homemade ingredients/steps lead-in.

If `kind === 'prepared'` and `source` is missing, throw an `Error` before `generateContent`.

**Spot-check**

```bash
pnpm vitest run src/core/__tests__/nutrition-generator.spec.ts
```

Use a prepared recipe named like the issue examples (`Harissa Chicken`) and the CookUnity fixture (`TEST_SOURCES` id `fiie002934009ser`, which has `https://www.cookunity.com/`).

- The prompt contains `CookUnity`, `Harissa Chicken`, `ready-to-eat`, `published`, and `https://www.cookunity.com/`.
- The prompt contains the servings number and, when set, the description, category, and cuisine.
- The prompt does not contain `Here are the ingredients`.
- The same recipe with BistroMD (no `url` on that fixture) does not contain `http`.
- Calling with `kind: 'prepared'` and no source rejects, and `generateContent` is not called.
- The homemade cases from [STEP-001] still pass when called with one argument.

**Done when:** a named source changes only the user prompt, and the model still returns the same six-number JSON through the existing parser.

**Commit:** `pnpm build`, `pnpm test`, and `pnpm lint` all succeed.

---

## [STEP-003] Generic Restaurant asks for a typical serving

**Status:** complete

**Acceptance criteria:** Generic Restaurant wording asks for a typical restaurant estimate, not a specific chain, unless the dish name implies one.

**Files**

1. `src/core/__tests__/nutrition-generator.spec.ts` — new `describe('prepared recipes from Generic Restaurant')`.
2. `src/core/nutrition-generator.ts` — branch when `source.id === GENERIC_RESTAURANT_SOURCE_ID`.

**Change**

The user prompt asks for a typical restaurant serving of `{recipe.name}` and tells the model not to assume a chain unless the dish name clearly includes one. Include servings and the optional description, category, and cuisine. Do not include the source name, the source URL, `published`, or the ingredients/steps lead-in.

No code inspects the dish name for a chain. That judgment stays in the prompt.

**Spot-check**

```bash
pnpm vitest run src/core/__tests__/nutrition-generator.spec.ts
```

Call with a prepared recipe and `TEST_SOURCES`’s `{ id: 'restaurant', name: 'Generic Restaurant' }`. Give that source object a `url` in the test even though the fixture has none, to prove the URL is ignored.

- The prompt contains the recipe name, `typical restaurant serving`, and `unless the dish name`.
- The prompt does not contain `Generic Restaurant`, `published`, `Here are the ingredients`, or that test URL.
- A named-source case from [STEP-002] still contains `published` and the source name.
- A dish named `Burger King Whopper` is still sent through this generic prompt unchanged (the name is present; the prompt does not add a second chain lookup).

**Done when:** the three prompt shapes are covered in one spec file, and generic vs named is decided only by the source id.

**Commit:** `pnpm build`, `pnpm test`, and `pnpm lint` all succeed.

---

## [STEP-004] Editor passes the selected source

**Acceptance criteria:** Calculate Nutrition on a prepared meal uses the source chosen in the form. Homemade calculation does not require a source.

**Files**

1. `src/core/__mocks__/nutrition-generator.ts` — optional second argument so the mock matches the new signature. Default resolved value stays the six zeros.
2. `src/components/recipes/RecipeEditor.vue` — `calculateNutritionInformation`.
3. `src/components/recipes/__tests__/RecipeEditor.spec.ts` — `describe('calculate nutrition')` / `describe('on click')`.

**Change**

After `createRecipeFromForm()`:

- Homemade: `generateNutritionData(recipe)`.
- Prepared: find `sources` where `id === recipe.sourceId` and call `generateNutritionData(recipe, source)`.

If the prepared source id is not in the list, let the generator throw. The existing `catch` already opens the error snackbar and leaves the nutrition fields unchanged.

Do not change `disableNutritionButton`, the saved recipe, or the snackbar copy.

**Spot-check**

```bash
pnpm vitest run src/components/recipes/__tests__/RecipeEditor.spec.ts
```

The editor spec already mocks `@/core/nutrition-generator` and `@/data/sources`.

- Homemade click: `generateNutritionData` is called once with the homemade recipe and no source. Name, servings, and the ingredient from `setupValidState` are on that recipe.
- Prepared click: set the source to CookUnity (`fiie002934009ser`) and expect the second argument to be that source object (`name` and `url`).
- Prepared click when `sources` is empty: the error snackbar opens and nutrition fields stay at their previous values.
- Existing loading, success, and error cases still pass.

The page specs (`add-homemade`, `add-prepared`, and recipe update) mock `useNutritionGenerator`. If the new signature makes one of them fail to compile, fix `src/core/__mocks__/nutrition-generator.ts` in this step.

**Done when:** the prepared form sends the selected source into the generator, and a homemade click does not.

**Commit:** `pnpm build`, `pnpm test`, and `pnpm lint` all succeed.
