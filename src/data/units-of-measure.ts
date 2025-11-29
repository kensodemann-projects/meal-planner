import type { UnitOfMeasure } from '@/models/unit-of-measure';

export const unitsOfMeasure: readonly UnitOfMeasure[] = [
  // Metric Volume
  { id: 'ml', name: 'Milliliter', type: 'volume', system: 'metric', fdcId: 1004 },
  { id: 'l', name: 'Liter', type: 'volume', system: 'metric', fdcId: 1003 },

  // American Conventional Volume
  { id: 'tsp', name: 'Teaspoon', type: 'volume', system: 'customary', fdcId: 1002 },
  { id: 'tbsp', name: 'Tablespoon', type: 'volume', system: 'customary', fdcId: 1001 },
  { id: 'floz', name: 'Fluid Ounce', type: 'volume', system: 'customary', fdcId: 1009 },
  { id: 'cup', name: 'Cup', type: 'volume', system: 'customary', fdcId: 1000 },
  { id: 'pint', name: 'Pint', type: 'volume', system: 'customary', fdcId: 1008 },
  { id: 'quart', name: 'Quart', type: 'volume', system: 'customary', fdcId: 1045 },
  { id: 'gallon', name: 'Gallon', type: 'volume', system: 'customary', fdcId: 1007 },

  // Metric Weight
  { id: 'mg', name: 'Milligram', type: 'weight', system: 'metric' },
  { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
  { id: 'kg', name: 'Kilogram', type: 'weight', system: 'metric' },

  // American Conventional Weight
  { id: 'oz', name: 'Ounce', type: 'weight', system: 'customary', fdcId: 1038 },
  { id: 'lb', name: 'Pound', type: 'weight', system: 'customary', fdcId: 1030 },

  // Quantity/Count (System-agnostic)
  { id: 'piece', name: 'Piece', type: 'quantity', system: 'none' },
  { id: 'item', name: 'Item', type: 'quantity', system: 'none', fdcId: 9999 },
  { id: 'each', name: 'Each', type: 'quantity', system: 'none' },
  { id: 'pinch', name: 'Pinch', type: 'quantity', system: 'none' },
  { id: 'serving', name: 'Serving', type: 'quantity', system: 'none' },
];
