// US-044 AC1: Gaby's formula (PROJECT_SPEC.md FR-034), one function.
import { describe, expect, it } from 'vitest';
import { calculateFreedom, type CalculatorFigures, type CalculatorZone } from '../../../src/lib/calculator/formula';

// A monthly gap of 1,000 unless a test says otherwise: the money in savings / 1000 = the months.
const figures = (overrides: Partial<CalculatorFigures> = {}): CalculatorFigures => ({
  expenses: 1000,
  savings: 0,
  liquid_investments: 0,
  solidarity_association: 0,
  passive_income: 0,
  ...overrides,
});

const withSavings = (savings: number) => calculateFreedom(figures({ savings }));

describe('calculateFreedom: the arithmetic', () => {
  it('adds savings, liquid investments and the solidarity association, and subtracts passive income from the expenses', () => {
    // available = 2,000 + 1,000 + 3,000 = 6,000; gap = 1,500 − 500 = 1,000 → 6 months
    const result = calculateFreedom({
      expenses: 1500,
      savings: 2000,
      liquid_investments: 1000,
      solidarity_association: 3000,
      passive_income: 500,
    });
    expect(result).toEqual({
      zone: 'building',
      shown_months: '6',
      api_months: 6,
      available_money: 6000,
      monthly_gap: 1000,
    });
  });

  it("gives Gaby's example figures (4,500 / 9,000 / 6,000 / 5,000 / 0) as 4.44 months in the alert zone", () => {
    const result = calculateFreedom({
      expenses: 4500,
      savings: 9000,
      liquid_investments: 6000,
      solidarity_association: 5000,
      passive_income: 0,
    });
    expect(result.available_money).toBe(20000);
    expect(result.monthly_gap).toBe(4500);
    expect(result.api_months).toBe(4.44);
    expect(result.shown_months).toBe('4.4');
    expect(result.zone).toBe('alert');
  });

  it('works to the cent: 600.06 against a gap of 100.01 is exactly 6 months, in the building zone', () => {
    const result = calculateFreedom(figures({ expenses: 100.01, savings: 600.06 }));
    expect(result.zone).toBe('building');
    expect(result.api_months).toBe(6);
    expect(result.shown_months).toBe('6');
  });
});

describe('calculateFreedom: covered (gap 0 or less)', () => {
  it('is financially free, with no months, when passive income equals the expenses', () => {
    expect(calculateFreedom(figures({ passive_income: 1000, savings: 500 }))).toEqual({
      zone: 'financially_free',
      shown_months: null,
      api_months: null,
      available_money: 500,
      monthly_gap: 0,
    });
  });

  it('is financially free when passive income exceeds the expenses, even with no money available', () => {
    const result = calculateFreedom(figures({ passive_income: 5000 }));
    expect(result.zone).toBe('financially_free');
    expect(result.shown_months).toBeNull();
    expect(result.api_months).toBeNull();
    expect(result.monthly_gap).toBe(0);
  });
});

describe('calculateFreedom: zone boundaries come from the exact value', () => {
  const cases: Array<[number, CalculatorZone]> = [
    [2.99, 'critical'],
    [3, 'alert'],
    [5.99, 'alert'],
    [6, 'building'],
    [11.99, 'building'],
    [12, 'path_to_freedom'],
    [35.99, 'path_to_freedom'],
    [36, 'solid_cushion'],
  ];
  it.each(cases)('%s months is %s', (months, zone) => {
    expect(withSavings(months * 1000).zone).toBe(zone);
  });

  it('0 months (no money, a gap) is critical', () => {
    expect(withSavings(0)).toMatchObject({ zone: 'critical', shown_months: '0', api_months: 0 });
  });

  it('keeps a value that is shown as a limit on its own side of the limit (5.96 is shown as "6" in the alert zone)', () => {
    expect(withSavings(5960)).toMatchObject({ zone: 'alert', shown_months: '6' });
    expect(withSavings(5999)).toMatchObject({ zone: 'alert', shown_months: '6' });
    expect(withSavings(11999)).toMatchObject({ zone: 'building', shown_months: '12' });
    expect(withSavings(35999)).toMatchObject({ zone: 'path_to_freedom', shown_months: '36' });
    expect(withSavings(2999)).toMatchObject({ zone: 'critical', shown_months: '3' });
  });
});

