import { TEST_MEAL_PLAN, TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import type { MealItem } from '@/models/meal';
import type { Nutrition } from '@/models/nutrition';
import { describe, expect, it } from 'vitest';
import {
  dailyMealPlanNutrients,
  daysWithMeals,
  mealNutrients,
  multiDayMealPlanNutrients,
} from '../nutritional-calculations';

const sumMealItemNutrients = (items: MealItem[]): Nutrition => {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.nutrition.calories,
      protein: acc.protein + item.nutrition.protein,
      fat: acc.fat + item.nutrition.fat,
      carbs: acc.carbs + item.nutrition.carbs,
      sugar: acc.sugar + item.nutrition.sugar,
      sodium: acc.sodium + item.nutrition.sodium,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0, sugar: 0, sodium: 0 },
  );
};

describe('Nutritional Calculations', () => {
  describe('for a meal', () => {
    it('sums the nutritional information for the meal items', () => {
      const expected = sumMealItemNutrients(TEST_MEAL_PLAN.meals[0]!.items);
      expect(mealNutrients(TEST_MEAL_PLAN.meals[0]!)).toEqual(expected);
    });
  });

  describe('for a meal plan', () => {
    it('sums the data for each meal', () => {
      const mealItems: MealItem[] = [];
      TEST_MEAL_PLAN.meals.forEach((meal) => {
        mealItems.push(...meal.items);
      });
      const expected = sumMealItemNutrients(mealItems);
      expect(dailyMealPlanNutrients(TEST_MEAL_PLAN)).toEqual(expected);
    });
  });

  describe('for several meal plans', () => {
    it('sums the nutritional data for each meal plan', () => {
      const mealPlans = [
        TEST_MEAL_PLANS[0]!,
        TEST_MEAL_PLANS[1]!,
        TEST_MEAL_PLANS[2]!,
        TEST_MEAL_PLANS[5]!,
        TEST_MEAL_PLANS[7]!,
      ];
      const mealItems: MealItem[] = [];
      mealPlans.forEach((mealPlan) => {
        mealPlan.meals.forEach((meal) => {
          mealItems.push(...meal.items);
        });
      });
      const expected = sumMealItemNutrients(mealItems);
      expect(multiDayMealPlanNutrients(mealPlans)).toEqual(expected);
    });
  });

  describe('days with meals', () => {
    it('returns the number of days that have meals', () => {
      const mealPlans = [
        TEST_MEAL_PLANS[0],
        TEST_MEAL_PLANS[1],
        { ...TEST_MEAL_PLANS[2], meals: [] },
        TEST_MEAL_PLANS[5],
        TEST_MEAL_PLANS[7],
      ];
      expect(daysWithMeals(mealPlans)).toBe(4);
    });
  });
});
