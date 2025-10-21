import { describe, expect, it } from 'vitest';
import { findUnitOfMeasure, unitOfMeasureOptions, unitsOfMeasure } from '../unit-of-measure';
import type { AutocompleteOption } from '@/models';

describe('unit-of-measure utilities', () => {
  describe('unit of measure autocomplete items', () => {
    it('includes all defined units of measure plus the dividers and subheaders', () => {
      const volumeUofM = unitsOfMeasure.filter((x) => x.type === 'volume');
      const weightUofM = unitsOfMeasure.filter((x) => x.type === 'weight');
      const quantityUofM = unitsOfMeasure.filter((x) => x.type === 'quantity');

      expect(unitOfMeasureOptions[0]).toEqual({ type: 'subheader', title: 'Volume' });
      for (let i = 1; i < 1 + volumeUofM.length; i++) {
        expect(volumeUofM.find((x) => x.id === (unitOfMeasureOptions[i] as AutocompleteOption).value)).toBeTruthy();
      }

      const weightUofMStartIdx = 1 + volumeUofM.length;
      expect(unitOfMeasureOptions[weightUofMStartIdx]).toEqual({ type: 'divider' });
      expect(unitOfMeasureOptions[weightUofMStartIdx + 1]).toEqual({ type: 'subheader', title: 'Weight' });
      for (let i = weightUofMStartIdx + 2; i < 2 + weightUofMStartIdx + weightUofM.length; i++) {
        expect(weightUofM.find((x) => x.id === (unitOfMeasureOptions[i] as AutocompleteOption).value)).toBeTruthy();
      }

      const quantityUofMStartIdx = weightUofMStartIdx + 2 + weightUofM.length;
      expect(unitOfMeasureOptions[quantityUofMStartIdx]).toEqual({ type: 'divider' });
      expect(unitOfMeasureOptions[quantityUofMStartIdx + 1]).toEqual({ type: 'subheader', title: 'Quantity' });
      for (let i = quantityUofMStartIdx + 2; i < 2 + quantityUofMStartIdx + quantityUofM.length; i++) {
        expect(quantityUofM.find((x) => x.id === (unitOfMeasureOptions[i] as AutocompleteOption).value)).toBeTruthy();
      }
    });
  });

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
