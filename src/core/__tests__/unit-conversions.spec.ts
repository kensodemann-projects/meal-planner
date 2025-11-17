import { findUnitOfMeasure } from '@meal-planner/common';
import { describe, expect, it } from 'vitest';
import { quantityConversionFactor, unitConversionFactor } from '../unit-conversion';

const item = findUnitOfMeasure('item');
const each = findUnitOfMeasure('each');
const piece = findUnitOfMeasure('piece');

const liter = findUnitOfMeasure('l');
const milliLiter = findUnitOfMeasure('ml');

const teaSpoon = findUnitOfMeasure('tsp');
const tableSpoon = findUnitOfMeasure('tbsp');
const fluidOunces = findUnitOfMeasure('floz');
const cup = findUnitOfMeasure('cup');
const pint = findUnitOfMeasure('pint');
const quart = findUnitOfMeasure('quart');
const gallon = findUnitOfMeasure('gallon');

const milliGram = findUnitOfMeasure('mg');
const gram = findUnitOfMeasure('g');
const kiloGram = findUnitOfMeasure('kg');

const ounce = findUnitOfMeasure('oz');
const pound = findUnitOfMeasure('lb');

describe('Unit Conversions', () => {
  describe('Unit Conversion Factor', () => {
    it('returns 1 if the units of measure are the same', () => {
      expect(unitConversionFactor(item, item)).toBe(1);
      expect(unitConversionFactor(each, each)).toBe(1);
      expect(unitConversionFactor(piece, piece)).toBe(1);
      expect(unitConversionFactor(liter, liter)).toBe(1);
      expect(unitConversionFactor(milliLiter, milliLiter)).toBe(1);
      expect(unitConversionFactor(teaSpoon, teaSpoon)).toBe(1);
      expect(unitConversionFactor(tableSpoon, tableSpoon)).toBe(1);
      expect(unitConversionFactor(fluidOunces, fluidOunces)).toBe(1);
      expect(unitConversionFactor(cup, cup)).toBe(1);
      expect(unitConversionFactor(pint, pint)).toBe(1);
      expect(unitConversionFactor(quart, quart)).toBe(1);
      expect(unitConversionFactor(gallon, gallon)).toBe(1);
      expect(unitConversionFactor(milliGram, milliGram)).toBe(1);
      expect(unitConversionFactor(gram, gram)).toBe(1);
      expect(unitConversionFactor(kiloGram, kiloGram)).toBe(1);
      expect(unitConversionFactor(ounce, ounce)).toBe(1);
      expect(unitConversionFactor(pound, pound)).toBe(1);
    });

    it('calculates the correct factor going up the US-Customary volume units', () => {
      expect(unitConversionFactor(teaSpoon, tableSpoon)).toBe(3);
      expect(unitConversionFactor(teaSpoon, fluidOunces)).toBe(6);
      expect(unitConversionFactor(teaSpoon, gallon)).toBe(768);
      expect(unitConversionFactor(cup, quart)).toBe(4);
    });

    it('calculates the correct factor going down the US-Customary volume units', () => {
      expect(unitConversionFactor(tableSpoon, teaSpoon)).toBe(1 / 3);
      expect(unitConversionFactor(fluidOunces, teaSpoon)).toBe(1 / 6);
      expect(unitConversionFactor(gallon, teaSpoon)).toBe(1 / 768);
      expect(unitConversionFactor(quart, cup)).toBe(1 / 4);
    });

    it('calculates the correct factor going up the metric volume units', () => {
      expect(unitConversionFactor(milliLiter, liter)).toBe(1000);
    });

    it('calculates the correct factor going down the metric volume units', () => {
      expect(unitConversionFactor(liter, milliLiter)).toBe(0.001);
    });

    it('calculates the correct factor going from metric to US-Customary volume', () => {
      expect(unitConversionFactor(liter, cup)).toBeCloseTo(0.23659, 5);
      expect(unitConversionFactor(liter, gallon)).toBeCloseTo(3.78541, 5);
      expect(unitConversionFactor(milliLiter, tableSpoon)).toBeCloseTo(14.78675, 5);
      expect(unitConversionFactor(liter, pint)).toBeCloseTo(0.47318, 5);
    });

    it('calculates the correct factor going from US-Customary to metric volume', () => {
      expect(unitConversionFactor(cup, liter)).toBeCloseTo(4.22676, 5);
      expect(unitConversionFactor(gallon, liter)).toBeCloseTo(0.26417, 5);
      expect(unitConversionFactor(tableSpoon, milliLiter)).toBeCloseTo(0.06763, 5);
      expect(unitConversionFactor(pint, liter)).toBeCloseTo(2.11338, 5);
    });

    it('calculates the correct factor going up the customary weight units', () => {
      expect(unitConversionFactor(ounce, pound)).toBe(16);
    });

    it('calculates the correct factor going down the customary weight units', () => {
      expect(unitConversionFactor(pound, ounce)).toBe(1 / 16);
    });

    it('calculates the correct factor going up the metric weight units', () => {
      expect(unitConversionFactor(milliGram, gram)).toBe(1000);
      expect(unitConversionFactor(gram, kiloGram)).toBe(1000);
    });

    it('calculates the correct factor going down the metric weight units', () => {
      expect(unitConversionFactor(kiloGram, gram)).toBe(0.001);
      expect(unitConversionFactor(gram, milliGram)).toBe(0.001);
    });

    it('calculates the correct factor going from metric to US-Customary weight', () => {
      expect(unitConversionFactor(gram, ounce)).toBeCloseTo(28.3495, 5);
      expect(unitConversionFactor(kiloGram, pound)).toBeCloseTo(0.45359, 5);
      expect(unitConversionFactor(gram, pound)).toBeCloseTo(453.592, 5);
    });

    it('calculates the correct factor going from US-Customary to metric weight', () => {
      expect(unitConversionFactor(ounce, gram)).toBeCloseTo(0.03527, 5);
      expect(unitConversionFactor(pound, kiloGram)).toBeCloseTo(2.20462, 5);
      expect(unitConversionFactor(pound, gram)).toBeCloseTo(0.0022, 5);
    });

    it('throws an exception when trying to convert from one quantity type to anything else', () => {
      expect(() => unitConversionFactor(item, each)).toThrow('Invalid conversion');
      expect(() => unitConversionFactor(item, piece)).toThrow('Invalid conversion');
      expect(() => unitConversionFactor(each, piece)).toThrow('Invalid conversion');
      expect(() => unitConversionFactor(each, gram)).toThrow('Invalid conversion');
      expect(() => unitConversionFactor(each, cup)).toThrow('Invalid conversion');
    });

    it('throws an exception when trying to convert from a weight to a volume or quantity', () => {
      expect(() => unitConversionFactor(gram, liter)).toThrow('Invalid conversion');
      expect(() => unitConversionFactor(pound, item)).toThrow('Invalid conversion');
    });

    it('throws an exception when trying to convert from a volume to a weight or quantity', () => {
      expect(() => unitConversionFactor(liter, kiloGram)).toThrow('Invalid conversion');
      expect(() => unitConversionFactor(cup, item)).toThrow('Invalid conversion');
    });
  });

  describe('Quantity Conversion Factor', () => {
    it('returns 1 if the units and units of measure are the same', () => {
      expect(quantityConversionFactor({ units: 3, unitOfMeasure: piece }, { units: 3, unitOfMeasure: piece })).toBe(1);
      expect(quantityConversionFactor({ units: 2, unitOfMeasure: each }, { units: 2, unitOfMeasure: each })).toBe(1);
      expect(quantityConversionFactor({ units: 5, unitOfMeasure: item }, { units: 5, unitOfMeasure: item })).toBe(1);
      expect(quantityConversionFactor({ units: 2, unitOfMeasure: liter }, { units: 2, unitOfMeasure: liter })).toBe(1);
      expect(
        quantityConversionFactor({ units: 250, unitOfMeasure: milliLiter }, { units: 250, unitOfMeasure: milliLiter }),
      ).toBe(1);
      expect(
        quantityConversionFactor({ units: 3, unitOfMeasure: teaSpoon }, { units: 3, unitOfMeasure: teaSpoon }),
      ).toBe(1);
      expect(
        quantityConversionFactor({ units: 4, unitOfMeasure: tableSpoon }, { units: 4, unitOfMeasure: tableSpoon }),
      ).toBe(1);
      expect(
        quantityConversionFactor({ units: 8, unitOfMeasure: fluidOunces }, { units: 8, unitOfMeasure: fluidOunces }),
      ).toBe(1);
      expect(quantityConversionFactor({ units: 2, unitOfMeasure: cup }, { units: 2, unitOfMeasure: cup })).toBe(1);
      expect(quantityConversionFactor({ units: 2, unitOfMeasure: pint }, { units: 2, unitOfMeasure: pint })).toBe(1);
      expect(quantityConversionFactor({ units: 3, unitOfMeasure: quart }, { units: 3, unitOfMeasure: quart })).toBe(1);
      expect(quantityConversionFactor({ units: 3, unitOfMeasure: gallon }, { units: 3, unitOfMeasure: gallon })).toBe(
        1,
      );
      expect(
        quantityConversionFactor({ units: 30, unitOfMeasure: milliGram }, { units: 30, unitOfMeasure: milliGram }),
      ).toBe(1);
      expect(quantityConversionFactor({ units: 100, unitOfMeasure: gram }, { units: 100, unitOfMeasure: gram })).toBe(
        1,
      );
      expect(
        quantityConversionFactor({ units: 10, unitOfMeasure: kiloGram }, { units: 10, unitOfMeasure: kiloGram }),
      ).toBe(1);
      expect(quantityConversionFactor({ units: 4, unitOfMeasure: ounce }, { units: 4, unitOfMeasure: ounce })).toBe(1);
      expect(quantityConversionFactor({ units: 2, unitOfMeasure: pound }, { units: 2, unitOfMeasure: pound })).toBe(1);
    });

    it('returns a simple ratio when the unit of measure matches', () => {
      expect(quantityConversionFactor({ units: 4, unitOfMeasure: ounce }, { units: 3, unitOfMeasure: ounce })).toBe(
        3 / 4,
      );
      expect(quantityConversionFactor({ units: 3, unitOfMeasure: gram }, { units: 5, unitOfMeasure: gram })).toBe(
        5 / 3,
      );
      expect(quantityConversionFactor({ units: 1, unitOfMeasure: pound }, { units: 7, unitOfMeasure: pound })).toBe(7);
    });

    it('takes the conversion factor into account', () => {
      expect(quantityConversionFactor({ units: 4, unitOfMeasure: ounce }, { units: 4, unitOfMeasure: pound })).toBe(16);
      expect(quantityConversionFactor({ units: 32, unitOfMeasure: ounce }, { units: 1, unitOfMeasure: pound })).toBe(
        0.5,
      );
      expect(quantityConversionFactor({ units: 4, unitOfMeasure: pint }, { units: 2, unitOfMeasure: cup })).toBe(1 / 4);
    });
  });
});
