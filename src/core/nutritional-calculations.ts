import type { FoodItem } from '@/models/food';
import type { Meal } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import type { Nutrition } from '@/models/nutrition';
import type { Portion } from '@/models/portion';
import type { UnitOfMeasure } from '@/models/unit-of-measure';

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

const bestFitPortion = (foodItem: FoodItem, unitOfMeasure: UnitOfMeasure): Portion | undefined => {
  if (foodItem.unitOfMeasure.id === unitOfMeasure.id) {
    return foodItem as Portion;
  }
  return foodItem.alternativePortions.find((portion) => portion.unitOfMeasure.id === unitOfMeasure.id);
};

export const foodItemNutrients = (
  foodItem: FoodItem,
  units: number,
  unitOfMeasure: UnitOfMeasure,
): Nutrition | undefined => {
  const portion = bestFitPortion(foodItem, unitOfMeasure);
  if (portion) {
    return {
      calories: (portion.calories / portion.units) * units,
      protein: (portion.protein / portion.units) * units,
      fat: (portion.fat / portion.units) * units,
      carbs: (portion.carbs / portion.units) * units,
      sugar: (portion.sugar / portion.units) * units,
      sodium: (portion.sodium / portion.units) * units,
    };
  }
};

export const mealNutrients = (meal: Meal): Nutrition =>
  meal.items.reduce((nutrients, item) => sumNutrition(nutrients, item.nutrition), zeroNutrition);

export const dailyMealPlanNutrients = (mealPlan: MealPlan): Nutrition =>
  mealPlan.meals.reduce((nutrients, meal) => sumNutrition(nutrients, mealNutrients(meal)), zeroNutrition);

export const multiDayMealPlanNutrients = (mealPlans: MealPlan[]): Nutrition =>
  mealPlans.reduce((nutrients, mealPlan) => sumNutrition(nutrients, dailyMealPlanNutrients(mealPlan)), zeroNutrition);
