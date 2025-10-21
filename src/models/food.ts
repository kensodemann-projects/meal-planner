import type { UnitOfMeasure } from './unit-of-measure';

export type FoodCategory =
  | 'Bakery'
  | 'Beans'
  | 'Beverages'
  | 'Dairy'
  | 'Fats & Oils'
  | 'Grains'
  | 'Juices'
  | 'Meats'
  | 'Mixed Foods'
  | 'Nuts & Seeds'
  | 'Produce'
  | 'Snacks'
  | 'Spices'
  | 'Sweets'
  | 'Unknown';

export const foodCategories: FoodCategory[] = [
  'Bakery',
  'Beans',
  'Beverages',
  'Dairy',
  'Fats & Oils',
  'Grains',
  'Juices',
  'Meats',
  'Mixed Foods',
  'Nuts & Seeds',
  'Produce',
  'Snacks',
  'Spices',
  'Sweets',
  'Unknown',
];

export interface Portion {
  units: number;
  unitOfMeasure: UnitOfMeasure;
  grams: number;
  calories: number;
  sodium: number;
  fat: number;
  protein: number;
  carbs: number;
  sugar: number;
}
export interface FoodItem extends Portion {
  id?: string;
  fdcId?: number | null;
  name: string;
  brand?: string | null;
  category: FoodCategory;
  alternativePortions: Portion[];
}
