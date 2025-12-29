import { describe, expect, it } from 'vitest';
import { mealNutrients } from '../nutritional-calculations';
import { TEST_MEAL_PLAN } from '@/data/__tests__/test-data';

describe('Nutritional Calculations', () => {
  describe('for the meal', () => {
    it('sums the data for the items in the meal', () => {
      const meal = TEST_MEAL_PLAN.meals[0]!;
      expect(mealNutrients(meal)).toEqual({
        calories: meal.items.reduce((sum, item) => sum + item.nutrition.calories, 0),
        protein: meal.items.reduce((sum, item) => sum + item.nutrition.protein, 0),
        fat: meal.items.reduce((sum, item) => sum + item.nutrition.fat, 0),
        carbs: meal.items.reduce((sum, item) => sum + item.nutrition.carbs, 0),
        sugar: meal.items.reduce((sum, item) => sum + item.nutrition.sugar, 0),
        sodium: meal.items.reduce((sum, item) => sum + item.nutrition.sodium, 0),
      });
    });
  });
});
