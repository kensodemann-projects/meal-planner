import type { Nutrition } from './nutrition';
import type { UnitOfMeasure } from './unit-of-measure';

export interface MealItem {
  id: string;
  name: string;
  recipeId?: string;
  foodItemId?: string;
  units: number;
  unitOfMeasure: UnitOfMeasure;
  nutrition: Nutrition;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Meal {
  id: string;
  type: MealType;
  items: MealItem[];
}
