import type { Nutrition } from './nutrition';
import type { UnitOfMeasure } from './unit-of-measure';

export interface Portion extends Nutrition {
  units: number;
  unitOfMeasure: UnitOfMeasure;
  grams: number;
}
