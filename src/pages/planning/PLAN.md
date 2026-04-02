# Plan: Extract Weekly Summary Cards

## Problem

`src/pages/planning/index.vue` contains three inline `v-card` blocks for week summaries (This Week,
Next Week, and each of the four Recent Weeks). They are structurally identical—same subtitle pattern,
same four stats—differing only in their title. Extracting them into a shared component reduces
duplication, improves testability, and aligns with the project pattern seen in `RecipeSummaryCard.vue`.

## Proposed Approach

Create a single `WeeklySummaryCard` component that receives the week data and a title as props and
emits a `click` event. The parent (`index.vue`) retains routing responsibility and passes the title
string (including the dynamic "Weeks Ago: N" title for recent weeks).

---

## Component Design

### New File: `src/components/planning/WeeklySummaryCard.vue`

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | Card heading (e.g. "This Week", "Next Week (Planning)", "Weeks Ago: 2") |
| `week` | `WeeklyData` | ✅ | Summary data for the week |

**Emits:**
| Event | Payload | Description |
|-------|---------|-------------|
| `click` | _(none)_ | Emitted when the card is clicked; parent handles routing |

**Rendered content:**

- `v-card-title`: `title` prop
- `v-card-subtitle`: `week.startDate.toLocaleDateString() – week.endDate.toLocaleDateString()`
- `v-card-text`: Days with Meals, Average Calories, Average Protein (`g`), Average Carbs (`g`)

### `WeeklyData` Interface

Currently defined inline in `index.vue`. It should be **moved to a shared location** so both
`index.vue` and `WeeklySummaryCard.vue` can import it.

**Options (pick one before implementation):**

- **A (Recommended):** Extract to `src/models/weekly-data.ts` — consistent with the project's
  centralized `src/models/` pattern.
- **B:** Export from `WeeklySummaryCard.vue` itself — simpler, but mixes model and component.

---

## Files to Change

| File                                                          | Action                                                                                             |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/models/weekly-data.ts`                                   | **Create** — export `WeeklyData` interface                                                         |
| `src/components/planning/WeeklySummaryCard.vue`               | **Create** — new component                                                                         |
| `src/components/planning/__tests__/WeeklySummaryCard.spec.ts` | **Create** — unit tests for the new component                                                      |
| `src/pages/planning/index.vue`                                | **Update** — replace inline cards with `<WeeklySummaryCard>`, remove local `WeeklyData` definition |
| `src/pages/planning/__tests__/index.spec.ts`                  | **Update** — update assertions to query through the new component instead of raw card elements     |

---

## Test Plan for `WeeklySummaryCard.spec.ts`

- Renders the `title` prop in `v-card-title`
- Renders the date range in `v-card-subtitle`
- Renders Days with Meals stat
- Renders Average Calories stat
- Renders Average Protein stat (with `g` suffix)
- Renders Average Carbs stat (with `g` suffix)
- Emits `click` when the card is clicked

## Changes to `index.spec.ts`

- Replace direct Vuetify card queries with `WeeklySummaryCard` component queries
- Verify correct `title` prop passed to each card (static for current/next week, dynamic for recent)
- Verify `click` emission triggers correct `router.push` call

---

## Notes / Open Questions

1. **`WeeklyData` location** — use `src/models/weekly-data.ts`.
   you prefer to keep it co-located with the component.
2. **No routing inside the component** — routing stays in `index.vue`, matching the pattern in
   `RecipeSummaryCard.vue` which emits `click` and lets the parent decide what to do.
3. **`differenceInWeeks` stays in `index.vue`** — the title string for recent weeks
   (`"Weeks Ago: N"`) is computed in the parent and passed as the `title` prop.
4. **`data-testid`** — add `data-testid="weekly-summary-card"` to the card root for consistent
   querying in tests, following the project convention.
