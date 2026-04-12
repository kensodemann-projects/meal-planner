import type { Nutrition } from '@/models/nutrition';
import { vi } from 'vitest';

export const zeroNutrition: Nutrition = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  sugar: 0,
  sodium: 0,
};

export const mealNutrients: typeof import('@/core/nutritional-calculations').mealNutrients = vi
  .fn()
  .mockReturnValue(zeroNutrition);
export const dailyMealPlanNutrients: typeof import('@/core/nutritional-calculations').dailyMealPlanNutrients = vi
  .fn()
  .mockReturnValue(zeroNutrition);
export const multiDayMealPlanNutrients: typeof import('@/core/nutritional-calculations').multiDayMealPlanNutrients = vi
  .fn()
  .mockReturnValue(zeroNutrition);
export const daysWithMeals: typeof import('@/core/nutritional-calculations').daysWithMeals = vi.fn().mockReturnValue(0);
