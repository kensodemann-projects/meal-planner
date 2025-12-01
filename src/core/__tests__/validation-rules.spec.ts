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
});
