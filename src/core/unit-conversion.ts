import type { Portion } from '@/models/food';
import { findUnitOfMeasure } from './find-unit-of-measure';
import type { UnitOfMeasure } from '@/models/unit-of-measure';

interface UnitConversionFactor {
  id: string;
  factorToNext: number;
}
type Quantity = Pick<Portion, 'unitOfMeasure' | 'units'>;

const conversionTables = new Map();
conversionTables.set('metric weight', [
  { id: 'mg', factorToNext: 1000 },
  { id: 'g', factorToNext: 1000 },
  { id: 'kg', factorToNext: 1 },
]);
conversionTables.set('metric volume', [
  { id: 'ml', factorToNext: 1000 },
  { id: 'l', factorToNext: 1 },
]);
conversionTables.set('customary weight', [
  { id: 'oz', factorToNext: 16 },
  { id: 'lb', factorToNext: 1 },
]);
conversionTables.set('customary volume', [
  { id: 'tsp', factorToNext: 3 },
  { id: 'tbsp', factorToNext: 2 },
  { id: 'floz', factorToNext: 8 },
  { id: 'cup', factorToNext: 2 },
  { id: 'pint', factorToNext: 2 },
  { id: 'quart', factorToNext: 4 },
  { id: 'gallon', factorToNext: 1 },
]);

const milliLiter = findUnitOfMeasure('ml');
const fluidOunce = findUnitOfMeasure('floz');
const mlToFloz = 29.5735;
const gram = findUnitOfMeasure('g');
const ounce = findUnitOfMeasure('oz');
const gToOz = 28.3495;

const getConversionFactor = (from: UnitOfMeasure, to: UnitOfMeasure): number => {
  const table = conversionTables.get(`${from.system} ${from.type}`);
  const fromIdx = table.findIndex((x: UnitConversionFactor) => x.id === from.id);
  const toIdx = table.findIndex((x: UnitConversionFactor) => x.id === to.id);
  const reverse = fromIdx > toIdx;
  const start = reverse ? toIdx : fromIdx;
  const end = reverse ? fromIdx : toIdx;
  let factor = 1;

  for (let x = start; x < end; x++) {
    factor *= table[x]!.factorToNext;
  }

  return reverse ? 1 / factor : factor;
};

export const getVolumeConversionFactor = (from: UnitOfMeasure, to: UnitOfMeasure): number => {
  if (from.system === 'metric' && to.system === 'customary') {
    return getConversionFactor(from, milliLiter) * mlToFloz * getConversionFactor(fluidOunce, to);
  }
  if (from.system === 'customary' && to.system === 'metric') {
    return (getConversionFactor(from, fluidOunce) / mlToFloz) * getConversionFactor(milliLiter, to);
  }
  return getConversionFactor(from, to);
};

export const getWeightConversionFactor = (from: UnitOfMeasure, to: UnitOfMeasure): number => {
  if (from.system === 'metric' && to.system === 'customary') {
    return getConversionFactor(from, gram) * gToOz * getConversionFactor(ounce, to);
  }
  if (from.system === 'customary' && to.system === 'metric') {
    return (getConversionFactor(from, ounce) / gToOz) * getConversionFactor(gram, to);
  }
  return getConversionFactor(from, to);
};

export const unitConversionFactor = (from: UnitOfMeasure, to: UnitOfMeasure): number => {
  if ((from.type === 'quantity' && from.id !== to.id) || from.type !== to.type) {
    throw new Error('Invalid conversion');
  }

  return from.type === 'volume'
    ? getVolumeConversionFactor(from, to)
    : from.type === 'weight'
      ? getWeightConversionFactor(from, to)
      : 1;
};

export const quantityConversionFactor = (from: Quantity, to: Quantity): number =>
  (unitConversionFactor(from.unitOfMeasure, to.unitOfMeasure) * to.units) / from.units;
