import type { MealPlan } from '@/models/meal-plan';
import type { Settings } from '@/models/settings';
import { describe, expect, it, vi } from 'vitest';
import { buildWeeklyData } from '../build-weekly-data';
import type { Nutrition } from '@/models/nutrition';

const makeSettings = (weekStartDay: 0 | 1 = 0): Settings => ({
  minDailyCalories: 2000,
  maxDailyCalories: 2500,
  minDailyProtein: 50,
  maxDailyProtein: 150,
  minDailyCarbs: 100,
  maxDailyCarbs: 300,
  minDailyFat: 20,
  maxDailyFat: 70,
  minDailySodium: 1500,
  maxDailySodium: 2300,
  maxDailySugar: 50,
  tolerance: 10,
  weekStartDay,
});

const makeMealPlan = (id: string, meals: Nutrition[][]): MealPlan => ({
  id,
  date: '2025-12-25',
  meals: meals.map((items, mealIndex) => ({
    id: `meal-${id}-${mealIndex}`,
    type: 'Lunch',
    items: items.map((nutrition, itemIndex) => ({
      id: `item-${id}-${mealIndex}-${itemIndex}`,
      name: 'Test Food',
      recipeId: 'test-recipe',
      servings: 1,
      nutrition,
    })),
  })),
});

// Dec 25, 2025 is a Thursday
const START_DATE = new Date(2025, 11, 25);

describe('buildWeeklyData', () => {
  it('calls getMealPlansForPeriod with ISO-formatted start and end dates', async () => {
    const getMealPlansForPeriod = vi.fn().mockResolvedValue([]);
    await buildWeeklyData(START_DATE, makeSettings(0), getMealPlansForPeriod);
    // weekStartsOn=0 (Sunday): week is Dec 21–27, so end date is Dec 27
    expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-25', '2025-12-27');
  });

  it('returns the provided startDate', async () => {
    const getMealPlansForPeriod = vi.fn().mockResolvedValue([]);
    const result = await buildWeeklyData(START_DATE, makeSettings(), getMealPlansForPeriod);
    expect(result.startDate).toBe(START_DATE);
  });

  it('returns an endDate based on the weekStartDay setting', async () => {
    const getMealPlansForPeriod = vi.fn().mockResolvedValue([]);

    // weekStartsOn=0 (Sunday): week ends Saturday Dec 27
    const sundayStart = await buildWeeklyData(START_DATE, makeSettings(0), getMealPlansForPeriod);
    expect(sundayStart.endDate.getFullYear()).toBe(2025);
    expect(sundayStart.endDate.getMonth()).toBe(11);
    expect(sundayStart.endDate.getDate()).toBe(27);

    // weekStartsOn=1 (Monday): week ends Sunday Dec 28
    const mondayStart = await buildWeeklyData(START_DATE, makeSettings(1), getMealPlansForPeriod);
    expect(mondayStart.endDate.getDate()).toBe(28);
  });

  it('passes the correct end date string to getMealPlansForPeriod based on weekStartDay', async () => {
    const getMealPlansForPeriod = vi.fn().mockResolvedValue([]);
    // weekStartsOn=1 (Monday): week is Dec 22–28, so end date is Dec 28
    await buildWeeklyData(START_DATE, makeSettings(1), getMealPlansForPeriod);
    expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-25', '2025-12-28');
  });

  it('returns the number of days that have meals', async () => {
    const mealPlans = [
      makeMealPlan('mp-1', [[{ calories: 500, protein: 30, carbs: 60, fat: 10, sodium: 700, sugar: 20 }]]),
      makeMealPlan('mp-2', [[{ calories: 600, protein: 40, carbs: 70, fat: 20, sodium: 1700, sugar: 35 }]]),
      makeMealPlan('mp-3', []),
    ];
    const getMealPlansForPeriod = vi.fn().mockResolvedValue(mealPlans);
    const result = await buildWeeklyData(START_DATE, makeSettings(), getMealPlansForPeriod);
    expect(result.daysWithMeals).toBe(2);
  });

  it('calculates average nutritional data over days with meals', async () => {
    const mealPlans = [
      makeMealPlan('mp-1', [
        [{ calories: 300, protein: 20, carbs: 40, fat: 5, sodium: 300, sugar: 23 }],
        [{ calories: 200, protein: 11, carbs: 22, fat: 4, sodium: 500, sugar: 12 }],
      ]),
      makeMealPlan('mp-2', [
        [
          { calories: 400, protein: 25, carbs: 35, fat: 9, sodium: 800, sugar: 15 },
          { calories: 201, protein: 16, carbs: 36, fat: 12, sodium: 900, sugar: 18 },
        ],
      ]),
    ];
    const getMealPlansForPeriod = vi.fn().mockResolvedValue(mealPlans);
    const result = await buildWeeklyData(START_DATE, makeSettings(), getMealPlansForPeriod);
    // mp-1: 500 cal / 31 protein / 62 carbs; mp-2: 601 cal / 41 protein / 71 carbs
    expect(result.averageCalories).toBe(Math.round((500 + 601) / 2));
    expect(result.averageProtein).toBe(Math.round((31 + 41) / 2));
    expect(result.averageCarbs).toBe(Math.round((62 + 71) / 2));
    expect(result.averageFat).toBe(Math.round((9 + 21) / 2));
    expect(result.averageSodium).toBe(Math.round((800 + 1700) / 2));
    expect(result.averageSugar).toBe(Math.round((35 + 33) / 2));
  });

  it('rounds averages to the nearest integer', async () => {
    // 3 days summing to values that produce non-integer averages
    const mealPlans = [
      makeMealPlan('mp-1', [[{ calories: 100, protein: 10, carbs: 20, fat: 5, sodium: 500, sugar: 10 }]]),
      makeMealPlan('mp-2', [[{ calories: 200, protein: 20, carbs: 30, fat: 10, sodium: 1000, sugar: 20 }]]),
      makeMealPlan('mp-3', [[{ calories: 300, protein: 30, carbs: 40, fat: 15, sodium: 1500, sugar: 30 }]]),
    ];
    const getMealPlansForPeriod = vi.fn().mockResolvedValue(mealPlans);
    const result = await buildWeeklyData(START_DATE, makeSettings(), getMealPlansForPeriod);
    expect(Number.isInteger(result.averageCalories)).toBe(true);
    expect(Number.isInteger(result.averageProtein)).toBe(true);
    expect(Number.isInteger(result.averageCarbs)).toBe(true);
    expect(Number.isInteger(result.averageFat)).toBe(true);
    expect(Number.isInteger(result.averageSodium)).toBe(true);
    expect(Number.isInteger(result.averageSugar)).toBe(true);
  });

  it('returns zero averages when there are no days with meals', async () => {
    const getMealPlansForPeriod = vi.fn().mockResolvedValue([]);
    const result = await buildWeeklyData(START_DATE, makeSettings(), getMealPlansForPeriod);
    expect(result.averageCalories).toBe(0);
    expect(result.averageProtein).toBe(0);
    expect(result.averageCarbs).toBe(0);
    expect(result.averageFat).toBe(0);
    expect(result.averageSodium).toBe(0);
    expect(result.averageSugar).toBe(0);
  });
});
