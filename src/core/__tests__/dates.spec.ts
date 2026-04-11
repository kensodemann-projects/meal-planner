import { describe, expect, it } from 'vitest';
import { dateToISO } from '../dates';

describe('dateToISO', () => {
  it('formats a date as yyyy-MM-dd', () => {
    expect(dateToISO(new Date(2024, 0, 15))).toBe('2024-01-15');
  });

  it('pads single-digit months and days with leading zeros', () => {
    expect(dateToISO(new Date(2024, 2, 5))).toBe('2024-03-05');
  });

  it('formats December 31st correctly', () => {
    expect(dateToISO(new Date(2024, 11, 31))).toBe('2024-12-31');
  });

  it('formats January 1st correctly', () => {
    expect(dateToISO(new Date(2024, 0, 1))).toBe('2024-01-01');
  });
});
