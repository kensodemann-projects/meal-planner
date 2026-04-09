import type { MealPlan } from '@/models/meal-plan';
import type { Settings } from '@/models/settings';
import { describe, expect, it, vi } from 'vitest';
import { buildDataForWeek } from '../build-data-for-week';

const makeSettings = (weekStartDay: 0 | 1 = 0): Settings => ({
  dailyCalorieLimit: 2000,
  dailySugarLimit: 50,
  dailyProteinTarget: 150,
  tolerance: 10,
  cheatDays: 1,
  weekStartDay,
});

const makeMealPlan = (id: string, calories: number, protein: number, carbs: number): MealPlan => ({
  id,
  date: '2025-12-25',
  meals: [
    {
      id: `meal-${id}`,
      type: 'Lunch',
      items: [
        {
          id: `item-${id}`,
          name: 'Test Food',
          recipeId: 'test-recipe',
          servings: 1,
          nutrition: { calories, protein, carbs, fat: 0, sugar: 0, sodium: 0 },
        },
      ],
    },
  ],
});

// Dec 25, 2025 is a Thursday
const START_DATE = new Date(2025, 11, 25);

describe('buildDataForWeek', () => {
  it('calls getMealPlansForPeriod with ISO-formatted start and end dates', async () => {
    const getMealPlansForPeriod = vi.fn().mockResolvedValue([]);
    await buildDataForWeek(START_DATE, makeSettings(0), getMealPlansForPeriod);
    // weekStartsOn=0 (Sunday): week is Dec 21–27, so end date is Dec 27
    expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-25', '2025-12-27');
  });

  it('returns the provided startDate', async () => {
    const getMealPlansForPeriod = vi.fn().mockResolvedValue([]);
    const result = await buildDataForWeek(START_DATE, makeSettings(), getMealPlansForPeriod);
    expect(result.startDate).toBe(START_DATE);
  });

  it('returns an endDate based on the weekStartDay setting', async () => {
    const getMealPlansForPeriod = vi.fn().mockResolvedValue([]);

    // weekStartsOn=0 (Sunday): week ends Saturday Dec 27
    const sundayStart = await buildDataForWeek(START_DATE, makeSettings(0), getMealPlansForPeriod);
    expect(sundayStart.endDate.getFullYear()).toBe(2025);
    expect(sundayStart.endDate.getMonth()).toBe(11);
    expect(sundayStart.endDate.getDate()).toBe(27);

    // weekStartsOn=1 (Monday): week ends Sunday Dec 28
    const mondayStart = await buildDataForWeek(START_DATE, makeSettings(1), getMealPlansForPeriod);
    expect(mondayStart.endDate.getDate()).toBe(28);
  });

  it('passes the correct end date string to getMealPlansForPeriod based on weekStartDay', async () => {
    const getMealPlansForPeriod = vi.fn().mockResolvedValue([]);
    // weekStartsOn=1 (Monday): week is Dec 22–28, so end date is Dec 28
    await buildDataForWeek(START_DATE, makeSettings(1), getMealPlansForPeriod);
    expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-25', '2025-12-28');
  });

  it('returns the number of days that have meals', async () => {
    const mealPlans = [
      makeMealPlan('mp-1', 500, 30, 60),
      makeMealPlan('mp-2', 600, 40, 70),
      { ...makeMealPlan('mp-3', 0, 0, 0), meals: [] },
    ];
    const getMealPlansForPeriod = vi.fn().mockResolvedValue(mealPlans);
    const result = await buildDataForWeek(START_DATE, makeSettings(), getMealPlansForPeriod);
    expect(result.daysWithMeals).toBe(2);
  });

  it('calculates average calories, protein, and carbs over days with meals', async () => {
    const mealPlans = [makeMealPlan('mp-1', 500, 31, 62), makeMealPlan('mp-2', 601, 41, 71)];
    const getMealPlansForPeriod = vi.fn().mockResolvedValue(mealPlans);
    const result = await buildDataForWeek(START_DATE, makeSettings(), getMealPlansForPeriod);
    expect(result.averageCalories).toBe(Math.round((500 + 601) / 2));
    expect(result.averageProtein).toBe(Math.round((31 + 41) / 2));
    expect(result.averageCarbs).toBe(Math.round((62 + 71) / 2));
  });

  it('rounds averages to the nearest integer', async () => {
    // 3 items summing to values that produce non-integer averages
    const mealPlans = [
      makeMealPlan('mp-1', 100, 10, 20),
      makeMealPlan('mp-2', 200, 20, 30),
      makeMealPlan('mp-3', 300, 30, 40),
    ];
    const getMealPlansForPeriod = vi.fn().mockResolvedValue(mealPlans);
    const result = await buildDataForWeek(START_DATE, makeSettings(), getMealPlansForPeriod);
    expect(Number.isInteger(result.averageCalories)).toBe(true);
    expect(Number.isInteger(result.averageProtein)).toBe(true);
    expect(Number.isInteger(result.averageCarbs)).toBe(true);
  });

  it('returns zero averages when there are no days with meals', async () => {
    const getMealPlansForPeriod = vi.fn().mockResolvedValue([]);
    const result = await buildDataForWeek(START_DATE, makeSettings(), getMealPlansForPeriod);
    expect(result.averageCalories).toBe(0);
    expect(result.averageProtein).toBe(0);
    expect(result.averageCarbs).toBe(0);
  });
});
