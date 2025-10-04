import type { UnitOfMeasure } from '@/models/unit-of-measure';
import { readonly } from 'vue';

export const unitsOfMeasure: readonly UnitOfMeasure[] = readonly([
  // Metric Volume
  { id: 'ml', name: 'Milliliter', type: 'volume', system: 'metric' },
  { id: 'l', name: 'Liter', type: 'volume', system: 'metric' },
  { id: 'dl', name: 'Deciliter', type: 'volume', system: 'metric' },
  { id: 'cl', name: 'Centiliter', type: 'volume', system: 'metric' },

  // American Conventional Volume
  { id: 'tsp', name: 'Teaspoon', type: 'volume', system: 'customary' },
  { id: 'tbsp', name: 'Tablespoon', type: 'volume', system: 'customary' },
  { id: 'fl-oz', name: 'Fluid Ounce', type: 'volume', system: 'customary' },
  { id: 'cup', name: 'Cup', type: 'volume', system: 'customary' },
  { id: 'pint', name: 'Pint', type: 'volume', system: 'customary' },
  { id: 'quart', name: 'Quart', type: 'volume', system: 'customary' },
  { id: 'gallon', name: 'Gallon', type: 'volume', system: 'customary' },

  // Metric Weight
  { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
  { id: 'kg', name: 'Kilogram', type: 'weight', system: 'metric' },
  { id: 'mg', name: 'Milligram', type: 'weight', system: 'metric' },

  // American Conventional Weight
  { id: 'oz', name: 'Ounce', type: 'weight', system: 'customary' },
  { id: 'lb', name: 'Pound', type: 'weight', system: 'customary' },

  // Quantity/Count (System-agnostic)
  { id: 'piece', name: 'Piece', type: 'quantity', system: 'none' },
  { id: 'item', name: 'Item', type: 'quantity', system: 'none' },
  { id: 'each', name: 'Each', type: 'quantity', system: 'none' },
  { id: 'pinch', name: 'Pinch', type: 'quantity', system: 'none' },
]);

export const findUnitOfMeasure = (match: string): UnitOfMeasure => {
  const lowerMatch =
    match === 'T' ? 'tbsp' : match === 't' ? 'tsp' : match.toLowerCase().replace(/\s+/g, '').replace(/-/g, '').trim();
  return (
    unitsOfMeasure.find(
      (uom) => uom.id.toLowerCase() === lowerMatch || uom.name.toLowerCase().replace(/\s+/g, '') === lowerMatch,
    ) ?? unitsOfMeasure.find((uom) => uom.id === 'item')!
  );
};
