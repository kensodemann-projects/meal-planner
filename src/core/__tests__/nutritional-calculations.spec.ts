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
import type { Nutrition } from '@/models/nutrition';
import { unitsOfMeasure } from '@/data/units-of-measure';

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

    it('handles differing units', () => {
      const portion = foodItem.alternativePortions[1]!;
      expect(foodItemNutrients(foodItem, 1, portion.unitOfMeasure)).toEqual({
        calories: Math.round(portion.calories / 2),
        protein: Math.round(portion.protein / 2),
        fat: Math.round(portion.fat / 2),
        carbs: Math.round(portion.carbs / 2),
        sugar: Math.round(portion.sugar / 2),
        sodium: Math.round(portion.sodium / 2),
      });
    });

    it('handles differing units of measure', () => {
      let portion = foodItem.alternativePortions[0]!;
      let um = unitsOfMeasure.find((u) => u.id === 'pint')!;
      expect(foodItemNutrients(foodItem, 1, um)).toEqual({
        calories: Math.round(portion.calories * 2),
        protein: Math.round(portion.protein * 2),
        fat: Math.round(portion.fat * 2),
        carbs: Math.round(portion.carbs * 2),
        sugar: Math.round(portion.sugar * 2),
        sodium: Math.round(portion.sodium * 2),
      });

      portion = foodItem.alternativePortions[2]!;
      um = unitsOfMeasure.find((u) => u.id === 'lb')!;
      expect(foodItemNutrients(foodItem, 1, um)).toEqual({
        calories: Math.round((portion.calories * 16) / 5),
        protein: Math.round((portion.protein * 16) / 5),
        fat: Math.round((portion.fat * 16) / 5),
        carbs: Math.round((portion.carbs * 16) / 5),
        sugar: Math.round((portion.sugar * 16) / 5),
        sodium: Math.round((portion.sodium * 16) / 5),
      });
    });

    it('return undefined if no good portion can be found', () => {
      const foodItem = { ...TEST_FOODS.find((f) => f.id === '2')! };
      expect(foodItemNutrients(foodItem, 1, unitsOfMeasure.find((u) => u.id === 'cup')!)).toBeUndefined();
    });
  });

  describe('for a meal', () => {
    it('sums the data for the nutritional information for the data items', () => {
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
      const expected = sumMealItemNutrients(mealItems);
      expect(multiDayMealPlanNutrients(mealPlans)).toEqual(expected);
    });
  });
});
