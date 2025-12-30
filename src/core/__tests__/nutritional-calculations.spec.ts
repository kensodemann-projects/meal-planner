import { describe, expect, it } from 'vitest';
import { dailyMealPlanNutrients, mealNutrients } from '../nutritional-calculations';
import { TEST_MEAL_PLAN } from '@/data/__tests__/test-data';

describe('Nutritional Calculations', () => {
  describe('for a meal', () => {
    it('sums the data for the nutritional information for the data items', () => {
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

  describe('for a meal plan', () => {
    it('sums the data for each meal', () => {
      const mealPlan = TEST_MEAL_PLAN;
      const nutrientsPerMeal = mealPlan.meals.map((meal) => mealNutrients(meal));
      expect(dailyMealPlanNutrients(mealPlan)).toEqual({
        calories: nutrientsPerMeal.reduce((sum, n) => sum + n.calories, 0),
        protein: nutrientsPerMeal.reduce((sum, n) => sum + n.protein, 0),
        fat: nutrientsPerMeal.reduce((sum, n) => sum + n.fat, 0),
        carbs: nutrientsPerMeal.reduce((sum, n) => sum + n.carbs, 0),
        sugar: nutrientsPerMeal.reduce((sum, n) => sum + n.sugar, 0),
        sodium: nutrientsPerMeal.reduce((sum, n) => sum + n.sodium, 0),
      });
    });
  });
});
