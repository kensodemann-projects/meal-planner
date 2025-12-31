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

export const mealNutrients = (meal: Meal): Nutrition =>
  meal.items.reduce((nutrients, item) => sumNutrition(nutrients, item.nutrition), zeroNutrition);

export const dailyMealPlanNutrients = (mealPlan: MealPlan): Nutrition =>
  mealPlan.meals.reduce((nutrients, meal) => sumNutrition(nutrients, mealNutrients(meal)), zeroNutrition);

export const multiDayMealPlanNutrients = (mealPlans: MealPlan[]): Nutrition =>
  mealPlans.reduce((nutrients, mealPlan) => sumNutrition(nutrients, dailyMealPlanNutrients(mealPlan)), zeroNutrition);
