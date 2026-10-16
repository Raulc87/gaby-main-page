import { describe, expect, it } from 'vitest';
import { detectPageLanguage } from '../../../src/lib/lead/language';

describe('detectPageLanguage', () => {
  it('detects Spanish from the page path', () => {
    expect(detectPageLanguage('/es/')).toBe('es');
    expect(detectPageLanguage('/es/#lead-form')).toBe('es');
  });

  it('detects English from the page path', () => {
    expect(detectPageLanguage('/en/')).toBe('en');
  });

  it('falls back to the default language for an unknown path', () => {
    expect(detectPageLanguage('/')).toBe('es');
    expect(detectPageLanguage('/fr/')).toBe('es');
  });
});

describe('detectPageLanguage under a base path (GitHub Pages preview, ADR-005)', () => {
  const base = '/gaby-main-page/';

  it('reads the language after the base', () => {
    expect(detectPageLanguage('/gaby-main-page/en/', base)).toBe('en');
    expect(detectPageLanguage('/gaby-main-page/en/vip-mentorship/', base)).toBe('en');
    expect(detectPageLanguage('/gaby-main-page/es/mentoria-vip/', base)).toBe('es');
    expect(detectPageLanguage('/gaby-main-page/en/#lead-form', base)).toBe('en');
  });

  it('accepts a base without trailing slash and falls back outside it', () => {
    expect(detectPageLanguage('/gaby-main-page/en/', '/gaby-main-page')).toBe('en');
    expect(detectPageLanguage('/gaby-main-page/', base)).toBe('es');
    expect(detectPageLanguage('/gaby-main-page', base)).toBe('es');
    expect(detectPageLanguage('/en/', base)).toBe('en');
  });

  it('does not mistake a base that looks like a language for the page language', () => {
    expect(detectPageLanguage('/en/es/', '/en/')).toBe('es');
  });

  it('keeps working at the root base', () => {
    expect(detectPageLanguage('/en/', '/')).toBe('en');
    expect(detectPageLanguage('/', '/')).toBe('es');
  });
});
