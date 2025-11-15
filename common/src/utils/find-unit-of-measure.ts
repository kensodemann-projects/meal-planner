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

export const findUnitOfMeasure = (match: string | number): UnitOfMeasure => {
  if (typeof match === 'string') {
    return findBySearchString(match);
  } else {
    return findByFdcId(match);
  }
};
