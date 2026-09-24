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
