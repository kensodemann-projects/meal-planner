# Test Plan: Planning Index Page — Real Data Fetching

## TODO Location

**File:** `src/pages/planning/index.vue`, lines 139–140  
**Describe context:** `Planning > week cards` (new sub-describe blocks to add)

```
// TODO: Copilot this needs to be replaced with real data fetching logic for the current, next and previous weeks
//       Furthermore, the @src/core/nutrition-calculator.ts should be used to calculate the average calories, protein and carbs for the week.
```

---

## Implementation Status

**All tests below are TDD — they will fail until the feature is implemented.**

The component currently uses random helpers (`randomDays()`, `randomCalories()`, etc.) instead of live data. The implementation must:

1. Call `useMealPlansData()` and use `getMealPlansForPeriod()` per week
2. Compute stats using `multiDayMealPlanNutrients`, `daysWithMeals`, and `dailyMealPlanNutrients` from `src/core/nutritional-calculations.ts`
3. Derive cheat days by counting plans where `dailyMealPlanNutrients(plan).calories > settings.dailyCalorieLimit`

---

## Pre-Requisite: Update the Nutritional Calculations Mock

`src/core/__mocks__/nutritional-calculations.ts` is **missing** the `daysWithMeals` export. Add it before implementing:

```typescript
export const daysWithMeals: typeof import('@/core/nutritional-calculations').daysWithMeals = vi.fn().mockReturnValue(0);
```

---

## Required Mocks in the Test File

Add these two `vi.mock` calls at the top (alongside the existing ones):

```typescript
vi.mock('@/data/meal-plans');
vi.mock('@/core/nutritional-calculations');
```

And import the mocked functions to control their return values per test:

```typescript
import { useMealPlansData } from '@/data/meal-plans';
import { multiDayMealPlanNutrients, daysWithMeals, dailyMealPlanNutrients } from '@/core/nutritional-calculations';
```

The mocks auto-resolve from `src/data/__mocks__/meal-plans.ts` and `src/core/__mocks__/nutritional-calculations.ts`.

---

## Test Cases

### Group 1 — Data Fetching (new `describe('data fetching')` block)

---

#### Test 1: calls `useMealPlansData`

**Context:** Verifies the component wires up the meal plans data composable.

**Setup:**

```typescript
wrapper = mountPage();
await flushPromises();
```

**Assertions:**

```typescript
expect(useMealPlansData).toHaveBeenCalled();
```

---

#### Test 2: fetches six meal plans

**Context:** Verifies the component obtains exactly six meal plans via `getMealPlansForPeriod`.

**Assertions:**

```typescript
expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-15', '2025-12-21');
expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-08', '2025-12-14');
expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-01', '2025-12-07');
expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-11-24', '2025-11-30');
```

---

#### Test 3: fetches meal plans for this week

**Context:** `getMealPlansForPeriod` is called with the exact date range for this week.  
System time: `2025-12-25`. Week starts Monday (from settings mock `weekStartDay: 1`).  
This week: `2025-12-22` → `2025-12-28`.

**Setup:**

```typescript
const { getMealPlansForPeriod } = useMealPlansData();
wrapper = mountPage();
await flushPromises();
```

**Assertions:**

```typescript
expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-22', '2025-12-28');
```

---

#### Test 4: fetches meal plans for next week

**Context:** `getMealPlansForPeriod` is called with the date range for next week: `2025-12-29` → `2026-01-04`.

**Assertions:**

```typescript
expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-29', '2026-01-04');
```

---

#### Test 5: fetches meal plans for all four previous weeks

**Context:** One `getMealPlansForPeriod` call per previous week card.

**Assertions:**

```typescript
expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-15', '2025-12-21');
expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-08', '2025-12-14');
expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-01', '2025-12-07');
expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-11-24', '2025-11-30');
```

---

### Group 2 — Stats Display (new `describe('stats')` block, nested under `describe('this week')`)

These tests verify that the computed stats for the **This Week** card are derived from the calculation functions rather than random helpers. Tests for **Next Week** and each **Previous Week** card follow the identical pattern.

---

#### Test 5: displays days with meals from `daysWithMeals()`

**Context:** The "Days with Meals" value in the card body must come from the `daysWithMeals` function, not `randomDays()`.

**Setup:**

```typescript
(daysWithMeals as Mock).mockReturnValue(5);
wrapper = mountPage();
await flushPromises();
const card = wrapper.findAllComponents(components.VCard)[0]!;
const text = card.findComponent(components.VCardText);
```

**Assertions:**

```typescript
expect(text.text()).toContain('Days with Meals: 5');
```

---

#### Test 6: displays average calories from `multiDayMealPlanNutrients()`

**Context:** `averageCalories` = `multiDayMealPlanNutrients(plans).calories / daysWithMeals(plans)`.  
The display should use Math.round() to round to the nearest whole number. Choose numerators that exercise this.

**Setup:**

```typescript
(multiDayMealPlanNutrients as Mock).mockReturnValue({
  calories: 14002,
  protein: 0,
  fat: 0,
  carbs: 0,
  sugar: 0,
  sodium: 0,
});
(daysWithMeals as Mock).mockReturnValue(7);
wrapper = mountPage();
await flushPromises();
const card = wrapper.findAllComponents(components.VCard)[0]!;
const text = card.findComponent(components.VCardText);
```

**Assertions:**

```typescript
expect(text.text()).toContain('Average Calories: 2000');
```

---

#### Test 7: displays average protein from `multiDayMealPlanNutrients()`

**Context:** `averageProtein` = `multiDayMealPlanNutrients(plans).protein / daysWithMeals(plans)`.

