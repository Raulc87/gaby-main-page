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
  privacyNotice: {
    title: string;
    draftLabel: string;
    closeLabel: string;
    /** Paragraphs may contain `{contact_email}`, replaced with `PUBLIC_CONTACT_EMAIL` before rendering. */
    paragraphs: string[];
  };
  submit: { idle: string; submitting: string };
  thankYou: { title: string; text: string };
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
}
