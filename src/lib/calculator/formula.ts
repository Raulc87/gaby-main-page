/**
 * Gaby's calculator: the formula of PROJECT_SPEC.md FR-034 (phase 2d), in one function
 * (`calculateFreedom`). The rest of the code depends only on the shape of `CalculatorResult`.
 *
 * The arithmetic is exact: every figure is taken to cents and the zone, the shown months and the
 * months sent to the API are computed with integers (BigInt), so a result on a zone limit
 * (600.06 available against a gap of 100.01 is exactly 6 months) lands in the right zone, the page
 * and GoHighLevel show the same number (ties round half up on the exact value, never on binary
 * floating point), and "covered" is never decided by floating-point noise.
 */

/** The zone codes of LEAD_API_CONTRACT.md v1.3 section 11.2. */
export type CalculatorZone =
  | 'critical'
  | 'alert'
  | 'building'
  | 'path_to_freedom'
  | 'solid_cushion'
  | 'financially_free';

/** The visitor's figures, in the currency they chose. Each is 0 or more. */
export interface CalculatorFigures {
  /** Monthly expenses. */
  expenses: number;
  /** Money in savings accounts and wallets. */
  savings: number;
  /** Investments the visitor could sell within a month. */
  liquid_investments: number;
  /** Balance of the solidarity association (asociación solidarista). */
  solidarity_association: number;
  /** Monthly income that does not depend on working. */
  passive_income: number;
}

export interface CalculatorResult {
  zone: CalculatorZone;
  /**
   * The months as the visitor sees them (FR-034 display rule), written with a decimal point:
   * "4.5", "6", "10". `null` when financially free (the page shows "∞").
   */
  shown_months: string | null;
  /**
   * The months sent to the API: the exact value rounded **down** to two decimals, so it stays on
   * the same side of every zone limit as the exact value (contract section 11.2). `null` when
   * financially free.
   */
  api_months: number | null;
  /** Savings and wallets + liquid investments + solidarity association. */
  available_money: number;
  /** Monthly expenses − passive income, never below 0. */
  monthly_gap: number;
}

/** Zone limits, in months, from the exact value (FR-034). */
export const ZONE_ALERT_FROM = 3n;
export const ZONE_BUILDING_FROM = 6n;
export const ZONE_PATH_TO_FREEDOM_FROM = 12n;
export const ZONE_SOLID_CUSHION_FROM = 36n;

/** From this many months the display rule shows a whole number instead of a tenth (FR-034). */
const WHOLE_NUMBER_FROM = 10n;
const CENTS_PER_UNIT = 100n;

/** A money amount in cents (amounts with more decimals are rounded to the nearest cent). */
function toCents(amount: number): bigint {
  return BigInt(Math.round(amount * 100));
}

function fromCents(cents: bigint): number {
  return Number(cents) / 100;
}

/** `numerator / denominator` rounded to the nearest integer, ties up (both positive). */
function divideHalfUp(numerator: bigint, denominator: bigint): bigint {
  return (2n * numerator + denominator) / (2n * denominator);
}

function zoneFor(available: bigint, gap: bigint): CalculatorZone {
  if (available < ZONE_ALERT_FROM * gap) return 'critical';
  if (available < ZONE_BUILDING_FROM * gap) return 'alert';
  if (available < ZONE_PATH_TO_FREEDOM_FROM * gap) return 'building';
  if (available < ZONE_SOLID_CUSHION_FROM * gap) return 'path_to_freedom';
  return 'solid_cushion';
}

/** FR-034 display rule: below 10 months the nearest tenth (a whole value without a decimal), from 10 the nearest whole. */
function shownMonthsFor(available: bigint, gap: bigint): string {
  if (available >= WHOLE_NUMBER_FROM * gap) return divideHalfUp(available, gap).toString();
  const tenths = divideHalfUp(10n * available, gap);
  const whole = tenths / 10n;
  const tenth = tenths % 10n;
  return tenth === 0n ? whole.toString() : `${whole}.${tenth}`;
}

export function calculateFreedom(figures: CalculatorFigures): CalculatorResult {
  const available =
    toCents(figures.savings) + toCents(figures.liquid_investments) + toCents(figures.solidarity_association);
  const gap = toCents(figures.expenses) - toCents(figures.passive_income);

  if (gap <= 0n) {
    return {
      zone: 'financially_free',
      shown_months: null,
      api_months: null,
      available_money: fromCents(available),
      monthly_gap: 0,
    };
  }

  const apiMonthsInCents = (available * CENTS_PER_UNIT) / gap; // BigInt division rounds down.
  return {
    zone: zoneFor(available, gap),
    shown_months: shownMonthsFor(available, gap),
    api_months: fromCents(apiMonthsInCents),
    available_money: fromCents(available),
    monthly_gap: fromCents(gap),
  };
}
