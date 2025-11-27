import { type UnitOfMeasure, unitsOfMeasure } from '../models/unit-of-measure';

const findBySearchString = (match: string): UnitOfMeasure => {
  const lowerMatch =
    match === 'T' ? 'tbsp' : match === 't' ? 'tsp' : match.toLowerCase().replace(/\s+/g, '').replace(/-/g, '').trim();
  return (
    unitsOfMeasure.find(
      (uom) => uom.id.toLowerCase() === lowerMatch || uom.name.toLowerCase().replace(/\s+/g, '') === lowerMatch,
    ) ?? unitsOfMeasure.find((uom) => uom.id === 'item')!
  );
};

const findByFdcId = (fdcId: number): UnitOfMeasure => {
  return unitsOfMeasure.find((uom) => uom.fdcId === fdcId) ?? unitsOfMeasure.find((uom) => uom.fdcId === 9999)!;
};

/**
 * Finds a unit of measure by either a search string or FDC ID.
 *
 * @param match - Either a string (unit name/abbreviation) or number (FDC ID) to search for
 * @returns The matching UnitOfMeasure, or 'item' as a fallback if no match is found
 *
 * @example
 * findUnitOfMeasure('tsp') // Returns teaspoon unit
 * findUnitOfMeasure(1002) // Returns teaspoon unit by FDC ID
 * findUnitOfMeasure('unknown') // Returns 'item' unit as fallback
 */
export const findUnitOfMeasure = (match: string | number): UnitOfMeasure => {
  if (typeof match === 'string') {
    return findBySearchString(match);
  } else {
    return findByFdcId(match);
  }
};
