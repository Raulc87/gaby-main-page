import { describe, expect, it } from 'vitest';
import {
  buildCalculatorPayload,
  MAX_FIGURE,
  parseAmount,
  raisesConcentrationAlert,
  validateDetails,
  validateFigures,
} from '../../../src/lib/calculator/validation';
import { SHARES_ANSWERS } from '../../../src/lib/calculator/types';

const goodFigures = { expenses: '4500', savings: '9000', investments: '6000', solidarity: '5000', passive: '0' };

describe('parseAmount', () => {
  it('reads whole amounts, with or without the thousands separators the field shows', () => {
    expect(parseAmount('0')).toEqual({ value: 0 });
    expect(parseAmount(' 1500 ')).toEqual({ value: 1500 });
    expect(parseAmount('4.500')).toEqual({ value: 4500 });
    expect(parseAmount('4,500')).toEqual({ value: 4500 });
    expect(parseAmount('1.250.000')).toEqual({ value: 1250000 });
  });

  it('reads an empty field as 0: only the expenses are required (Gaby\'s prototype)', () => {
    expect(parseAmount('')).toEqual({ value: 0 });
    expect(parseAmount('   ')).toEqual({ value: 0 });
  });

  it('rejects an amount the exact cents arithmetic cannot hold, and accepts the largest that it can', () => {
    expect(parseAmount('9'.repeat(400))).toEqual({ error: 'number' });
    expect(parseAmount('90071992547410')).toEqual({ error: 'number' });
    expect(parseAmount('90071992547409')).toEqual({ value: 90071992547409 });
    expect(MAX_FIGURE).toBeGreaterThan(90071992547409);
  });
});

describe('validateFigures', () => {
  it('returns the figures and the shares answer when all is valid', () => {
    expect(validateFigures(goodFigures, 'from_20_to_50')).toEqual({
      errors: {},
      shares: 'from_20_to_50',
      figures: {
        expenses: 4500,
        savings: 9000,
        liquid_investments: 6000,
        solidarity_association: 5000,
        passive_income: 0,
      },
    });
  });

  it('the shares question must be answered: the empty option shows calc.error.shares', () => {
    const { errors, figures } = validateFigures(goodFigures, '');
    expect(figures).toBeUndefined();
    expect(errors).toEqual({ shares: 'shares' });
    expect(validateFigures(goodFigures, 'some_other_value').errors).toEqual({ shares: 'shares' });
  });

  it('the expenses must be more than 0 (empty or 0 shows calc.error.expenses)', () => {
    expect(validateFigures({ ...goodFigures, expenses: '' }, 'none').errors).toEqual({ expenses: 'expenses' });
    expect(validateFigures({ ...goodFigures, expenses: '0' }, 'none').errors).toEqual({ expenses: 'expenses' });
  });

  it('the other figures may be empty (0)', () => {
    const { figures } = validateFigures({ expenses: '10', savings: '', investments: '', solidarity: '', passive: '' }, 'none');
    expect(figures).toEqual({
      expenses: 10,
      savings: 0,
      liquid_investments: 0,
      solidarity_association: 0,
      passive_income: 0,
    });
  });

  it('reports every out-of-range figure and the unanswered question together', () => {
    const { errors } = validateFigures({ ...goodFigures, savings: '9'.repeat(30), passive: '9'.repeat(30) }, '');
    expect(errors).toEqual({ savings: 'number', passive: 'number', shares: 'shares' });
  });
});

describe('raisesConcentrationAlert', () => {
  it('is true for "20% to 50%" and "over 50%" only', () => {
    expect(SHARES_ANSWERS.filter(raisesConcentrationAlert)).toEqual(['from_20_to_50', 'over_50']);
  });
});

const goodDetails = {
  name: '  Ana María   Pérez Soto ',
  email: 'Ana.Perez@Example.com',
  phone: '',
  consent: true,
  marketing: false,
  website: '',
};

describe('validateDetails', () => {
  it('normalizes the details; an empty WhatsApp is null', () => {
    expect(validateDetails(goodDetails).values).toEqual({
      name: 'Ana María Pérez Soto',
      email: 'ana.perez@example.com',
      phone: null,
      consent: true,
      marketing_consent: false,
      website: '',
    });
  });

  it('normalizes a WhatsApp number to E.164', () => {
    expect(validateDetails({ ...goodDetails, phone: '+506 8410-4791' }).values?.phone).toBe('+50684104791');
  });

  it('rejects an invalid optional WhatsApp number', () => {
    expect(validateDetails({ ...goodDetails, phone: '8410' }).errors).toEqual({ phone: 'invalid_format' });
  });

  it('requires name, email and the consent', () => {
    expect(validateDetails({ ...goodDetails, name: '', email: '', consent: false }).errors).toEqual({
      name: 'required',
      email: 'required',
      consent: 'consent_required',
    });
  });

  it('keeps the follow-up consent optional and only true when ticked', () => {
    expect(validateDetails({ ...goodDetails, marketing: true }).values?.marketing_consent).toBe(true);
    expect(validateDetails({ ...goodDetails, marketing: false }).values?.marketing_consent).toBe(false);
  });

  it('forwards the honeypot value as-is', () => {
    expect(validateDetails({ ...goodDetails, website: 'http://spam.example' }).values?.website).toBe('http://spam.example');
  });
});

describe('buildCalculatorPayload', () => {
  const details = () => validateDetails(goodDetails).values!;

  it('carries exactly the fields of contract v1.3 section 11.2, and never the figures', () => {
    const payload = buildCalculatorPayload(
      details(),
      { result: { api_months: 4.44, zone: 'alert' }, currency: 'USD', sharesAnswer: 'from_20_to_50' },
      'es',
    );
    expect(payload).toEqual({
      name: 'Ana María Pérez Soto',
      email: 'ana.perez@example.com',
      phone: null,
      language: 'es',
      consent: true,
      marketing_consent: false,
      months: 4.44,
      zone: 'alert',
      currency: 'USD',
      concentration_alert: true,
      website: '',
    });
  });

  it('sends months null for financially free, the colones, and no alert when the shares are under 20%', () => {
    const payload = buildCalculatorPayload(
      details(),
      { result: { api_months: null, zone: 'financially_free' }, currency: 'CRC', sharesAnswer: 'under_20' },
      'en',
    );
    expect(payload).toMatchObject({ months: null, zone: 'financially_free', currency: 'CRC', concentration_alert: false });
  });
});
