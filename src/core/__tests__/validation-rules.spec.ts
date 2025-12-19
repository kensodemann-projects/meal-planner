import { describe, expect, it } from 'vitest';
import { validationRules } from '../validation-rules';

describe('Validation Rules', () => {
  describe('required', () => {
    it('returns true if there is a value', () => {
      expect(validationRules.required('hello')).toBe(true);
      expect(validationRules.required(42.73)).toBe(true);
      expect(validationRules.required(-42.73)).toBe(true);
      expect(validationRules.required(0)).toBe(true);
      expect(validationRules.required({})).toBe(true);
      expect(validationRules.required({ message: 'hello' })).toBe(true);
    });

    it('returns "Required." if there is no value', () => {
      expect(validationRules.required(undefined)).toBe('Required');
      expect(validationRules.required(null)).toBe('Required');
      expect(validationRules.required('')).toBe('Required');
      expect(validationRules.required('   ')).toBe('Required');
    });
  });

  describe('email', () => {
    it('returns true if no value is specified', () => {
      expect(validationRules.email(undefined)).toBe(true);
      expect(validationRules.email(null)).toBe(true);
      expect(validationRules.email('')).toBe(true);
      expect(validationRules.email('   ')).toBe(true);
    });

    it('return true for valid e-mail addresses', () => {
      expect(validationRules.email('test@test-data.com')).toBe(true);
      expect(validationRules.email('test@test.com')).toBe(true);
      expect(validationRules.email('foo+bar@test.com')).toBe(true);
      expect(validationRules.email('"foo bar"@test.com')).toBe(true);
      expect(validationRules.email('test@sub.test.co.uk')).toBe(true);
      expect(validationRules.email('test@test.info')).toBe(true);
    });

    it('returns "Invalid e-mail." for invalid addresses', () => {
      expect(validationRules.email('test')).toBe('Invalid e-mail');
      expect(validationRules.email('test.test.com')).toBe('Invalid e-mail');
    });
  });

  describe('positive', () => {
    it('returns true if null or undefined', () => {
      expect(validationRules.positive(undefined)).toBe(true);
      expect(validationRules.positive(null)).toBe(true);
    });

    it('returns true for positive numbers', () => {
      expect(validationRules.positive(42)).toBe(true);
      expect(validationRules.positive(73)).toBe(true);
      expect(validationRules.positive(42.73)).toBe(true);
    });

    it('returns "Must be a positive number" for zero or negative numbers', () => {
      expect(validationRules.positive(0)).toBe('Must be a positive number');
      expect(validationRules.positive(-42)).toBe('Must be a positive number');
      expect(validationRules.positive(-73)).toBe('Must be a positive number');
      expect(validationRules.positive(-42.73)).toBe('Must be a positive number');
      expect(validationRules.positive(-Infinity)).toBe('Must be a positive number');
    });

    it('returns "Must be a valid positive number" for NaN', () => {
      expect(validationRules.positive(NaN)).toBe('Must be a valid positive number');
    });

    it('returns true for Infinity', () => {
      expect(validationRules.positive(Infinity)).toBe(true);
    });

    it('returns true for very small positive numbers', () => {
      expect(validationRules.positive(0.0001)).toBe(true);
      expect(validationRules.positive(0.000001)).toBe(true);
      expect(validationRules.positive(Number.MIN_VALUE)).toBe(true);
    });
  });

  describe('zero or greater', () => {
    it('returns true if null or undefined', () => {
      expect(validationRules.zeroOrGreater(undefined)).toBe(true);
      expect(validationRules.zeroOrGreater(null)).toBe(true);
    });

    it('returns true for positive numbers', () => {
      expect(validationRules.zeroOrGreater(42)).toBe(true);
      expect(validationRules.zeroOrGreater(73)).toBe(true);
      expect(validationRules.zeroOrGreater(42.73)).toBe(true);
    });

    it('returns true for zero', () => {
      expect(validationRules.zeroOrGreater(0)).toBe(true);
    });

    it('returns "Must be zero or greater" for negative numbers', () => {
      expect(validationRules.zeroOrGreater(-42)).toBe('Must be zero or greater');
      expect(validationRules.zeroOrGreater(-73)).toBe('Must be zero or greater');
      expect(validationRules.zeroOrGreater(-42.73)).toBe('Must be zero or greater');
      expect(validationRules.zeroOrGreater(-Infinity)).toBe('Must be zero or greater');
    });

    it('returns "Must be a valid number zero or greater" for NaN', () => {
      expect(validationRules.zeroOrGreater(NaN)).toBe('Must be a valid number zero or greater');
    });

    it('returns true for Infinity', () => {
      expect(validationRules.zeroOrGreater(Infinity)).toBe(true);
    });

    it('returns true for very small positive numbers', () => {
      expect(validationRules.zeroOrGreater(0.0001)).toBe(true);
      expect(validationRules.zeroOrGreater(0.000001)).toBe(true);
      expect(validationRules.zeroOrGreater(Number.MIN_VALUE)).toBe(true);
    });

    it('returns "Must be a valid number zero or greater" for NaN', () => {
      expect(validationRules.zeroOrGreater(NaN)).toBe('Must be a valid number zero or greater');
    });

    it('returns true for Infinity', () => {
      expect(validationRules.zeroOrGreater(Infinity)).toBe(true);
    });

    it('returns true for very small positive numbers', () => {
      expect(validationRules.zeroOrGreater(0.0001)).toBe(true);
      expect(validationRules.zeroOrGreater(0.000001)).toBe(true);
      expect(validationRules.zeroOrGreater(Number.MIN_VALUE)).toBe(true);
    });
  });
});
