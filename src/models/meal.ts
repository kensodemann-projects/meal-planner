import type { Nutrition } from './nutrition';

export interface MealItem {
  id: string;
  name: string;
  recipeId: string;
  servings: number;
  nutrition: Nutrition;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Meal {
  id: string;
  type: MealType;
  items: MealItem[];
}
