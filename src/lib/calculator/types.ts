// Types of the calculator (US-035): its copy dictionary and the request body of
// POST /api/save-calculator-lead (docs/specs/LEAD_API_CONTRACT.md v1.2 section 11.2).
import type { Language } from '../../i18n';
import type { CalculatorZone } from './formula';

export interface CalculatorFieldCopy {
  label: string;
  hint: string;
}

export interface ZoneCopy {
  title: string;
  body: string;
}

/** Copy of docs/ux/CONTENT.md section 11 (every key is provisional). */
export interface CalculatorDictionary {
  eyebrow: string;
  /** Contains `*emphasis*` markers. */
  title: string;
  lead: string;
  figures: {
    expenses: CalculatorFieldCopy;
    debt: CalculatorFieldCopy;
    savings: CalculatorFieldCopy;
    investments: CalculatorFieldCopy;
    other_income: CalculatorFieldCopy;
  };
  next: string;
  errors: { number: string; no_outflow: string };
  capture: {
    title: string;
    body: string;
    phoneLabel: string;
    /** Contains `{privacy_notice_link}`. */
    consent: { text: string; linkLabel: string };
    marketing: string;
    submit: string;
  };
  result: {
    label: string;
    /** Contains `{months}`. */
    months: string;
    covered: string;
    emailNote: string;
    disclaimer: string;
    restart: string;
  };
  zones: Record<CalculatorZone, ZoneCopy>;
}

/** The five figures' keys, in the order the questions appear. */
export const FIGURE_KEYS = ['expenses', 'debt', 'savings', 'investments', 'other_income'] as const;
export type FigureKey = (typeof FIGURE_KEYS)[number];

/** Body of POST /api/save-calculator-lead. Never carries the five figures (FR-035). */
export interface CalculatorLeadPayload {
  name: string;
  email: string;
  phone: string | null;
  language: Language;
  consent: true;
  marketing_consent: boolean;
  months: number | null;
  zone: CalculatorZone;
  /** Honeypot (contract section 3.1); normally `""`. */
  website: string;
}

export type CalculatorDetailsField = 'name' | 'email' | 'phone' | 'consent';
