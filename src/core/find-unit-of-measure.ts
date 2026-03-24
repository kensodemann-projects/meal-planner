import { unitsOfMeasure } from '@/data/units-of-measure';
import { type UnitOfMeasure } from '../models/unit-of-measure';

/**
 * Finds a unit of measure by a search string.
 *
 * @param match - Unit name/abbreviation
 * @returns The matching UnitOfMeasure, or 'item' as a fallback if no match is found
 *
 * @example
 * findUnitOfMeasure('tsp') // Returns teaspoon unit
 * findUnitOfMeasure('unknown') // Returns 'item' unit as fallback
 */
export const findUnitOfMeasure = (match: string): UnitOfMeasure => {
  const lowerMatch =
    match === 'T' ? 'tbsp' : match === 't' ? 'tsp' : match.toLowerCase().replace(/\s+/g, '').replace(/-/g, '').trim();
  return (
    unitsOfMeasure.find(
      (uom) => uom.id.toLowerCase() === lowerMatch || uom.name.toLowerCase().replace(/\s+/g, '') === lowerMatch,
    ) ?? unitsOfMeasure.find((uom) => uom.id === 'item')!
  );
};
