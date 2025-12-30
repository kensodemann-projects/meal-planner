// import type { FoodItem } from '@/models/food';
import type { Meal } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
// import type { MealPlan } from '@/models/meal-plan';
import type { Nutrition } from '@/models/nutrition';
// import type { UnitOfMeasure } from '@/models/unit-of-measure';

// export const foodItemNutrients = (foodItem: FoodItem, units: number, unitOfMeasure: UnitOfMeasure): Nutrition => ({
//   calories: 0,
//   protein: 0,
//   fat: 0,
//   carbs: 0,
//   sugar: 0,
//   sodium: 0,
// });

export const mealNutrients = (meal: Meal): Nutrition => ({
  calories: meal.items.reduce((sum, item) => sum + item.nutrition.calories, 0),
  protein: meal.items.reduce((sum, item) => sum + item.nutrition.protein, 0),
  fat: meal.items.reduce((sum, item) => sum + item.nutrition.fat, 0),
  carbs: meal.items.reduce((sum, item) => sum + item.nutrition.carbs, 0),
  sugar: meal.items.reduce((sum, item) => sum + item.nutrition.sugar, 0),
  sodium: meal.items.reduce((sum, item) => sum + item.nutrition.sodium, 0),
});

export const dailyMealPlanNutrients = (mealPlan: MealPlan): Nutrition =>
  mealPlan.meals.reduce(
    (nutrients, meal) => {
      const forMeal = mealNutrients(meal);
      return {
        calories: nutrients.calories + forMeal.calories,
        protein: nutrients.protein + forMeal.protein,
        fat: nutrients.fat + forMeal.fat,
        carbs: nutrients.carbs + forMeal.carbs,
        sugar: nutrients.sugar + forMeal.sugar,
        sodium: nutrients.sodium + forMeal.sodium,
      };
    },
    {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      sugar: 0,
      sodium: 0,
    },
  );

// export const multiDayMealPlanNutrients = (mealPlans: MealPlan[]): Nutrition => ({
//   calories: 0,
//   protein: 0,
//   fat: 0,
//   carbs: 0,
//   sugar: 0,
//   sodium: 0,
// });
