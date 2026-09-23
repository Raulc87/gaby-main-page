// A valid and an invalid case for every rule in LEAD_API_CONTRACT.md
// section 3 (normalization included), plus section 4 (screening_answer) and
// section 8 (consent). api/tests/test_validation.py is the backend
// cross-check; this suite must reject/normalize the same inputs.
import { describe, expect, it } from 'vitest';
import {
  validateConsent,
  validateEmail,
  validateLanguage,
  validateName,
  validatePhone,
  validateScreeningAnswer,
} from '../../../src/lib/lead/validation';

describe('validateName', () => {
  it('accepts a normalized full name, collapsing internal whitespace', () => {
    expect(validateName('  Ana   María   Pérez  Soto ')).toEqual({
      value: 'Ana María Pérez Soto',
    });
  });

  it('accepts accented, apostrophe, and hyphen characters', () => {
    expect(validateName("Jean-Paul O'Neíll Núñez")).toEqual({
      value: "Jean-Paul O'Neíll Núñez",
    });
  });

  it('rejects a missing value', () => {
    expect(validateName(undefined)).toEqual({ error: 'required' });
    expect(validateName(null)).toEqual({ error: 'required' });
    expect(validateName('   ')).toEqual({ error: 'required' });
  });

  it('rejects a non-string value', () => {
    expect(validateName(123)).toEqual({ error: 'invalid_type' });
  });

  it('rejects a name shorter than 3 characters after normalization', () => {
    expect(validateName('Al')).toEqual({ error: 'too_short' });
  });

  it('rejects a name longer than 100 characters', () => {
    expect(validateName(`${'A'.repeat(50)} ${'B'.repeat(51)}`)).toEqual({ error: 'too_long' });
  });

  it('rejects disallowed characters', () => {
    expect(validateName('Ana Pérez3')).toEqual({ error: 'invalid_characters' });
  });

  it('rejects a single word', () => {
    expect(validateName('Ana')).toEqual({ error: 'full_name_required' });
  });

  it('rejects a word that does not start with a letter', () => {
    expect(validateName("Ana 'Perez")).toEqual({ error: 'full_name_required' });
  });
});

describe('validateEmail', () => {
  it('accepts and normalizes a valid email (trim, lowercase)', () => {
    expect(validateEmail('  Ana.Perez@Example.COM ')).toEqual({ value: 'ana.perez@example.com' });
  });

  it('rejects a missing value', () => {
    expect(validateEmail('')).toEqual({ error: 'required' });
  });

  it('rejects a non-string value', () => {
    expect(validateEmail(42)).toEqual({ error: 'invalid_type' });
  });

  it('rejects a value over 254 characters', () => {
    const longLocal = 'a'.repeat(250);
    expect(validateEmail(`${longLocal}@example.com`)).toEqual({ error: 'too_long' });
  });

  it('rejects a local part over 64 characters', () => {
    const longLocal = 'a'.repeat(65);
    expect(validateEmail(`${longLocal}@example.com`)).toEqual({ error: 'too_long' });
  });

  it('rejects a value that does not match the email pattern', () => {
    expect(validateEmail('not-an-email')).toEqual({ error: 'invalid_format' });
  });

  it('rejects a local part starting with a period', () => {
    expect(validateEmail('.ana@example.com')).toEqual({ error: 'invalid_format' });
  });

  it('rejects a local part ending with a period', () => {
    expect(validateEmail('ana.@example.com')).toEqual({ error: 'invalid_format' });
  });

  it('rejects a local part with consecutive periods', () => {
    expect(validateEmail('ana..perez@example.com')).toEqual({ error: 'invalid_format' });
  });
});

describe('validatePhone', () => {
  it('accepts and normalizes E.164, stripping spaces/hyphens/parens/periods', () => {
    expect(validatePhone('+506 8410-4791')).toEqual({ value: '+50684104791' });
    expect(validatePhone('+(506) 8410.4791')).toEqual({ value: '+50684104791' });
  });

  it('rejects a missing value', () => {
    expect(validatePhone(undefined)).toEqual({ error: 'required' });
  });

  it('rejects a non-string value', () => {
    expect(validatePhone(50684104791)).toEqual({ error: 'invalid_type' });
  });

  it('rejects a number without a leading +', () => {
    expect(validatePhone('50684104791')).toEqual({ error: 'invalid_format' });
  });

  it('rejects a number that is too short', () => {
    expect(validatePhone('+5061234')).toEqual({ error: 'invalid_format' });
  });

  it('rejects a number that is too long', () => {
    expect(validatePhone('+5061234567890123')).toEqual({ error: 'invalid_format' });
  });

  it('rejects a number starting with +0', () => {
    expect(validatePhone('+0684104791')).toEqual({ error: 'invalid_format' });
  });
});

describe('validateScreeningAnswer', () => {
  it('accepts every contract code', () => {
    expect(validateScreeningAnswer('ready_to_invest')).toEqual({ value: 'ready_to_invest' });
    expect(validateScreeningAnswer('needs_investment_info')).toEqual({
      value: 'needs_investment_info',
    });
    expect(validateScreeningAnswer('no_capacity_now')).toEqual({ value: 'no_capacity_now' });
    expect(validateScreeningAnswer('exploring')).toEqual({ value: 'exploring' });
  });

  it('rejects a missing value', () => {
    expect(validateScreeningAnswer('')).toEqual({ error: 'required' });
  });

  it('rejects a code outside the allowed set', () => {
    expect(validateScreeningAnswer('maybe_later')).toEqual({ error: 'invalid_option' });
  });
});

describe('validateLanguage', () => {
  it('accepts es and en', () => {
    expect(validateLanguage('es')).toEqual({ value: 'es' });
    expect(validateLanguage('en')).toEqual({ value: 'en' });
  });

  it('rejects a missing value', () => {
    expect(validateLanguage(undefined)).toEqual({ error: 'required' });
  });

  it('rejects an unsupported language code', () => {
    expect(validateLanguage('fr')).toEqual({ error: 'invalid_option' });
  });
});

describe('validateConsent', () => {
  it('accepts true', () => {
    expect(validateConsent(true)).toEqual({ value: true });
  });

  it('rejects a missing value', () => {
    expect(validateConsent(undefined)).toEqual({ error: 'required' });
  });

  it('rejects a non-boolean value', () => {
    expect(validateConsent('true')).toEqual({ error: 'invalid_type' });
  });

  it('rejects false', () => {
    expect(validateConsent(false)).toEqual({ error: 'consent_required' });
  });
});
