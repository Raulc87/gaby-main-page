import { describe, expect, it } from 'vitest';
import { formatMoney, localizeMonths, monthsUnit } from '../../../src/lib/calculator/format';

const unit = { one: 'mes', many: 'meses' };

describe('localizeMonths', () => {
  it('uses a decimal comma in Spanish and a point in English; a whole value has no decimal', () => {
    expect(localizeMonths('4.4', 'es')).toBe('4,4');
    expect(localizeMonths('4.4', 'en')).toBe('4.4');
    expect(localizeMonths('6', 'es')).toBe('6');
    expect(localizeMonths('10', 'en')).toBe('10');
  });
});

describe('monthsUnit', () => {
  it('is "mes" for exactly 1 and "meses" otherwise (0, 1.5, 10 and 11)', () => {
    expect(monthsUnit('1', unit)).toBe('mes');
    expect(monthsUnit('0', unit)).toBe('meses');
    expect(monthsUnit('1.5', unit)).toBe('meses');
    expect(monthsUnit('10', unit)).toBe('meses');
    expect(monthsUnit('11', unit)).toBe('meses');
  });
});

describe('formatMoney', () => {
  it('writes the symbol and thousands separators of the language', () => {
    expect(formatMoney(20000, 'USD', 'es')).toBe('$20.000');
    expect(formatMoney(20000, 'USD', 'en')).toBe('$20,000');
    expect(formatMoney(1250000, 'CRC', 'es')).toBe('₡1.250.000');
    expect(formatMoney(0, 'CRC', 'en')).toBe('₡0');
  });
});
