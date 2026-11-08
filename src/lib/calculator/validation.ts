// Client-side validation of the calculator's two steps (US-035 AC2, AC4).
// The details reuse the lead form's rules (name, email, phone, consent) so the
// client and the server agree (contract v1.2 section 11.2: "As in section 3").
import type { Language } from '../../i18n';
import type { FieldErrorCode } from '../lead/types';
import { validateConsent, validateEmail, validateName, validatePhone } from '../lead/validation';
import type { CalculatorFigures, CalculatorZone } from './formula';
import { FIGURE_KEYS, type CalculatorDetailsField, type CalculatorLeadPayload, type FigureKey } from './types';

export type FigureErrorCode = 'required' | 'number' | 'no_outflow';

/**
 * The largest figure accepted: the formula works in whole cents (exact integers), so an amount
 * must stay below Number.MAX_SAFE_INTEGER cents (about 90 trillion). Anything larger is not a
 * realistic amount and is reported with the same "enter a number" error.
 */
export const MAX_FIGURE = Number.MAX_SAFE_INTEGER / 100;

/** Plain decimal numbers only: digits with an optional decimal point or comma, no sign, no thousands separators. */
const FIGURE_PATTERN = /^\d+(?:[.,]\d+)?$/;

export function parseFigure(raw: unknown): { value?: number; error?: FigureErrorCode } {
  if (typeof raw !== 'string' || raw.trim() === '') return { error: 'required' };
  const text = raw.trim();
  if (!FIGURE_PATTERN.test(text)) return { error: 'number' };
  const value = Number(text.replace(',', '.'));
  if (!Number.isFinite(value) || value > MAX_FIGURE) return { error: 'number' };
  return { value };
}

export interface FiguresValidation {
  errors: Partial<Record<FigureKey, FigureErrorCode>>;
  figures?: CalculatorFigures;
}

/** Five required numbers of 0 or more; expenses plus debt payments must be above 0. */
export function validateFigures(raw: Record<FigureKey, unknown>): FiguresValidation {
  const errors: FiguresValidation['errors'] = {};
  const values: Partial<Record<FigureKey, number>> = {};
  for (const key of FIGURE_KEYS) {
    const result = parseFigure(raw[key]);
    if (result.error) errors[key] = result.error;
    else values[key] = result.value;
  }
  // Same rule as the formula: amounts are taken to cents, so 0.004 counts as 0.
  const outflowCents = Math.round((values.expenses ?? 0) * 100) + Math.round((values.debt ?? 0) * 100);
  if (!errors.expenses && !errors.debt && outflowCents <= 0) {
    errors.expenses = 'no_outflow';
  }
  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    figures: {
      expenses: values.expenses!,
      debt_payments: values.debt!,
      savings: values.savings!,
      liquid_investments: values.investments!,
      other_income: values.other_income!,
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

/** The request body: the visitor's details plus the result; never the five figures. */
export function buildCalculatorPayload(
  details: NonNullable<DetailsValidation['values']>,
  result: { months: number | null; zone: CalculatorZone },
  language: Language,
): CalculatorLeadPayload {
  return { ...details, language, months: result.months, zone: result.zone };
}
