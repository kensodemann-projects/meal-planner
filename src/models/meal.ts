import type { FoodItem } from './food';
import type { Nutrition } from './nutrition';
import type { Recipe } from './recipe';
import type { UnitOfMeasure } from './unit-of-measure';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  nutrition: Nutrition;
  items: [
    {
      units: number;
      unitOfMeasure: UnitOfMeasure;
      item: FoodItem | Recipe;
    },
  ];
}
