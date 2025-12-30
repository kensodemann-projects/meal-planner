import { describe, expect, it } from 'vitest';
import { dailyMealPlanNutrients, mealNutrients } from '../nutritional-calculations';
import { TEST_MEAL_PLAN } from '@/data/__tests__/test-data';
import type { MealItem } from '@/models/meal';

describe('Nutritional Calculations', () => {
  describe('for a meal', () => {
    it('sums the data for the nutritional information for the data items', () => {
      let calories = 0;
      let protein = 0;
      let fat = 0;
      let carbs = 0;
      let sugar = 0;
      let sodium = 0;
      TEST_MEAL_PLAN.meals[0]!.items.forEach((item) => {
        calories = calories + item.nutrition.calories;
        protein = protein + item.nutrition.protein;
        fat = fat + item.nutrition.fat;
        carbs = carbs + item.nutrition.carbs;
        sugar = sugar + item.nutrition.sugar;
        sodium = sodium + item.nutrition.sodium;
      });
      expect(mealNutrients(TEST_MEAL_PLAN.meals[0]!)).toEqual({
        calories,
        protein,
        fat,
        carbs,
        sugar,
        sodium,
      });
    });
  });

  describe('for a meal plan', () => {
    it('sums the data for each meal', () => {
      const mealItems: MealItem[] = [];
      TEST_MEAL_PLAN.meals.forEach((meal) => {
        mealItems.push(...meal.items);
      });
      let calories = 0;
      let protein = 0;
      let fat = 0;
      let carbs = 0;
      let sugar = 0;
      let sodium = 0;
      mealItems.forEach((item) => {
        calories = calories + item.nutrition.calories;
        protein = protein + item.nutrition.protein;
        fat = fat + item.nutrition.fat;
        carbs = carbs + item.nutrition.carbs;
        sugar = sugar + item.nutrition.sugar;
        sodium = sodium + item.nutrition.sodium;
      });
      expect(dailyMealPlanNutrients(TEST_MEAL_PLAN)).toEqual({
        calories,
        protein,
        fat,
        carbs,
        sugar,
        sodium,
      });
    });
  });
});
