import type { Meal } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import type { Nutrition } from '@/models/nutrition';

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
 *     { id: '1', name: 'Eggs', units: 2, unitOfMeasure: {...}, nutrition: { calories: 140, ... } },
 *     { id: '2', name: 'Toast', units: 2, unitOfMeasure: {...}, nutrition: { calories: 160, ... } }
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
 *   meals: [...] // Array of Meal objects
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
 * const weeklyPlans = [...]; // Array of MealPlan objects
 * const weeklyNutrition = multiDayMealPlanNutrients(weeklyPlans);
 */
export const multiDayMealPlanNutrients = (mealPlans: MealPlan[]): Nutrition =>
  mealPlans.reduce((nutrients, mealPlan) => sumNutrition(nutrients, dailyMealPlanNutrients(mealPlan)), zeroNutrition);

/**
 * Calculate the number of days with at least one meal planned across multiple meal plans (e.g., weekly totals).
 *
 * This counts the number of meal plans that contain at least one meal, which can be useful for tracking.
 * It is assumed that each day will have at most one meal plan. If multiple meal plans are provided for the same day,
 * this function will count each meal plan separately.
 *
 * @param mealPlans - Array of meal plans to aggregate
 * @returns The number of days with at least one meal planned across all provided meal plans
 *
 * @example
 * const weeklyPlans = [...]; // Array of MealPlan objects
 * const days = daysWithMeals(weeklyPlans);
 */
export const daysWithMeals = (mealPlans: MealPlan[]): number =>
  mealPlans.reduce((count, mealPlan) => (mealPlan.meals.length > 0 ? count + 1 : count), 0);
