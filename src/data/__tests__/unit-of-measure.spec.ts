import { unitsOfMeasure } from '@/data/units-of-measure';
import { type AutocompleteOption } from '@/models/option';
import { describe, expect, it } from 'vitest';
import { unitOfMeasureOptions } from '../unit-of-measure';

describe('Unit of Measure Utilities', () => {
  describe('Autocomplete Items', () => {
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
});
