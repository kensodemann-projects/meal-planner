import { describe, expect, it } from 'vitest';
import { findUnitOfMeasure } from '../unit-of-measure';

describe('unit-of-meausure utilities', () => {
  describe('find unit of measure', () => {
    it('finds units using single-letter abbreviations', () => {
      expect(findUnitOfMeasure('T')).toEqual({ id: 'tbsp', name: 'Tablespoon', type: 'volume', system: 'customary' });
      expect(findUnitOfMeasure('t')).toEqual({ id: 'tsp', name: 'Teaspoon', type: 'volume', system: 'customary' });
    });

    it('finds based on common forms if the id', () => {
      expect(findUnitOfMeasure('TBSP')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
      });
      expect(findUnitOfMeasure('Tbsp')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
      });
      expect(findUnitOfMeasure('tbsp')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
      });
      expect(findUnitOfMeasure('TSP')).toEqual({ id: 'tsp', name: 'Teaspoon', type: 'volume', system: 'customary' });
      expect(findUnitOfMeasure('Tsp')).toEqual({ id: 'tsp', name: 'Teaspoon', type: 'volume', system: 'customary' });
      expect(findUnitOfMeasure('tsp')).toEqual({ id: 'tsp', name: 'Teaspoon', type: 'volume', system: 'customary' });
    });

    it('finds based on common forms of the name', () => {
      expect(findUnitOfMeasure('Tablespoon')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
      });
      expect(findUnitOfMeasure('tablespoon')).toEqual({
        id: 'tbsp',
        name: 'Tablespoon',
        type: 'volume',
        system: 'customary',
      });
      expect(findUnitOfMeasure('Teaspoon')).toEqual({
        id: 'tsp',
        name: 'Teaspoon',
        type: 'volume',
        system: 'customary',
      });
      expect(findUnitOfMeasure('teaspoon')).toEqual({
        id: 'tsp',
        name: 'Teaspoon',
        type: 'volume',
        system: 'customary',
      });
    });

    it('finds units using poorly hyphenated or spaced names', () => {
      expect(findUnitOfMeasure('fluid  ounce')).toEqual({
        id: 'fl-oz',
        name: 'Fluid Ounce',
        type: 'volume',
        system: 'customary',
      });
      expect(findUnitOfMeasure('fluid-ounce')).toEqual({
        id: 'fl-oz',
        name: 'Fluid Ounce',
        type: 'volume',
        system: 'customary',
      });
      expect(findUnitOfMeasure('milli-liter')).toEqual({
        id: 'ml',
        name: 'Milliliter',
        type: 'volume',
        system: 'metric',
      });
    });

    it('returns the generic item when no match is found', () => {
      expect(findUnitOfMeasure('xyz')).toEqual({ id: 'item', name: 'Item', type: 'quantity', system: 'none' });
      expect(findUnitOfMeasure('unknown unit')).toEqual({ id: 'item', name: 'Item', type: 'quantity', system: 'none' });
    });
  });
});
