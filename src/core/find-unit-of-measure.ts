import { unitsOfMeasure } from '@/data/units-of-measure';
import { type UnitOfMeasure } from '@/models/unit-of-measure';

/**
 * Finds a unit of measure by a search string. This function is most useful for parsing input that could come
 * from various external data sources that are not using the UnitOfMeasure.id values, such as user input or
 * data from APIs. It performs a case-insensitive search and ignores
 *
 * Since it will do an `id` search, however, it is also can be used in cases where the input is expected to be a
 * UnitOfMeasure.id.
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
