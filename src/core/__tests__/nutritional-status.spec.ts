import { describe, expect, it } from 'vitest';
import { maxOnlyStatus, rangeStatus } from '../nutritional-status';

describe('Nutritional Status', () => {
  describe('for a range', () => {
    it('is "green" if the value is in the range', () => {
      expect(rangeStatus(50, 40, 60, 10)).toBe('green');
      expect(rangeStatus(40, 40, 60, 10)).toBe('green');
      expect(rangeStatus(60, 40, 60, 10)).toBe('green');
    });

    it('is "yellow" if the value is above the max value within tolerance', () => {
      expect(rangeStatus(60.1, 40, 60, 10)).toBe('yellow');
      expect(rangeStatus(65, 40, 60, 10)).toBe('yellow');
    });

    it('is "yellow" if the value is below the min value within tolerance', () => {
      expect(rangeStatus(39.9, 40, 60, 10)).toBe('yellow');
      expect(rangeStatus(35, 40, 60, 10)).toBe('yellow');
    });

    it('is "red" if the value is above the max value outside of tolerance', () => {
      expect(rangeStatus(34.9, 40, 60, 10)).toBe('red');
      expect(rangeStatus(0, 40, 60, 10)).toBe('red');
    });

    it('is "red" if the value is below the min value outside of tolerance', () => {
      expect(rangeStatus(65.1, 40, 60, 10)).toBe('red');
      expect(rangeStatus(1000, 40, 60, 10)).toBe('red');
    });

    it('handles zero tolerance', () => {
      expect(rangeStatus(50, 40, 60, 0)).toBe('green');
      expect(rangeStatus(40, 40, 60, 0)).toBe('green');
      expect(rangeStatus(60, 40, 60, 0)).toBe('green');
      expect(rangeStatus(39.999, 40, 60, 0)).toBe('red');
      expect(rangeStatus(60.001, 40, 60, 0)).toBe('red');
    });

    it('treats negative tolerance like a zero tolerance', () => {
      expect(rangeStatus(50, 40, 60, -10)).toBe('green');
      expect(rangeStatus(40, 40, 60, -10)).toBe('green');
      expect(rangeStatus(60, 40, 60, -10)).toBe('green');
      expect(rangeStatus(39.999, 40, 60, -10)).toBe('red');
      expect(rangeStatus(60.001, 40, 60, -10)).toBe('red');
    });

    it('is "red" if any inputs are NaN, null, or undefined', () => {
      expect(rangeStatus(NaN, 40, 60, 10)).toBe('red');
      expect(rangeStatus(50, NaN, 60, 10)).toBe('red');
      expect(rangeStatus(50, 40, NaN, 10)).toBe('red');
      expect(rangeStatus(50, 40, 60, NaN)).toBe('red');
      expect(rangeStatus(null, 40, 60, 10)).toBe('red');
      expect(rangeStatus(50, null, 60, 10)).toBe('red');
      expect(rangeStatus(50, 40, null, 10)).toBe('red');
      expect(rangeStatus(50, 40, 60, null)).toBe('red');
      expect(rangeStatus(undefined, 40, 60, 10)).toBe('red');
      expect(rangeStatus(50, undefined, 60, 10)).toBe('red');
      expect(rangeStatus(50, 40, undefined, 10)).toBe('red');
      expect(rangeStatus(50, 40, 60, undefined)).toBe('red');
    });
  });

  describe('for a single max value', () => {
    it('is "green" if the value is at or below the max value', () => {
      expect(maxOnlyStatus(50, 60, 10)).toBe('green');
      expect(maxOnlyStatus(0, 60, 10)).toBe('green');
      expect(maxOnlyStatus(60, 60, 10)).toBe('green');
    });

    it('is "yellow" if the value is above the max value within tolerance', () => {
      expect(maxOnlyStatus(60.1, 60, 10)).toBe('yellow');
      expect(maxOnlyStatus(66, 60, 10)).toBe('yellow');
    });

    it('is "red" if the value is above the max value outside of tolerance', () => {
      expect(maxOnlyStatus(66.1, 60, 10)).toBe('red');
      expect(maxOnlyStatus(234, 60, 10)).toBe('red');
    });

    it('handles zero tolerance', () => {
      expect(maxOnlyStatus(40, 60, 0)).toBe('green');
      expect(maxOnlyStatus(60, 60, 0)).toBe('green');
      expect(maxOnlyStatus(60.001, 60, 0)).toBe('red');
    });

    it('treats negative tolerance like a zero tolerance', () => {
      expect(maxOnlyStatus(40, 60, -10)).toBe('green');
      expect(maxOnlyStatus(60, 60, -10)).toBe('green');
      expect(maxOnlyStatus(60.001, 60, -10)).toBe('red');
    });

    it('is "red" if any inputs are NaN, null, or undefined', () => {
      expect(maxOnlyStatus(NaN, 60, 10)).toBe('red');
      expect(maxOnlyStatus(50, NaN, 10)).toBe('red');
      expect(maxOnlyStatus(50, 60, NaN)).toBe('red');
      expect(maxOnlyStatus(null, 60, 10)).toBe('red');
      expect(maxOnlyStatus(50, null, 10)).toBe('red');
      expect(maxOnlyStatus(50, 60, null)).toBe('red');
      expect(maxOnlyStatus(undefined, 60, 10)).toBe('red');
      expect(maxOnlyStatus(50, undefined, 10)).toBe('red');
      expect(maxOnlyStatus(50, 60, undefined)).toBe('red');
    });
  });
});
