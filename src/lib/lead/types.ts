// Contract types for POST /api/save-lead (docs/specs/LEAD_API_CONTRACT.md v1.0).
// LEAD_API_CONTRACT.md is locked; this module mirrors it exactly and must be
// updated only when the contract version changes (see AGENTS.md change
// management). `api/validation.py` is a cross-check, never the source of
// truth.
import type { Language } from '../../i18n';

export const SCREENING_ANSWER_CODES = [
  'ready_to_invest',
  'needs_investment_info',
  'no_capacity_now',
  'exploring',
] as const;

export type ScreeningAnswerCode = (typeof SCREENING_ANSWER_CODES)[number];

export function isScreeningAnswerCode(value: string): value is ScreeningAnswerCode {
  return (SCREENING_ANSWER_CODES as readonly string[]).includes(value);
}

/** Fields sent in the POST /api/save-lead request body (contract section 3). */
export interface LeadRequestPayload {
  name: string;
  email: string;
  phone: string;
  screening_answer: ScreeningAnswerCode;
  language: Language;
  consent: true;
  /**
   * Honeypot field (contract section 3.1, US-013). Always sent, normally
   * `""`; the client never validates or rejects it, it only forwards the
   * hidden field's value as-is.
   */
  website: string;
}

/** Field names that can carry a validation error (contract section 8). */
export type LeadFormField = keyof LeadRequestPayload;

/** Field error codes (contract section 8). */
export type FieldErrorCode =
  | 'required'
  | 'invalid_type'
  | 'too_short'
  | 'too_long'
  | 'invalid_characters'
  | 'full_name_required'
  | 'invalid_format'
  | 'invalid_option'
  | 'consent_required';

export type LeadFieldErrors = Partial<Record<LeadFormField, FieldErrorCode>>;

/** Top-level `error_code` values (contract section 7). */
export type ErrorCode =
  | 'invalid_json'
  | 'not_found'
  | 'method_not_allowed'
  | 'payload_too_large'
  | 'unsupported_media_type'
  | 'validation_error'
  | 'rate_limited'
  | 'internal_error'
  | 'storage_unavailable';

/** Response envelope shape (contract section 7). */
export interface LeadApiResponseBody {
  success: boolean;
  message: string;
  error_code: ErrorCode | null;
  field_errors: LeadFieldErrors | null;
}

/**
 * Shape of src/i18n/{es,en}/form.ts (UX_UI_DIRECTION.md section 4, sections
 * 7-8). Filled in progressively: GK-004-lead-form defines the fields below;
 * GK-005-pre-screening, GK-011-privacy-consent, and GK-007-calendly extend
 * this interface with the screening, consent/privacy-notice, and
 * thank-you/Calendly copy.
 */
export interface ScreeningOptionCopy {
  code: ScreeningAnswerCode;
  label: string;
}

export interface FormDictionary {
  formTitle: string;
  name: { label: string; hint: string };
  email: { label: string };
  phone: { label: string; hint: string };
  screening: { prompt: string; options: ScreeningOptionCopy[] };
  /** `text` contains one `{privacy_notice_link}` placeholder rendered as the dialog trigger. */
  consent: { text: string; linkLabel: string };
  submit: { idle: string; submitting: string };
  /** The line under the submit button (`form.trust`). */
  trust: string;
  /** Qualified screen (`thanks.qualified.*`, US-023 AC4). */
  thankYou: { title: string; text: string };
  /** Not-ready screen (`thanks.not_ready.title` and `.body`, US-023 AC5). */
  notReady: { title: string; text: string };
  /** Shown when Calendly is unavailable; contains one `{contact_email}` placeholder. */
  calendlyFallback: string;
  /**
   * Keyed by contract field error code (section 8), except `invalid_format`
   * which UX_UI_DIRECTION.md gives distinct copy per field: use
   * `invalid_format_email` / `invalid_format_phone` for that code. There is
   * no dedicated copy for `invalid_type` (a wrong-JSON-type request the
   * client never legitimately sends); callers fall back to `required`.
   */
  fieldErrors: {
    required: string;
    too_short: string;
    too_long: string;
    invalid_characters: string;
    full_name_required: string;
    invalid_format_email: string;
    invalid_format_phone: string;
    invalid_option: string;
    consent_required: string;
  };
  /** Generic error for any non-201 result or network failure; contains one `{contact_email}` placeholder. */
  submissionError: string;
  /**
   * `429` / `rate_limited` (contract section 3.2, US-013): "too many
   * attempts" message; contains one `{contact_email}` placeholder.
   */
  rateLimited: string;
}

/** VIP page copy (CONTENT.md section 8.1-8.2; `vip.lead` is `vip_band.body`, read from the shared dictionary). */
export interface VipDictionary {
  eyebrow: string;
  title: string;
  steps: [string, string, string];
  video: { title: string; placeholder: string };
}

/** Resource card labels and topic names (CONTENT.md sections 7.1-7.2), keyed as in CONTENT.md. */
export interface ResourcesDictionary {
  resource: {
    type: Record<'minicourse' | 'guide' | 'template' | 'checklist' | 'class', string>;
    free: string;
    access: Record<'download' | 'email', string>;
    cta: Record<'download' | 'guide' | 'class' | 'minicourse', string>;
    pending: string;
    email: { coming_soon: string };
    /** Contains one `{title}` placeholder. */
    cover_alt: string;
  };
  resources: {
    topic: Record<'debt' | 'wallets' | 'investing' | 'mindset', string>;
  };
}

/**
 * Privacy notice (CONTENT.md section 9), keyed as in CONTENT.md (`privacy.title`,
 * `privacy.p1`, ...): the page and the dialog show the same text. Paragraphs may
 * contain one `{contact_email}`, rendered as a mailto link.
 */
export interface PrivacyDictionary {
  privacy: {
    title: string;
    draft_label: string;
    close: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    p5: string;
    p6: string;
    p7: string;
    p8: string;
  };
}

export const PRIVACY_PARAGRAPH_KEYS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'] as const;
