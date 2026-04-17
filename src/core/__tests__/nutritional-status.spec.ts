import { describe, expect, it } from 'vitest';
import { maxOnlyStatus, rangeStatus } from '../nutritional-status';

describe('Nutritional Status', () => {
  describe('for a range', () => {
    it('is "in-zone" if the value is in the range', () => {
      expect(rangeStatus(50, 40, 60, 10)).toBe('in-zone');
      expect(rangeStatus(40, 40, 60, 10)).toBe('in-zone');
      expect(rangeStatus(60, 40, 60, 10)).toBe('in-zone');
    });

    it('is "high-warn" if the value is above the max value within tolerance', () => {
      expect(rangeStatus(60.1, 40, 60, 10)).toBe('high-warn');
      expect(rangeStatus(65, 40, 60, 10)).toBe('high-warn');
    });

    it('is "low-warn" if the value is below the min value within tolerance', () => {
      expect(rangeStatus(39.9, 40, 60, 10)).toBe('low-warn');
      expect(rangeStatus(35, 40, 60, 10)).toBe('low-warn');
    });

    it('is "low-danger" if the value is below the min value outside of tolerance', () => {
      expect(rangeStatus(34.9, 40, 60, 10)).toBe('low-danger');
      expect(rangeStatus(0, 40, 60, 10)).toBe('low-danger');
    });

    it('is "high-danger" if the value is above the max value outside of tolerance', () => {
      expect(rangeStatus(65.1, 40, 60, 10)).toBe('high-danger');
      expect(rangeStatus(1000, 40, 60, 10)).toBe('high-danger');
    });

    it('handles zero tolerance', () => {
      expect(rangeStatus(50, 40, 60, 0)).toBe('in-zone');
      expect(rangeStatus(40, 40, 60, 0)).toBe('in-zone');
      expect(rangeStatus(60, 40, 60, 0)).toBe('in-zone');
      expect(rangeStatus(39.999, 40, 60, 0)).toBe('low-danger');
      expect(rangeStatus(60.001, 40, 60, 0)).toBe('high-danger');
    });

    it('treats negative tolerance like a zero tolerance', () => {
      expect(rangeStatus(50, 40, 60, -10)).toBe('in-zone');
      expect(rangeStatus(40, 40, 60, -10)).toBe('in-zone');
      expect(rangeStatus(60, 40, 60, -10)).toBe('in-zone');
      expect(rangeStatus(39.999, 40, 60, -10)).toBe('low-danger');
      expect(rangeStatus(60.001, 40, 60, -10)).toBe('high-danger');
    });

    it('is null if any inputs are NaN, null, or undefined', () => {
      expect(rangeStatus(NaN, 40, 60, 10)).toBeNull();
      expect(rangeStatus(50, NaN, 60, 10)).toBeNull();
      expect(rangeStatus(50, 40, NaN, 10)).toBeNull();
      expect(rangeStatus(50, 40, 60, NaN)).toBeNull();
      expect(rangeStatus(null, 40, 60, 10)).toBeNull();
      expect(rangeStatus(50, null, 60, 10)).toBeNull();
      expect(rangeStatus(50, 40, null, 10)).toBeNull();
      expect(rangeStatus(50, 40, 60, null)).toBeNull();
      expect(rangeStatus(undefined, 40, 60, 10)).toBeNull();
      expect(rangeStatus(50, undefined, 60, 10)).toBeNull();
      expect(rangeStatus(50, 40, undefined, 10)).toBeNull();
      expect(rangeStatus(50, 40, 60, undefined)).toBeNull();
    });
  });

  describe('for a single max value', () => {
    it('is "in-zone" if the value is at or below the max value', () => {
      expect(maxOnlyStatus(50, 60, 10)).toBe('in-zone');
      expect(maxOnlyStatus(0, 60, 10)).toBe('in-zone');
      expect(maxOnlyStatus(60, 60, 10)).toBe('in-zone');
    });

    it('is "high-warn" if the value is above the max value within tolerance', () => {
      expect(maxOnlyStatus(60.1, 60, 10)).toBe('high-warn');
      expect(maxOnlyStatus(66, 60, 10)).toBe('high-warn');
    });

    it('is "high-danger" if the value is above the max value outside of tolerance', () => {
      expect(maxOnlyStatus(66.1, 60, 10)).toBe('high-danger');
      expect(maxOnlyStatus(234, 60, 10)).toBe('high-danger');
    });

    it('handles zero tolerance', () => {
      expect(maxOnlyStatus(40, 60, 0)).toBe('in-zone');
      expect(maxOnlyStatus(60, 60, 0)).toBe('in-zone');
      expect(maxOnlyStatus(60.001, 60, 0)).toBe('high-danger');
    });

    it('treats negative tolerance like a zero tolerance', () => {
      expect(maxOnlyStatus(40, 60, -10)).toBe('in-zone');
      expect(maxOnlyStatus(60, 60, -10)).toBe('in-zone');
      expect(maxOnlyStatus(60.001, 60, -10)).toBe('high-danger');
    });

    it('is null if any inputs are NaN, null, or undefined', () => {
      expect(maxOnlyStatus(NaN, 60, 10)).toBeNull();
      expect(maxOnlyStatus(50, NaN, 10)).toBeNull();
      expect(maxOnlyStatus(50, 60, NaN)).toBeNull();
      expect(maxOnlyStatus(null, 60, 10)).toBeNull();
      expect(maxOnlyStatus(50, null, 10)).toBeNull();
      expect(maxOnlyStatus(50, 60, null)).toBeNull();
      expect(maxOnlyStatus(undefined, 60, 10)).toBeNull();
      expect(maxOnlyStatus(50, undefined, 10)).toBeNull();
      expect(maxOnlyStatus(50, 60, undefined)).toBeNull();
    });
  });
});
