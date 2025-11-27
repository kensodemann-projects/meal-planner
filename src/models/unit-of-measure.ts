export interface UnitOfMeasure {
  id: string;
  name: string;
  type: 'weight' | 'volume' | 'quantity';
  system: 'metric' | 'customary' | 'none';
  fdcId?: number;
}
