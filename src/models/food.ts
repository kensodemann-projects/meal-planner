import type { Portion } from './portion';

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
export interface FoodItem extends Portion {
  id?: string;
  fdcId?: number | null;
  name: string;
  brand?: string | null;
  category: FoodCategory;
  alternativePortions: Portion[];
}
