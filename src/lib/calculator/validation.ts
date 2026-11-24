// Client-side validation of the calculator's two steps (US-044 AC2, AC3, AC7).
// The details reuse the lead form's rules (name, email, phone, consent) so the
// client and the server agree (contract v1.3 section 11.2: "As in section 3").
import type { Language } from '../../i18n';
import type { FieldErrorCode } from '../lead/types';
import { validateConsent, validateEmail, validateName, validatePhone } from '../lead/validation';
import { digitsOf } from './amounts';
import type { CalculatorFigures, CalculatorResult } from './formula';
import {
  FIGURE_KEYS,
  SHARES_ANSWERS,
  type CalculatorDetailsField,
  type CalculatorLeadPayload,
  type Currency,
  type FigureKey,
  type SharesAnswer,
} from './types';

/** `expenses`: empty or 0 (`calc.error.expenses`); `number`: out of range (`calc.error.number`); `shares`: unanswered (`calc.error.shares`). */
export type FigureErrorCode = 'expenses' | 'number' | 'shares';

/**
 * The largest figure accepted: the formula works in whole cents (exact integers), so an amount
 * must stay below Number.MAX_SAFE_INTEGER cents (about 90 trillion). Anything larger is not a
 * realistic amount and is reported with the same "enter a number" error (FR-034).
 */
export const MAX_FIGURE = Number.MAX_SAFE_INTEGER / 100;

/**
 * An amount from what the field holds: whole, 0 or more. An empty field is 0 (Gaby's prototype:
 * only the expenses are required); too large an amount is an error.
 */
export function parseAmount(raw: unknown): { value?: number; error?: 'number' } {
  const digits = typeof raw === 'string' ? digitsOf(raw) : '';
  if (digits === '') return { value: 0 };
  const value = Number(digits);
  if (!Number.isFinite(value) || value > MAX_FIGURE) return { error: 'number' };
  return { value };
}

/** The shares answers that raise the concentration alert (FR-034): 20% to 50%, and over 50%. */
export function raisesConcentrationAlert(answer: SharesAnswer): boolean {
  return answer === 'from_20_to_50' || answer === 'over_50';
}

export function isSharesAnswer(value: unknown): value is SharesAnswer {
  return typeof value === 'string' && (SHARES_ANSWERS as readonly string[]).includes(value);
}

export interface FiguresValidation {
  errors: Partial<Record<FigureKey | 'shares', FigureErrorCode>>;
  figures?: CalculatorFigures;
  shares?: SharesAnswer;
}

/** Five whole amounts of 0 or more (expenses above 0) and the shares answer, which must be chosen. */
export function validateFigures(raw: Record<FigureKey, unknown>, sharesRaw: unknown): FiguresValidation {
  const errors: FiguresValidation['errors'] = {};
  const values: Partial<Record<FigureKey, number>> = {};
  for (const key of FIGURE_KEYS) {
    const result = parseAmount(raw[key]);
    if (result.error) errors[key] = result.error;
    else values[key] = result.value;
  }
  if (!errors.expenses && !values.expenses) errors.expenses = 'expenses';
  if (!isSharesAnswer(sharesRaw)) errors.shares = 'shares';
  if (Object.keys(errors).length > 0 || !isSharesAnswer(sharesRaw)) return { errors };
  return {
    errors,
    shares: sharesRaw,
    figures: {
      expenses: values.expenses!,
      savings: values.savings!,
      liquid_investments: values.investments!,
      solidarity_association: values.solidarity!,
      passive_income: values.passive!,
    },
  };
}

export interface RawDetailsInput {
  name: unknown;
  email: unknown;
  phone: unknown;
  consent: unknown;
  marketing: unknown;
  website: unknown;
}

export interface DetailsValidation {
  errors: Partial<Record<CalculatorDetailsField, FieldErrorCode>>;
  /** Everything but the result, present only when valid. */
  values?: Pick<CalculatorLeadPayload, 'name' | 'email' | 'phone' | 'consent' | 'marketing_consent' | 'website'>;
}

export function validateDetails(input: RawDetailsInput): DetailsValidation {
  const errors: DetailsValidation['errors'] = {};

  const name = validateName(input.name);
  if (name.error) errors.name = name.error;
  const email = validateEmail(input.email);
  if (email.error) errors.email = email.error;

  // The WhatsApp number is optional: empty means no phone (contract section 11.2).
  let phone: string | null = null;
  if (typeof input.phone === 'string' && input.phone.trim() !== '') {
    const result = validatePhone(input.phone);
    if (result.error) errors.phone = result.error;
    else phone = result.value ?? null;
  }

  const consent = validateConsent(input.consent);
  if (consent.error) errors.consent = consent.error;

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    values: {
      name: name.value!,
      email: email.value!,
      phone,
      consent: true,
      marketing_consent: input.marketing === true,
      website: typeof input.website === 'string' ? input.website : '',
    },
  };
}

/** What the details step sends besides the visitor's own details: the result, the currency and the shares answer. */
export interface CalculatorOutcome {
  result: Pick<CalculatorResult, 'api_months' | 'zone'>;
  currency: Currency;
  sharesAnswer: SharesAnswer;
}

/** The request body (contract v1.3 section 11.2): the visitor's details plus the result; never the five figures. */
export function buildCalculatorPayload(
  details: NonNullable<DetailsValidation['values']>,
  outcome: CalculatorOutcome,
  language: Language,
): CalculatorLeadPayload {
  return {
    ...details,
    language,
    months: outcome.result.api_months,
    zone: outcome.result.zone,
    currency: outcome.currency,
    concentration_alert: raisesConcentrationAlert(outcome.sharesAnswer),
  };
}
