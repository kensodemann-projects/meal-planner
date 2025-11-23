import { describe, expect, it } from 'vitest';
import { findUnitOfMeasure } from '../find-unit-of-measure';

describe('find unit of measure', () => {
  describe('when passing a string', () => {
    it('finds units using single-letter abbreviations', () => {
      expect(findUnitOfMeasure('T')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1001,
      });
      expect(findUnitOfMeasure('t')).toEqual({
        id: 'tsp',
        name: 'Teaspoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1002,
      });
    });

    it('finds based on common forms of the id', () => {
      expect(findUnitOfMeasure('TBSP')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1001,
      });
      expect(findUnitOfMeasure('Tbsp')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1001,
      });
      expect(findUnitOfMeasure('tbsp')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1001,
      });
      expect(findUnitOfMeasure('TSP')).toEqual({
        id: 'tsp',
        name: 'Teaspoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1002,
      });
      expect(findUnitOfMeasure('Tsp')).toEqual({
        id: 'tsp',
        name: 'Teaspoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1002,
      });
      expect(findUnitOfMeasure('tsp')).toEqual({
        id: 'tsp',
        name: 'Teaspoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1002,
      });
      expect(findUnitOfMeasure('fl-oz')).toEqual({
        id: 'floz',
        name: 'Fluid Ounce',
        type: 'volume',
        system: 'customary',
        fdcId: 1009,
      });
      expect(findUnitOfMeasure('floz')).toEqual({
        id: 'floz',
        name: 'Fluid Ounce',
        type: 'volume',
        system: 'customary',
        fdcId: 1009,
      });
    });

    it('finds based on common forms of the name', () => {
      expect(findUnitOfMeasure('Tablespoon')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1001,
      });
      expect(findUnitOfMeasure('tablespoon')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1001,
      });
      expect(findUnitOfMeasure('Teaspoon')).toEqual({
        id: 'tsp',
        name: 'Teaspoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1002,
      });
      expect(findUnitOfMeasure('teaspoon')).toEqual({
        id: 'tsp',
        name: 'Teaspoon',
        type: 'volume',
        system: 'customary',
        fdcId: 1002,
      });
    });

    it('finds units using poorly hyphenated or spaced names', () => {
      expect(findUnitOfMeasure('fluid  ounce')).toEqual({
        id: 'floz',
        name: 'Fluid Ounce',
        type: 'volume',
        system: 'customary',
        fdcId: 1009,
      });
      expect(findUnitOfMeasure('fluid-ounce')).toEqual({
        id: 'floz',
        name: 'Fluid Ounce',
        type: 'volume',
        system: 'customary',
        fdcId: 1009,
      });
      expect(findUnitOfMeasure('milli-liter')).toEqual({
        id: 'ml',
        name: 'Milliliter',
        type: 'volume',
        system: 'metric',
        fdcId: 1004,
      });
    });

    it('returns the generic item when no match is found', () => {
      expect(findUnitOfMeasure('xyz')).toEqual({
        id: 'item',
        name: 'Item',
        type: 'quantity',
        system: 'none',
        fdcId: 9999,
      });
      expect(findUnitOfMeasure('unknown unit')).toEqual({
        id: 'item',
        name: 'Item',
        type: 'quantity',
        system: 'none',
        fdcId: 9999,
      });
    });
  });
});
