import type { UnitOfMeasure } from '@/models/unit-of-measure';

export const unitsOfMeasure: readonly UnitOfMeasure[] = [
  // Metric Volume
  { id: 'ml', name: 'Milliliter', type: 'volume', system: 'metric' },
  { id: 'l', name: 'Liter', type: 'volume', system: 'metric' },

  // American Conventional Volume
  { id: 'tsp', name: 'Teaspoon', type: 'volume', system: 'customary' },
  { id: 'tbsp', name: 'Tablespoon', type: 'volume', system: 'customary' },
  { id: 'floz', name: 'Fluid Ounce', type: 'volume', system: 'customary' },
  { id: 'cup', name: 'Cup', type: 'volume', system: 'customary' },
  { id: 'pint', name: 'Pint', type: 'volume', system: 'customary' },
  { id: 'quart', name: 'Quart', type: 'volume', system: 'customary' },
  { id: 'gallon', name: 'Gallon', type: 'volume', system: 'customary' },

  // Metric Weight
  { id: 'mg', name: 'Milligram', type: 'weight', system: 'metric' },
  { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
  { id: 'kg', name: 'Kilogram', type: 'weight', system: 'metric' },

  // American Conventional Weight
  { id: 'oz', name: 'Ounce', type: 'weight', system: 'customary' },
  { id: 'lb', name: 'Pound', type: 'weight', system: 'customary' },

  // Quantity/Count (System-agnostic)
  { id: 'piece', name: 'Piece', type: 'quantity', system: 'none' },
  { id: 'item', name: 'Item', type: 'quantity', system: 'none' },
  { id: 'each', name: 'Each', type: 'quantity', system: 'none' },
  { id: 'pinch', name: 'Pinch', type: 'quantity', system: 'none' },
  { id: 'serving', name: 'Serving', type: 'quantity', system: 'none' },
];
