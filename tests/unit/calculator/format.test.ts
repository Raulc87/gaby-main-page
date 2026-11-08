import { describe, expect, it } from 'vitest';
import { formatMonths, monthsText } from '../../../src/lib/calculator/format';

describe('formatMonths', () => {
  it('uses a decimal comma in Spanish and a point in English, always with one decimal', () => {
    expect(formatMonths(4.4, 'es')).toBe('4,4');
    expect(formatMonths(4.4, 'en')).toBe('4.4');
    expect(formatMonths(6, 'es')).toBe('6,0');
    expect(formatMonths(0, 'en')).toBe('0.0');
  });

  it('has no upper limit', () => {
    expect(formatMonths(3000, 'en')).toBe('3000.0');
    expect(formatMonths(1234.5, 'es')).toBe('1234,5');
  });
});

describe('monthsText', () => {
  it('fills {months} of calc.result.months', () => {
    expect(monthsText('{months} meses', 4.4, 'es')).toBe('4,4 meses');
    expect(monthsText('{months} months', 4.4, 'en')).toBe('4.4 months');
  });
});