describe('calculateFreedom: the display rule (half up on the exact decimal value)', () => {
  const cases: Array<[number, string]> = [
    [4.44, '4.4'],
    [4.45, '4.5'], // a tie rounds up
    [5.96, '6'],
    [9.95, '10'],
    [9.96, '10'],
    [10.5, '11'],
    [11.6, '12'],
    [10.49, '10'],
    [6, '6'], // a whole value below 10 has no decimal
    [0.96, '1'],
    [9.94, '9.9'],
    [9.9, '9.9'],
  ];
  it.each(cases)('%s months is shown as "%s"', (months, shown) => {
    expect(withSavings(months * 1000).shown_months).toBe(shown);
  });

  it('breaks every tie up on the exact value, not on binary floating point', () => {
    // 1.35, 2.65 and 8.05 months are exactly 13.5, 26.5 and 80.5 tenths.
    expect(withSavings(1350).shown_months).toBe('1.4');
    expect(withSavings(2650).shown_months).toBe('2.7');
    expect(withSavings(8050).shown_months).toBe('8.1');
  });

  it('shows exactly one month as "1" (the page writes "mes")', () => {
    expect(withSavings(1000).shown_months).toBe('1');
    expect(withSavings(1049).shown_months).toBe('1');
  });
});

describe('calculateFreedom: a result above 1,000 months has no upper limit', () => {
  it('shows a whole number without a thousands separator and sends it as it is', () => {
    const result = withSavings(1234500); // 1,234.5 months
    expect(result.zone).toBe('solid_cushion');
    expect(result.shown_months).toBe('1235');
    expect(result.api_months).toBe(1234.5);
  });

  it('handles a one-cent gap with a large balance', () => {
    const result = calculateFreedom(figures({ expenses: 0.01, savings: 5000 }));
    expect(result.zone).toBe('solid_cushion');
    expect(result.shown_months).toBe('500000');
    expect(result.api_months).toBe(500000);
  });
});

describe('calculateFreedom: the value sent to the API', () => {
  it('is the exact months rounded down to two decimals, never up', () => {
    expect(withSavings(4446).api_months).toBe(4.44); // 4.446 → 4.44, while the page shows "4.4"
    expect(withSavings(4449).api_months).toBe(4.44);
    expect(withSavings(4450).api_months).toBe(4.45); // the page shows "4.5"
    expect(withSavings(9999).api_months).toBe(9.99);
  });

  it('writes a whole value without decimals and keeps a two-decimal value exact', () => {
    expect(withSavings(6000).api_months).toBe(6);
    expect(withSavings(4430).api_months).toBe(4.43);
  });

  it('is consistent with the zone at every limit (contract section 11.2)', () => {
    const consistent = (months: number | null, zone: CalculatorZone): boolean => {
      if (months === null) return zone === 'financially_free';
      if (months < 3) return zone === 'critical';
      if (months < 6) return zone === 'alert';
      if (months < 12) return zone === 'building';
      if (months < 36) return zone === 'path_to_freedom';
      return zone === 'solid_cushion';
    };
    for (const savings of [0, 1, 2990, 2999, 3000, 5990, 5999, 6000, 11990, 11999, 12000, 35990, 35999, 36000, 99999]) {
      const result = withSavings(savings);
      expect(consistent(result.api_months, result.zone), `savings ${savings}`).toBe(true);
    }
  });

  it('has at most two decimal places', () => {
    for (const savings of [1, 7, 333, 4446, 100003]) {
      const months = withSavings(savings).api_months as number;
      expect(Math.round(months * 100)).toBeCloseTo(months * 100, 6);
    }
  });
});
