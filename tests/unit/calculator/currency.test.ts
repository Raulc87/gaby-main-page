// US-044 AC2: the currency switch converts from the typed amounts, so switching back and forth
// never changes what the visitor typed.
import { describe, expect, it } from 'vitest';
import {
  convertAmount,
  DEFAULT_CRC_PER_USD,
  displayAmount,
  EXAMPLE_FIGURES_USD,
  exampleAmounts,
  parseCrcPerUsd,
  type TypedAmount,
} from '../../../src/lib/calculator/currency';

const RATE = 500;

describe('parseCrcPerUsd', () => {
  it('reads a positive number, and falls back to 500 for anything else', () => {
    expect(parseCrcPerUsd('510')).toBe(510);
    expect(parseCrcPerUsd(' 512.5 ')).toBe(512.5);
    expect(DEFAULT_CRC_PER_USD).toBe(500);
    for (const bad of [undefined, '', 'abc', '0', '-5', 'Infinity', 'NaN', null]) {
      expect(parseCrcPerUsd(bad)).toBe(500);
    }
  });
});

describe('convertAmount', () => {
  it('converts at the rate and rounds to whole units, half up', () => {
    expect(convertAmount(4500, 'USD', 'CRC', RATE)).toBe(2250000);
    expect(convertAmount(2250000, 'CRC', 'USD', RATE)).toBe(4500);
    expect(convertAmount(1250, 'CRC', 'USD', RATE)).toBe(3); // 2.5 → 3
    expect(convertAmount(1249, 'CRC', 'USD', RATE)).toBe(2);
    expect(convertAmount(7, 'USD', 'USD', RATE)).toBe(7);
  });
});

describe('displayAmount: each display starts from what the visitor typed', () => {
  it('₡1,250 → USD → CRC gives ₡1,250 again (it does not drift through the rounded $3)', () => {
    const typed: TypedAmount = { value: 1250, currency: 'CRC' };
    expect(displayAmount(typed, 'USD', RATE)).toBe(3);
    expect(displayAmount(typed, 'CRC', RATE)).toBe(1250);
    // What converting the rounded value would give, which is what the model must not do:
    expect(convertAmount(3, 'USD', 'CRC', RATE)).toBe(1500);
  });

  it('keeps an amount typed in dollars exact in colones and back', () => {
    const typed: TypedAmount = { value: 4500, currency: 'USD' };
    expect(displayAmount(typed, 'CRC', RATE)).toBe(2250000);
    expect(displayAmount(typed, 'USD', RATE)).toBe(4500);
  });

  it('an empty field stays empty in both currencies', () => {
    expect(displayAmount(null, 'USD', RATE)).toBeNull();
    expect(displayAmount(null, 'CRC', RATE)).toBeNull();
  });
});

describe("Gaby's example figures", () => {
  it('are 4.500, 9.000, 6.000, 5.000 and 0 in USD (brief section 4.3)', () => {
    expect(EXAMPLE_FIGURES_USD).toEqual({ expenses: 4500, savings: 9000, investments: 6000, solidarity: 5000, passive: 0 });
  });

  it('open as typed USD amounts, and show in colones at the rate', () => {
    const examples = exampleAmounts();
    expect(examples.expenses).toEqual({ value: 4500, currency: 'USD' });
    expect(displayAmount(examples.savings, 'CRC', RATE)).toBe(4500000);
    expect(displayAmount(examples.passive, 'CRC', RATE)).toBe(0);
  });
});
