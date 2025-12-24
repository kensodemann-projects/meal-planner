import type { FoodItem } from './food';
import type { Recipe } from './recipe';
import type { UnitOfMeasure } from './unit-of-measure';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  items: [
    {
      units: number;
      unitOfMeasure: UnitOfMeasure;
      item: FoodItem | Recipe;
    },
  ];
}
