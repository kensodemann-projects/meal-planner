import type { Nutrition } from './nutrition';
import type { UnitOfMeasure } from './unit-of-measure';

export interface MealItem {
  id: string;
  name: string;
  units: number;
  unitOfMeasure: UnitOfMeasure;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  nutrition: Nutrition;
  items: MealItem[];
}
