import { describe, expect, it } from 'vitest';
import {
  decimalMark,
  digitsOf,
  digitsOfTyped,
  groupThousands,
  sanitizePastedAmount,
  thousandsSeparator,
  wholeDigits,
} from '../../../src/lib/calculator/amounts';

describe('digitsOf (typing and deleting)', () => {
  it('keeps the digits and drops everything else', () => {
    expect(digitsOf('4500')).toBe('4500');
    expect(digitsOf('4.500')).toBe('4500');
    expect(digitsOf('1,250,000')).toBe('1250000');
    expect(digitsOf(' $ 4 500 ')).toBe('4500');
    expect(digitsOf('-5')).toBe('5');
    expect(digitsOf('abc')).toBe('');
  });

  it('never reads the shortened group after a Backspace as a decimal: "4.500" → "4.50" is 450', () => {
    expect(digitsOf('4.50')).toBe('450');
    expect(digitsOf('4,50')).toBe('450');
    expect(digitsOf('1.234.5')).toBe('12345');
  });

  it('drops leading zeros, keeping a single 0', () => {
    expect(digitsOf('007')).toBe('7');
    expect(digitsOf('0')).toBe('0');
    expect(digitsOf('000')).toBe('0');
  });
});

describe('digitsOfTyped', () => {
  it('cuts what follows the decimal mark of the language, so "4,500.50" in English is 4500 and not 450050', () => {
    expect(digitsOfTyped('4,500.50', 'en')).toBe('4500');
    expect(digitsOfTyped('4,500.', 'en')).toBe('4500');
    expect(digitsOfTyped('4.500,50', 'es')).toBe('4500');
    expect(decimalMark('en')).toBe('.');
    expect(decimalMark('es')).toBe(',');
  });

  it('keeps the grouping mark the field shows itself, so a Backspace still drops one digit', () => {
    expect(digitsOfTyped('4.50', 'es')).toBe('450');
    expect(digitsOfTyped('4,50', 'en')).toBe('450');
    expect(digitsOfTyped('12.345', 'es')).toBe('12345');
  });
});

describe('sanitizePastedAmount', () => {
  it('cuts off a decimal part of one or two digits instead of gluing it on', () => {
    expect(sanitizePastedAmount('1234.56')).toBe('1234');
    expect(sanitizePastedAmount('1234,5')).toBe('1234');
    expect(sanitizePastedAmount('1.234,56')).toBe('1234');
    expect(sanitizePastedAmount('1,234.56')).toBe('1234');
  });

  it('reads three digits after a mark as thousands, and whole amounts as they are', () => {
    expect(sanitizePastedAmount('1.234')).toBe('1234');
    expect(sanitizePastedAmount('1,234')).toBe('1234');
    expect(sanitizePastedAmount(' 4500 ')).toBe('4500');
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

  it('round-trips with digitsOf', () => {
    expect(digitsOf(groupThousands('1234567', 'es'))).toBe('1234567');
    expect(digitsOf(groupThousands('1234567', 'en'))).toBe('1234567');
  });
});

describe('wholeDigits', () => {
  it('writes a whole amount without exponent notation', () => {
    expect(wholeDigits(4500)).toBe('4500');
    expect(wholeDigits(90071992547409)).toBe('90071992547409');
    expect(wholeDigits(4499.6)).toBe('4500');
  });
});
