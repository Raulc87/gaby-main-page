// Client-side validation implementing every rule in
// docs/specs/LEAD_API_CONTRACT.md section 3 (normalization included), plus
// the screening_answer/language/consent rules from sections 4 and 8.
//
// Mirrors `api/validation.py` field-for-field so client and server reject
// and normalize the same inputs (LEAD_API_CONTRACT.md is the source of
// truth; `api/validation.py` is only a cross-check). If the two ever
// disagree, that is a contract violation to raise, not a difference to copy.
import { isLanguage, type Language } from '../../i18n';
import {
  isScreeningAnswerCode,
  type FieldErrorCode,
  type LeadFieldErrors,
  type LeadRequestPayload,
  type ScreeningAnswerCode,
} from './types';

export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 100;
// space, straight and curly apostrophe, hyphen, period
const NAME_ALLOWED_EXTRA_CHARS = new Set([' ', "'", '’', '-', '.']);

export const EMAIL_MAX_LENGTH = 254;
export const EMAIL_LOCAL_MAX_LENGTH = 64;
const EMAIL_PATTERN =
  /^[a-z0-9._%+-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,63}$/;

const PHONE_STRIP_PATTERN = /[ \-().]/g;
const PHONE_PATTERN = /^\+[1-9][0-9]{7,14}$/;

const LETTER_PATTERN = /\p{L}/u;

export interface FieldResult<T> {
  value?: T;
  error?: FieldErrorCode;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string';
}

function requiredString(value: unknown): FieldResult<string> {
  if (value === null || value === undefined) {
    return { error: 'required' };
  }
  if (!isNonEmptyString(value)) {
    return { error: 'invalid_type' };
  }
  if (value.trim() === '') {
    return { error: 'required' };
  }
  return { value };
}

export function validateName(raw: unknown): FieldResult<string> {
  const required = requiredString(raw);
  if (required.error || required.value === undefined) {
    return required;
  }

  const collapsed = required.value.trim().replace(/\s+/g, ' ');

  if (collapsed.length < NAME_MIN_LENGTH) {
    return { error: 'too_short' };
  }
  if (collapsed.length > NAME_MAX_LENGTH) {
    return { error: 'too_long' };
  }
  for (const ch of collapsed) {
    if (!LETTER_PATTERN.test(ch) && !NAME_ALLOWED_EXTRA_CHARS.has(ch)) {
      return { error: 'invalid_characters' };
    }
  }

  const words = collapsed.split(' ');
  if (words.length < 2 || !words.every((word) => LETTER_PATTERN.test(word.charAt(0)))) {
    return { error: 'full_name_required' };
  }

  return { value: collapsed };
}

export function validateEmail(raw: unknown): FieldResult<string> {
  const required = requiredString(raw);
  if (required.error || required.value === undefined) {
    return required;
  }

  const candidate = required.value.trim().toLowerCase();
  const localPart = candidate.split('@', 1)[0];

  if (candidate.length > EMAIL_MAX_LENGTH || localPart.length > EMAIL_LOCAL_MAX_LENGTH) {
    return { error: 'too_long' };
  }
  if (!EMAIL_PATTERN.test(candidate)) {
    return { error: 'invalid_format' };
  }
  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return { error: 'invalid_format' };
  }

  return { value: candidate };
}

export function validatePhone(raw: unknown): FieldResult<string> {
  const required = requiredString(raw);
  if (required.error || required.value === undefined) {
    return required;
  }

  const candidate = required.value.replace(PHONE_STRIP_PATTERN, '');
  if (!PHONE_PATTERN.test(candidate)) {
    return { error: 'invalid_format' };
  }

  return { value: candidate };
}

export function validateScreeningAnswer(raw: unknown): FieldResult<ScreeningAnswerCode> {
  const required = requiredString(raw);
  if (required.error || required.value === undefined) {
    return { error: required.error };
  }
  if (!isScreeningAnswerCode(required.value)) {
    return { error: 'invalid_option' };
  }
  return { value: required.value };
}

export function validateLanguage(raw: unknown): FieldResult<Language> {
  const required = requiredString(raw);
  if (required.error || required.value === undefined) {
    return { error: required.error };
  }
  if (!isLanguage(required.value)) {
    return { error: 'invalid_option' };
  }
  return { value: required.value };
}

export function validateConsent(raw: unknown): FieldResult<true> {
  if (raw === null || raw === undefined) {
    return { error: 'required' };
  }
  if (typeof raw !== 'boolean') {
    return { error: 'invalid_type' };
  }
  if (raw !== true) {
    return { error: 'consent_required' };
  }
  return { value: true };
}

export interface RawLeadFormInput {
  name: unknown;
  email: unknown;
  phone: unknown;
  screening_answer: unknown;
  language: unknown;
  consent: unknown;
}

export interface LeadFormValidationResult {
  fieldErrors: LeadFieldErrors;
  values: Partial<LeadRequestPayload>;
}

/** Validates every field per contract section 3/4/8. Used for the full submit payload. */
export function validateLeadForm(input: RawLeadFormInput): LeadFormValidationResult {
  const fieldErrors: LeadFieldErrors = {};
  const values: Partial<LeadRequestPayload> = {};

  const name = validateName(input.name);
  if (name.error) fieldErrors.name = name.error;
  else values.name = name.value;

  const email = validateEmail(input.email);
  if (email.error) fieldErrors.email = email.error;
  else values.email = email.value;

  const phone = validatePhone(input.phone);
  if (phone.error) fieldErrors.phone = phone.error;
  else values.phone = phone.value;

  const screeningAnswer = validateScreeningAnswer(input.screening_answer);
  if (screeningAnswer.error) fieldErrors.screening_answer = screeningAnswer.error;
  else values.screening_answer = screeningAnswer.value;

  const language = validateLanguage(input.language);
  if (language.error) fieldErrors.language = language.error;
  else values.language = language.value;

  const consent = validateConsent(input.consent);
  if (consent.error) fieldErrors.consent = consent.error;
  else values.consent = consent.value;

  return { fieldErrors, values };
}
