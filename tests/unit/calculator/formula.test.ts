import { describe, expect, it } from 'vitest';
import { calculateFreedom, floorToOneDecimal } from '../../../src/lib/calculator/formula';
import type { CalculatorFigures } from '../../../src/lib/calculator/formula';

// Gap of 1,000 a month unless a test says otherwise: savings / 1000 = months.
const figures = (overrides: Partial<CalculatorFigures> = {}): CalculatorFigures => ({
  expenses: 800,
  debt_payments: 200,
  savings: 0,
  liquid_investments: 0,
  other_income: 0,
  ...overrides,
});

describe('calculateFreedom', () => {
  it('is in the alert zone below 6 months', () => {
    expect(calculateFreedom(figures({ savings: 3000 }))).toEqual({ covered: false, months: 3, zone: 'alert' });
  });

  it('is in the building zone from 6 to under 12 months', () => {
    expect(calculateFreedom(figures({ savings: 9000 }))).toEqual({ covered: false, months: 9, zone: 'building' });
  });

  it('is in the freedom zone from 12 months', () => {
    expect(calculateFreedom(figures({ savings: 20000 }))).toEqual({ covered: false, months: 20, zone: 'freedom' });
  });

  it('adds savings and liquid investments, and subtracts other income from the gap', () => {
    // gap = 800 + 200 - 500 = 500; (2000 + 1000) / 500 = 6
    const result = calculateFreedom(figures({ savings: 2000, liquid_investments: 1000, other_income: 500 }));
    expect(result).toEqual({ covered: false, months: 6, zone: 'building' });
  });

  describe('zone boundaries', () => {
    it('5.99 months is alert', () => {
      expect(calculateFreedom(figures({ savings: 5990 }))).toEqual({ covered: false, months: 5.9, zone: 'alert' });
    });
    it('6 months is building', () => {
      expect(calculateFreedom(figures({ savings: 6000 })).zone).toBe('building');
    });
    it('11.99 months is building', () => {
      expect(calculateFreedom(figures({ savings: 11990 }))).toEqual({ covered: false, months: 11.9, zone: 'building' });
    });
    it('12 months is freedom', () => {
      expect(calculateFreedom(figures({ savings: 12000 })).zone).toBe('freedom');
    });
    it('takes the zone from the unrounded value (5.999 rounds down to 5.9, alert)', () => {
      expect(calculateFreedom(figures({ savings: 5999 }))).toEqual({ covered: false, months: 5.9, zone: 'alert' });
    });
    it('takes the zone from the unrounded value (11.999 rounds down to 11.9, building)', () => {
      expect(calculateFreedom(figures({ savings: 11999 }))).toEqual({ covered: false, months: 11.9, zone: 'building' });
    });
  });

  describe('covered', () => {
    it('is covered, in the freedom zone, when other income equals the outgoings', () => {
      expect(calculateFreedom(figures({ other_income: 1000 }))).toEqual({ covered: true, months: null, zone: 'freedom' });
    });
    it('is covered when other income exceeds the outgoings, even with no savings', () => {
      expect(calculateFreedom(figures({ other_income: 5000, savings: 0 }))).toEqual({
        covered: true,
        months: null,
        zone: 'freedom',
      });
    });
  });

  it('has no upper limit (a result above 1,000 months)', () => {
    const result = calculateFreedom(figures({ expenses: 100, debt_payments: 0, savings: 250000, liquid_investments: 50000 }));
    expect(result).toEqual({ covered: false, months: 3000, zone: 'freedom' });
  });

  it('rounds down to one decimal, never up', () => {
    // 4.46 -> 4.4 ; 4.49 -> 4.4
    expect(calculateFreedom(figures({ savings: 4460 })).months).toBe(4.4);
    expect(calculateFreedom(figures({ savings: 4490 })).months).toBe(4.4);
  });

  it('never shows a rounded value past the zone limit the real value did not reach', () => {
    // 5.9999999999 months: alert, shown as 5.9 (not 6.0, which would be the building zone)
    expect(calculateFreedom(figures({ savings: 5999.9999999 }))).toEqual({ covered: false, months: 5.9, zone: 'alert' });
    expect(calculateFreedom(figures({ savings: 11999.9999999 }))).toEqual({ covered: false, months: 11.9, zone: 'building' });
  });

  it('handles zero savings (0 months, alert)', () => {
    expect(calculateFreedom(figures())).toEqual({ covered: false, months: 0, zone: 'alert' });
  });
});

describe('floorToOneDecimal', () => {
  it('ignores floating-point noise', () => {
    expect(floorToOneDecimal(4.4)).toBe(4.4);
    expect(floorToOneDecimal(1.1)).toBe(1.1);
    expect(floorToOneDecimal(0.7)).toBe(0.7);
    expect(floorToOneDecimal(2.9999999999)).toBe(2.9);
  });
});
