import { describe, expect, it } from 'vitest';
import {
  buildCalculatorPayload,
  parseFigure,
  validateDetails,
  validateFigures,
} from '../../../src/lib/calculator/validation';

const goodFigures = { expenses: '800', debt: '200', savings: '3000', investments: '0', other_income: '0' };

describe('parseFigure', () => {
  it('accepts 0 and positive numbers, with a point or a comma as decimal separator', () => {
    expect(parseFigure('0')).toEqual({ value: 0 });
    expect(parseFigure(' 1500 ')).toEqual({ value: 1500 });
    expect(parseFigure('1500.5')).toEqual({ value: 1500.5 });
    expect(parseFigure('1500,5')).toEqual({ value: 1500.5 });
  });

  it('requires a value', () => {
    expect(parseFigure('')).toEqual({ error: 'required' });
    expect(parseFigure('   ')).toEqual({ error: 'required' });
  });

  it.each(['-1', 'abc', '1e5', '1.2.3', '1,000.50', '$100', '+5', 'NaN', 'Infinity'])('rejects "%s"', (text) => {
    expect(parseFigure(text)).toEqual({ error: 'number' });
  });

  it('rejects a number too large to be finite', () => {
    expect(parseFigure('9'.repeat(400))).toEqual({ error: 'number' });
  });
});

describe('validateFigures', () => {
  it('returns the figures when all five are valid', () => {
    expect(validateFigures(goodFigures).figures).toEqual({
      expenses: 800,
      debt_payments: 200,
      savings: 3000,
      liquid_investments: 0,
      other_income: 0,
    });
  });

  it('reports every invalid or empty figure', () => {
    const { errors, figures } = validateFigures({ ...goodFigures, savings: '', other_income: '-3' });
    expect(figures).toBeUndefined();
    expect(errors).toEqual({ savings: 'required', other_income: 'number' });
  });

  it('expenses plus debt payments must be above 0', () => {
    const { errors, figures } = validateFigures({ ...goodFigures, expenses: '0', debt: '0' });
    expect(figures).toBeUndefined();
    expect(errors).toEqual({ expenses: 'no_outflow' });
  });

  it('allows one of the two to be 0', () => {
    expect(validateFigures({ ...goodFigures, expenses: '0' }).figures).toBeDefined();
    expect(validateFigures({ ...goodFigures, debt: '0' }).figures).toBeDefined();
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
  it('carries the details, the language, the months and the zone, and never the figures', () => {
    const details = validateDetails(goodDetails).values!;
    const payload = buildCalculatorPayload(details, { months: 3, zone: 'alert' }, 'es');
    expect(Object.keys(payload).sort()).toEqual(
      ['consent', 'email', 'language', 'marketing_consent', 'months', 'name', 'phone', 'website', 'zone'].sort(),
    );
    expect(payload).toMatchObject({ language: 'es', months: 3, zone: 'alert' });
  });

  it('sends months null when the result is covered', () => {
    const details = validateDetails(goodDetails).values!;
    expect(buildCalculatorPayload(details, { months: null, zone: 'freedom' }, 'en').months).toBeNull();
  });
});
