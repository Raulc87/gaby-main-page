import { describe, expect, it } from 'vitest';
import { groupThousands, sanitizeAmount, thousandsSeparator, wholeDigits } from '../../../src/lib/calculator/amounts';

describe('sanitizeAmount', () => {
  it('keeps the digits and drops everything else', () => {
    expect(sanitizeAmount('4500')).toBe('4500');
    expect(sanitizeAmount('4.500')).toBe('4500');
    expect(sanitizeAmount('1,250,000')).toBe('1250000');
    expect(sanitizeAmount(' $ 4 500 ')).toBe('4500');
    expect(sanitizeAmount('-5')).toBe('5');
    expect(sanitizeAmount('abc')).toBe('');
  });

  it('cuts off a decimal part of one or two digits instead of gluing it on', () => {
    expect(sanitizeAmount('1234.56')).toBe('1234');
    expect(sanitizeAmount('1234,5')).toBe('1234');
    expect(sanitizeAmount('1.234,56')).toBe('1234');
    expect(sanitizeAmount('1,234.56')).toBe('1234');
  });

  it('reads three digits after a mark as thousands', () => {
    expect(sanitizeAmount('1.234')).toBe('1234');
    expect(sanitizeAmount('1,234')).toBe('1234');
  });

  it('drops leading zeros, keeping a single 0', () => {
    expect(sanitizeAmount('007')).toBe('7');
    expect(sanitizeAmount('0')).toBe('0');
    expect(sanitizeAmount('000')).toBe('0');
  });
});

describe('groupThousands', () => {
  it('uses a point in Spanish and a comma in English', () => {
    expect(groupThousands('4500', 'es')).toBe('4.500');
    expect(groupThousands('4500', 'en')).toBe('4,500');
    expect(groupThousands('1250000', 'es')).toBe('1.250.000');
    expect(groupThousands('999', 'en')).toBe('999');
    expect(groupThousands('0', 'es')).toBe('0');
    expect(thousandsSeparator('es')).toBe('.');
    expect(thousandsSeparator('en')).toBe(',');
  });

  it('round-trips with sanitizeAmount', () => {
    expect(sanitizeAmount(groupThousands('1234567', 'es'))).toBe('1234567');
    expect(sanitizeAmount(groupThousands('1234567', 'en'))).toBe('1234567');
  });
});

describe('wholeDigits', () => {
  it('writes a whole amount without exponent notation', () => {
    expect(wholeDigits(4500)).toBe('4500');
    expect(wholeDigits(90071992547409)).toBe('90071992547409');
    expect(wholeDigits(4499.6)).toBe('4500');
  });
});
