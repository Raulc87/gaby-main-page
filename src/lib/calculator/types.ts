// Types of the calculator (US-044): its copy dictionary, the figures' keys, the shares answer and
// the request body of POST /api/save-calculator-lead (docs/specs/LEAD_API_CONTRACT.md v1.3 section 11.2).
import type { Language } from '../../i18n';
import type { CalculatorZone } from './formula';

export interface CalculatorFieldCopy {
  label: string;
  hint: string;
}

export interface ZoneCopy {
  /** The pill's text. */
  label: string;
  title: string;
  body: string;
}

/** The company-shares answers, in the order the select lists them (after its empty first option). */
export const SHARES_ANSWERS = ['none', 'under_20', 'from_20_to_50', 'over_50'] as const;
export type SharesAnswer = (typeof SHARES_ANSWERS)[number];

/** Copy of docs/ux/CONTENT.md section 11. */
export interface CalculatorDictionary {
  eyebrow: string;
  /** Contains `*emphasis*` markers. */
  title: string;
  lead: string;
  figures: {
    title: string;
    currency: { label: string; usd: string; crc: string };
    exampleNote: string;
    expenses: CalculatorFieldCopy;
    savings: { label: string };
    investments: CalculatorFieldCopy;
    solidarity: CalculatorFieldCopy;
    passive: CalculatorFieldCopy;
    shares: { label: string; placeholder: string; options: Record<SharesAnswer, string> };
  };
  errors: { expenses: string; shares: string; number: string };
  next: string;
  capture: {
    title: string;
    /** Shown until the guide is sent by email (US-038). */
    body: string;
    /** Gaby's text, which promises the guide: shown only once email 1 works end to end (US-038). */
    bodyWithGuide: string;
    phoneLabel: string;
    /** Contains `{privacy_notice_link}`. */
    consent: { text: string; linkLabel: string };
    marketing: string;
    submit: string;
  };
  result: {
    label: string;
    unit: { one: string; many: string };
    zones: Record<CalculatorZone, ZoneCopy>;
    /** The gauge's last label ("36+ meses"). */
    gaugeMax: string;
    available: string;
    gap: string;
    alert: { lead: string; body: string };
    nextStep: { title: string; body: string };
    emailNote: string;
    disclaimer: string;
    restart: string;
  };
}

/** The five money figures' keys, in the order the questions appear. */
export const FIGURE_KEYS = ['expenses', 'savings', 'investments', 'solidarity', 'passive'] as const;
export type FigureKey = (typeof FIGURE_KEYS)[number];

export type Currency = 'USD' | 'CRC';

/** Body of POST /api/save-calculator-lead. Never carries the five figures (FR-035). */
export interface CalculatorLeadPayload {
  name: string;
  email: string;
  phone: string | null;
  language: Language;
  consent: true;
  marketing_consent: boolean;
  /** The months rounded down to two decimals; `null` only when financially free. */
  months: number | null;
  zone: CalculatorZone;
  currency: Currency;
  concentration_alert: boolean;
  /** Honeypot (contract section 3.1); normally `""`. */
  website: string;
}

export type CalculatorDetailsField = 'name' | 'email' | 'phone' | 'consent';
