/**
 * Freedom-months calculator: the PLACEHOLDER formula of PROJECT_SPEC.md FR-034.
 *
 * Gaby's calculator replaces this one function (`calculateFreedom`) later; the
 * rest of the code only depends on the shape of `CalculatorResult`.
 */

export type CalculatorZone = 'alert' | 'building' | 'freedom';

export interface CalculatorFigures {
  /** Monthly household expenses. */
  expenses: number;
  /** Monthly debt payments. */
  debt_payments: number;
  /** Available savings. */
  savings: number;
  /** Investments the visitor could sell within a month. */
  liquid_investments: number;
  /** Monthly income that does not depend on the salary. */
  other_income: number;
}

export interface CalculatorResult {
  /** True when the monthly gap is 0 or less: the money is "covered". */
  covered: boolean;
  /** Months rounded down to one decimal; `null` when covered. */
  months: number | null;
  zone: CalculatorZone;
}

/** Zone limits, in months, applied to the unrounded value. */
export const ZONE_BUILDING_FROM = 6;
export const ZONE_FREEDOM_FROM = 12;

/** Rounds down to one decimal, ignoring floating-point noise (e.g. 4.4 stays 4.4). */
export function floorToOneDecimal(value: number): number {
  return Math.floor(Number((value * 10).toFixed(9))) / 10;
}

export function zoneForMonths(months: number): CalculatorZone {
  if (months < ZONE_BUILDING_FROM) return 'alert';
  if (months < ZONE_FREEDOM_FROM) return 'building';
  return 'freedom';
}

export function calculateFreedom(figures: CalculatorFigures): CalculatorResult {
  const gap = figures.expenses + figures.debt_payments - figures.other_income;
  if (gap <= 0) {
    return { covered: true, months: null, zone: 'freedom' };
  }
  const months = (figures.savings + figures.liquid_investments) / gap;
  return { covered: false, months: floorToOneDecimal(months), zone: zoneForMonths(months) };
}