**Setup:**

```typescript
(multiDayMealPlanNutrients as Mock).mockReturnValue({
  calories: 0,
  protein: 703,
  fat: 0,
  carbs: 0,
  sugar: 0,
  sodium: 0,
});
(daysWithMeals as Mock).mockReturnValue(7);
```

**Assertions:**

```typescript
expect(text.text()).toContain('Average Protein: 100g');
```

---

#### Test 8: displays average carbs from `multiDayMealPlanNutrients()`

**Context:** `averageCarbs` = `multiDayMealPlanNutrients(plans).carbs / daysWithMeals(plans)`.

**Setup:**

```typescript
(multiDayMealPlanNutrients as Mock).mockReturnValue({
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 2102,
  sugar: 0,
  sodium: 0,
});
(daysWithMeals as Mock).mockReturnValue(7);
```

**Assertions:**

```typescript
expect(text.text()).toContain('Average Carbs: 300g');
```

---

#### Test 9: displays cheat days count

**Context:** A "cheat day" is any day where `dailyMealPlanNutrients(plan).calories > settings.dailyCalorieLimit` (limit = 2500 from settings mock).

**Setup:**

```typescript
const { getMealPlansForPeriod } = useMealPlansData();
// Return 3 plans; mock dailyMealPlanNutrients to exceed the limit for 2 of them
(getMealPlansForPeriod as Mock).mockResolvedValueOnce([plan1, plan2, plan3]);
(dailyMealPlanNutrients as Mock)
  .mockReturnValueOnce({ calories: 3000, ... }) // cheat day
  .mockReturnValueOnce({ calories: 2000, ... }) // not cheat
  .mockReturnValueOnce({ calories: 2800, ... }); // cheat day
wrapper = mountPage();
await flushPromises();
const card = wrapper.findAllComponents(components.VCard)[0]!;
const text = card.findComponent(components.VCardText);
```

**Assertions:**

```typescript
expect(text.text()).toContain('Cheat Days: 2');
```

**Note:** Use any two entries from `TEST_MEAL_PLANS` in `src/data/__tests__/test-data.ts` as `plan1`, `plan2`, `plan3`.

---

#### Test 10: displays zero average when no plans exist

**Context:** Guards against division-by-zero when a week has no meal plans.

**Setup:**

```typescript
(daysWithMeals as Mock).mockReturnValue(0);
(multiDayMealPlanNutrients as Mock).mockReturnValue({ calories: 0, protein: 0, fat: 0, carbs: 0, sugar: 0, sodium: 0 });
wrapper = mountPage();
await flushPromises();
```

**Assertions:**

```typescript
expect(text.text()).toContain('Average Calories: 0');
expect(text.text()).toContain('Average Protein: 0g');
expect(text.text()).toContain('Average Carbs: 0g');
```

---

## Key Implementation Notes

### Code to Replace

In `src/pages/planning/index.vue`, the entire body of `settings.promise.value.then(...)` (lines 139–173) must be rewritten. The random helpers (`randomDays`, `randomCalories`, `randomProtein`, `randomCarbs`, `randomCheatDays`) can be deleted.

### Implementation Sketch

```typescript
import { useMealPlansData } from '@/data/meal-plans';
import { daysWithMeals, dailyMealPlanNutrients, multiDayMealPlanNutrients } from '@/core/nutritional-calculations';

const { getMealPlansForPeriod } = useMealPlansData();

const buildWeeklyData = async (weekStart: Date, weekEnd: Date): Promise<WeeklyData> => {
  const plans = await getMealPlansForPeriod(format(weekStart, 'yyyy-MM-dd'), format(weekEnd, 'yyyy-MM-dd'));
  const days = daysWithMeals(plans);
  const totals = multiDayMealPlanNutrients(plans);
  const cheatCount = plans.filter(
    (p) => dailyMealPlanNutrients(p).calories > (settings.value?.dailyCalorieLimit ?? 0),
  ).length;
  return {
    startDate: weekStart,
    endDate: weekEnd,
    daysWithMeals: days,
    averageCalories: days > 0 ? Math.round(totals.calories / days) : 0,
    averageProtein: days > 0 ? Math.round(totals.protein / days) : 0,
    averageCarbs: days > 0 ? Math.round(totals.carbs / days) : 0,
    cheatDays: cheatCount,
  };
};
```

### `getMealPlansForPeriod` Date Format

The function signature is `getMealPlansForPeriod(startDate: string, endDate: string)`. Use `format(date, 'yyyy-MM-dd')` from `date-fns` (already imported).

### Mock Wiring

- `getMealPlansForPeriod` mock defaults to `[]` — override with `mockResolvedValueOnce` per call order in tests that check stats
- `daysWithMeals` and `multiDayMealPlanNutrients` must be added to the mock file or overridden per-test with `mockReturnValue`
- Settings mock already provides `dailyCalorieLimit: 2500` and `weekStartDay: 1` — no changes needed

### Pattern Reference

- Data fetching tests: see `src/pages/planning/__tests__/day.spec.ts` for `getMealPlanForDate` mock pattern
- Card text assertions: see existing `index.spec.ts` lines 63–65 for VCardTitle/VCardSubtitle, adapt for VCardText

---

## Why These Tests Matter

The current implementation produces random values on every render, making the page non-functional for actual meal planning. These tests enforce that:

1. Weekly stats are derived from real Firestore data via `useMealPlansData`
2. Nutritional averages are computed consistently using the shared `nutritional-calculations` module
3. Cheat day counts reflect the user's configured calorie limit
4. The zero-meals edge case is handled without a NaN or Infinity display
