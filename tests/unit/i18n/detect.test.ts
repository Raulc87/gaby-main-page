import { describe, expect, it } from 'vitest';
import { detectLanguage } from '../../../src/i18n';

describe('detectLanguage (ADR-003, US-010)', () => {
  it('uses the saved preference when present, ignoring the browser language', () => {
    expect(detectLanguage({ storedPreference: 'en', browserLanguages: ['es-CR', 'es'] })).toBe(
      'en',
    );
    expect(detectLanguage({ storedPreference: 'es', browserLanguages: ['en-US'] })).toBe('es');
  });

  it('ignores an invalid stored value and falls back to browser detection', () => {
    expect(detectLanguage({ storedPreference: 'fr', browserLanguages: ['en-US'] })).toBe('en');
  });

  it('detects Spanish from any es-* browser locale', () => {
    expect(detectLanguage({ browserLanguages: ['es'] })).toBe('es');
    expect(detectLanguage({ browserLanguages: ['es-CR'] })).toBe('es');
    expect(detectLanguage({ browserLanguages: ['es-MX'] })).toBe('es');
  });

  it('is case-insensitive when matching the browser locale', () => {
    expect(detectLanguage({ browserLanguages: ['ES-cr'] })).toBe('es');
  });

  it('defaults to English for any non-Spanish browser locale', () => {
    expect(detectLanguage({ browserLanguages: ['en-US'] })).toBe('en');
    expect(detectLanguage({ browserLanguages: ['fr-FR'] })).toBe('en');
  });

  it('defaults to English when no browser languages are available', () => {
    expect(detectLanguage({ browserLanguages: [] })).toBe('en');
    expect(detectLanguage({})).toBe('en');
  });

  it('only uses the first preferred browser language, per ADR-003', () => {
    expect(detectLanguage({ browserLanguages: ['en-US', 'es-CR'] })).toBe('en');
  });
});
