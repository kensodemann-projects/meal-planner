import { beforeEach, describe, expect, it } from 'vitest';
import {
  dailyMealPlanNutrients,
  foodItemNutrients,
  mealNutrients,
  multiDayMealPlanNutrients,
} from '../nutritional-calculations';
import { TEST_FOODS, TEST_MEAL_PLAN, TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import type { MealItem } from '@/models/meal';
import type { FoodItem } from '@/models/food';

describe('Nutritional Calculations', () => {
  describe('for a food item', () => {
    let foodItem: FoodItem;
    beforeEach(() => {
      foodItem = { ...TEST_FOODS.find((f) => f.id === '8')! };
      foodItem.fat = 3;
      foodItem.alternativePortions.forEach((portion) => {
        const factor = portion.grams / foodItem.grams;
        portion.sodium = Math.round(foodItem.sodium * factor);
        portion.sugar = Math.round(foodItem.sugar * factor);
        portion.carbs = Math.round(foodItem.carbs * factor);
        portion.protein = Math.round(foodItem.protein * factor);
        portion.fat = Math.round(foodItem.fat * factor);
      });
    });

    it('uses the base portion if the Unit of Measure matches', () => {
      const nutrients = foodItemNutrients(foodItem, 1, foodItem.unitOfMeasure);
      expect(nutrients).toEqual({
        calories: foodItem.calories,
        protein: foodItem.protein,
        fat: foodItem.fat,
        carbs: foodItem.carbs,
        sugar: foodItem.sugar,
        sodium: foodItem.sodium,
      });
    });

    it('uses the exact match alternative portion if one exists', () => {
      foodItem.alternativePortions.forEach((portion) => {
        const nutrients = foodItemNutrients(foodItem, portion.units, portion.unitOfMeasure);
        expect(nutrients).toEqual({
          calories: portion.calories,
          protein: portion.protein,
          fat: portion.fat,
          carbs: portion.carbs,
          sugar: portion.sugar,
          sodium: portion.sodium,
        });
      });
    });
  });

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

  describe('for several meal plans', () => {
    it('sums the data for each meal', () => {
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
      expect(multiDayMealPlanNutrients(mealPlans)).toEqual({
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
