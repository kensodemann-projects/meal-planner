import type { UnitOfMeasure } from './unit-of-measure';

export type FoodCategory =
  | 'Bakery'
  | 'Beans'
  | 'Beverages'
  | 'Dairy'
  | 'Fats & Oils'
  | 'Juices'
  | 'Mixed Foods'
  | 'Nuts & Seeds'
  | 'Produce'
  | 'Grains'
  | 'Meats'
  | 'Snacks'
  | 'Spices'
  | 'Sweets'
  | 'Unknown';

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
  fdcId: number;
  name: string;
  brand?: string;
  category: FoodCategory;
  alternativePortions: Portion[];
}
