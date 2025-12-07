import type { UnitOfMeasure } from './unit-of-measure';

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
