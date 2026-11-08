/**
 * Freedom-months calculator: the PLACEHOLDER formula of PROJECT_SPEC.md FR-034.
 *
 * Gaby's calculator replaces this one function (`calculateFreedom`) later; the
 * rest of the code only depends on the shape of `CalculatorResult`.
 *
 * The arithmetic is exact: every figure is taken to cents and the gap, the zone
 * and the months are computed with integers (BigInt), so a result on a zone limit
 * (600.06 saved against a gap of 100.01 is exactly 6 months) lands in the right
 * zone and "covered" is never decided by floating-point noise.
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
export const ZONE_BUILDING_FROM = 6n;
export const ZONE_FREEDOM_FROM = 12n;

/** A money amount in cents (amounts with more decimals are rounded to the nearest cent). */
function toCents(amount: number): bigint {
  return BigInt(Math.round(amount * 100));
}

export function calculateFreedom(figures: CalculatorFigures): CalculatorResult {
  const gap = toCents(figures.expenses) + toCents(figures.debt_payments) - toCents(figures.other_income);
  if (gap <= 0n) {
    return { covered: true, months: null, zone: 'freedom' };
  }
  const available = toCents(figures.savings) + toCents(figures.liquid_investments);

  // months = available / gap. Zones come from the unrounded value, compared without division.
  const zone: CalculatorZone =
    available < ZONE_BUILDING_FROM * gap ? 'alert' : available < ZONE_FREEDOM_FROM * gap ? 'building' : 'freedom';

  // Rounded down to one decimal: floor(available * 10 / gap) tenths (BigInt division floors).
  const months = Number((available * 10n) / gap) / 10;
  return { covered: false, months, zone };
}
