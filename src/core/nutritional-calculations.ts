import type { FoodItem } from '@/models/food';
import type { Meal } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import type { Nutrition } from '@/models/nutrition';
import type { Portion } from '@/models/portion';
import type { UnitOfMeasure } from '@/models/unit-of-measure';
import { quantityConversionFactor } from './unit-conversion';

const zeroNutrition: Nutrition = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  sugar: 0,
  sodium: 0,
};

const sumNutrition = (a: Nutrition, b: Nutrition): Nutrition => ({
  calories: a.calories + b.calories,
  protein: a.protein + b.protein,
  fat: a.fat + b.fat,
  carbs: a.carbs + b.carbs,
  sugar: a.sugar + b.sugar,
  sodium: a.sodium + b.sodium,
});

const unitOfMeasureFit = (portion: Portion, units: number, unitOfMeasure: UnitOfMeasure): number => {
  try {
    const fit = quantityConversionFactor(portion, { unitOfMeasure, units });
    return fit > 1 ? 1 / fit : fit;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid conversion')) {
      // Incompatible unit conversion (e.g., 'each' to 'cup') – treat as no fit.
      return 0;
    }
    throw error;
  }
};

const bestFitPortion = (foodItem: FoodItem, units: number, unitOfMeasure: UnitOfMeasure): Portion | undefined => {
  let bestFitNumber = unitOfMeasureFit(foodItem, units, unitOfMeasure);
  let bestFitPortion: Portion | undefined;
  if (bestFitNumber > 0) {
    bestFitPortion = foodItem as Portion;
  }
  foodItem.alternativePortions.forEach((portion) => {
    const fitNumber = unitOfMeasureFit(portion, units, unitOfMeasure);
    if (fitNumber > bestFitNumber) {
      bestFitNumber = fitNumber;
      bestFitPortion = portion;
    }
  });
  return bestFitPortion;
};

/**
 * Calculate nutritional information for a food item at a specific quantity and unit of measure.
 *
 * This function finds the best-fit portion definition from the food item's base portion or
 * alternative portions, then scales the nutritional values based on the requested quantity.
 *
 * @param foodItem - The food item to calculate nutrition for
 * @param units - The quantity of the food item
 * @param unitOfMeasure - The unit of measure for the quantity
 * @returns The calculated nutrition, or undefined if no compatible portion definition exists
 *          (e.g., when trying to convert incompatible units like "each" to "cup").
 *          Callers should validate inputs upstream or handle the undefined case explicitly.
 *
 * @example
 * // Returns calculated nutrition for 2 cups of milk
 * const nutrition = foodItemNutrients(milkFoodItem, 2, cupUnit);
 *
 * @example
 * // Returns undefined for incompatible unit conversion
 * const nutrition = foodItemNutrients(appleFoodItem, 1, cupUnit); // apples measured in "each"
 */
export const foodItemNutrients = (
  foodItem: FoodItem,
  units: number,
  unitOfMeasure: UnitOfMeasure,
): Nutrition | undefined => {
  const portion = bestFitPortion(foodItem, units, unitOfMeasure);
  if (portion) {
    const factor = quantityConversionFactor(portion, { unitOfMeasure, units });
    return {
      calories: Math.round(portion.calories * factor),
      protein: Math.round(portion.protein * factor),
      fat: Math.round(portion.fat * factor),
      carbs: Math.round(portion.carbs * factor),
      sugar: Math.round(portion.sugar * factor),
      sodium: Math.round(portion.sodium * factor),
    };
  }
};

/**
 * Calculate total nutritional information for a meal by summing all meal item nutrients.
 *
 * **Important**: This function expects all meal items to already have their `nutrition`
 * property calculated. Meal items with missing or invalid nutrition data should be
 * validated upstream before creating the meal. If a meal item's nutrition is undefined,
 * this will result in a runtime error.
 *
 * @param meal - The meal containing items with pre-calculated nutrition
 * @returns The sum of all nutritional values across meal items
 *
 * @example
 * const meal: Meal = {
 *   id: '1',
 *   name: 'Breakfast',
 *   type: 'Breakfast',
 *   items: [
 *     { id: '1', name: 'Eggs', units: 2, unitOfMeasure: eachUnit, nutrition: { calories: 140, ... } },
 *     { id: '2', name: 'Toast', units: 2, unitOfMeasure: sliceUnit, nutrition: { calories: 160, ... } }
 *   ]
 * };
 * const totalNutrition = mealNutrients(meal); // { calories: 300, ... }
 */
export const mealNutrients = (meal: Meal): Nutrition =>
  meal.items.reduce((nutrients, item) => sumNutrition(nutrients, item.nutrition), zeroNutrition);

/**
 * Calculate total nutritional information for a single-day meal plan.
 *
 * This sums the nutritional values across all meals in the plan.
 *
 * @param mealPlan - The meal plan for a single day
 * @returns The total nutritional values for all meals in the plan
 *
 * @example
 * const dailyPlan: MealPlan = {
 *   id: '1',
 *   date: '2024-01-01',
 *   meals: [breakfastMeal, lunchMeal, dinnerMeal]
 * };
 * const dailyNutrition = dailyMealPlanNutrients(dailyPlan);
 */
export const dailyMealPlanNutrients = (mealPlan: MealPlan): Nutrition =>
  mealPlan.meals.reduce((nutrients, meal) => sumNutrition(nutrients, mealNutrients(meal)), zeroNutrition);

/**
 * Calculate total nutritional information across multiple meal plans (e.g., weekly totals).
 *
 * This sums the nutritional values across all meal plans provided, useful for
 * calculating weekly, monthly, or custom period nutritional totals.
 *
 * @param mealPlans - Array of meal plans to aggregate
 * @returns The total nutritional values across all provided meal plans
 *
 * @example
 * const weeklyPlans = [mondayPlan, tuesdayPlan, wednesdayPlan, thursdayPlan, fridayPlan];
 * const weeklyNutrition = multiDayMealPlanNutrients(weeklyPlans);
 */
export const multiDayMealPlanNutrients = (mealPlans: MealPlan[]): Nutrition =>
  mealPlans.reduce((nutrients, mealPlan) => sumNutrition(nutrients, dailyMealPlanNutrients(mealPlan)), zeroNutrition);
