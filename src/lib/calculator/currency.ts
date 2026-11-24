// The currency switch (UX_UI_DIRECTION.md section 6.10, FR-034): US dollars or colones, converted at
// the configured rate. Each figure keeps what the visitor typed and the currency they typed it in, and
// every display starts from that, never from the last converted value, so switching back and forth
// never drifts (₡1,250 → $3 → ₡1,250).
import type { Currency, FigureKey } from './types';

/** Colones per US dollar when `PUBLIC_CRC_PER_USD` is unset or invalid (FR-034, Gaby's prototype). */
export const DEFAULT_CRC_PER_USD = 500;

export const CURRENCY_SYMBOL: Record<Currency, string> = { USD: '$', CRC: '₡' };

/** Gaby's example figures, in USD (brief section 4.3): the money inputs open with them. */
export const EXAMPLE_FIGURES_USD: Record<FigureKey, number> = {
  expenses: 4500,
  savings: 9000,
  investments: 6000,
  solidarity: 5000,
  passive: 0,
};

/** The configured rate: a positive finite number, else the default. */
export function parseCrcPerUsd(raw: unknown): number {
  const rate = typeof raw === 'string' ? Number(raw.trim()) : typeof raw === 'number' ? raw : NaN;
  return Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_CRC_PER_USD;
}

/** An amount as the visitor typed it, with the currency they typed it in; `null` while the field is empty. */
export type TypedAmount = { value: number; currency: Currency } | null;

/** The amount in another currency, rounded to whole units (half up). */
export function convertAmount(value: number, from: Currency, to: Currency, crcPerUsd: number): number {
  if (from === to) return value;
  return Math.round(from === 'USD' ? value * crcPerUsd : value / crcPerUsd);
}

/** What a field shows in `currency`; `null` when the visitor left it empty. */
export function displayAmount(typed: TypedAmount, currency: Currency, crcPerUsd: number): number | null {
  return typed === null ? null : convertAmount(typed.value, typed.currency, currency, crcPerUsd);
}

/** Gaby's example figures as typed amounts in USD. */
export function exampleAmounts(): Record<FigureKey, TypedAmount> {
  const entries = Object.entries(EXAMPLE_FIGURES_USD).map(([key, value]) => [key, { value, currency: 'USD' as const }]);
  return Object.fromEntries(entries) as Record<FigureKey, TypedAmount>;
}
