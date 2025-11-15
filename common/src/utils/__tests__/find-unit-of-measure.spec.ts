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

  describe('when passing a number', () => {
    it.each([
      {
        testCase: 'finds a tsp',
        fdcId: 1002,
        unitsOfMeasure: {
          id: 'tsp',
          name: 'Teaspoon',
          type: 'volume',
          system: 'customary',
          fdcId: 1002,
        },
      },
      {
        testCase: 'finds a tbsp',
        fdcId: 1001,
        unitsOfMeasure: {
          id: 'tbsp',
          name: 'Tablespoon',
          type: 'volume',
          system: 'customary',
          fdcId: 1001,
        },
      },
      {
        testCase: 'finds a cup',
        fdcId: 1000,
        unitsOfMeasure: {
          id: 'cup',
          name: 'Cup',
          type: 'volume',
          system: 'customary',
          fdcId: 1000,
        },
      },
      {
        testCase: 'finds a pint',
        fdcId: 1008,
        unitsOfMeasure: {
          id: 'pint',
          name: 'Pint',
          type: 'volume',
          system: 'customary',
          fdcId: 1008,
        },
      },
      {
        testCase: 'finds a quart',
        fdcId: 1045,
        unitsOfMeasure: {
          id: 'quart',
          name: 'Quart',
          type: 'volume',
          system: 'customary',
          fdcId: 1045,
        },
      },
      {
        testCase: 'finds a gallon',
        fdcId: 1007,
        unitsOfMeasure: {
          id: 'gallon',
          name: 'Gallon',
          type: 'volume',
          system: 'customary',
          fdcId: 1007,
        },
      },
      {
        testCase: 'finds a fluid ounce',
        fdcId: 1009,
        unitsOfMeasure: {
          id: 'floz',
          name: 'Fluid Ounce',
          type: 'volume',
          system: 'customary',
          fdcId: 1009,
        },
      },
      {
        testCase: 'finds a ml',
        fdcId: 1004,
        unitsOfMeasure: {
          id: 'ml',
          name: 'Milliliter',
          type: 'volume',
          system: 'metric',
          fdcId: 1004,
        },
      },
      {
        testCase: 'finds a liter',
        fdcId: 1003,
        unitsOfMeasure: {
          id: 'l',
          name: 'Liter',
          type: 'volume',
          system: 'metric',
          fdcId: 1003,
        },
      },
      {
        testCase: 'finds an ounce',
        fdcId: 1038,
        unitsOfMeasure: {
          id: 'oz',
          name: 'Ounce',
          type: 'weight',
          system: 'customary',
          fdcId: 1038,
        },
      },
      {
        testCase: 'finds a pound',
        fdcId: 1030,
        unitsOfMeasure: {
          id: 'lb',
          name: 'Pound',
          type: 'weight',
          system: 'customary',
          fdcId: 1030,
        },
      },
      {
        testCase: 'returns "item" for unknown',
        fdcId: 9999,
        unitsOfMeasure: {
          id: 'item',
          name: 'Item',
          type: 'quantity',
          system: 'none',
          fdcId: 9999,
        },
      },
      {
        testCase: 'returns "item" for other random items',
        fdcId: 1027,
        unitsOfMeasure: {
          id: 'item',
          name: 'Item',
          type: 'quantity',
          system: 'none',
          fdcId: 9999,
        },
      },
    ])('$testCase', ({ fdcId, unitsOfMeasure }) => {
      expect(findUnitOfMeasure(fdcId)).toEqual(unitsOfMeasure);
    });
  });
});
