// ADR-003 update, ADR-005: links and assets include the base path, so the same
// build works at / and under /gaby-main-page/ (US-020 AC1, AC4).
import { describe, expect, it } from 'vitest';
import { LANGUAGES } from '../../../src/i18n';
import { PAGE_IDS, routePath } from '../../../src/i18n/routes';
import { assetUrl, pageHref, withBase } from '../../../src/lib/site/links';

const PREVIEW_BASES = ['/gaby-main-page/', '/gaby-main-page'];

describe('withBase', () => {
  it('leaves paths unchanged at the root base', () => {
    expect(withBase('/es/', '/')).toBe('/es/');
    expect(withBase('/', '/')).toBe('/');
  });

  it.each(PREVIEW_BASES)('prefixes the base %s exactly once', (base) => {
    expect(withBase('/es/', base)).toBe('/gaby-main-page/es/');
    expect(withBase('/', base)).toBe('/gaby-main-page/');
    expect(withBase('favicon.svg', base)).toBe('/gaby-main-page/favicon.svg');
  });
});

describe('pageHref', () => {
  it.each(PAGE_IDS.flatMap((id) => LANGUAGES.map((lang) => [id, lang] as const)))(
    '%s in %s includes the base and the route',
    (id, lang) => {
      for (const base of PREVIEW_BASES) {
        expect(pageHref(id, lang, undefined, base)).toBe(`/gaby-main-page${routePath(id, lang)}`);
      }
      expect(pageHref(id, lang, undefined, '/')).toBe(routePath(id, lang));
    },
  );

  it('appends the anchor after the path', () => {
    expect(pageHref('home', 'es', 'metodo', '/gaby-main-page/')).toBe('/gaby-main-page/es/#metodo');
    expect(pageHref('vip', 'en', 'aplicar', '/')).toBe('/en/vip-mentorship/#aplicar');
  });

  it('switching language keeps the page id', () => {
    for (const id of PAGE_IDS) {
      expect(pageHref(id, 'en', undefined, '/')).toBe(routePath(id, 'en'));
      expect(pageHref(id, 'es', undefined, '/')).toBe(routePath(id, 'es'));
    }
  });
});

describe('assetUrl', () => {
  it('prefixes files in public/ with the base', () => {
    expect(assetUrl('/favicon.svg', '/gaby-main-page/')).toBe('/gaby-main-page/favicon.svg');
    expect(assetUrl('/favicon.svg', '/')).toBe('/favicon.svg');
  });
});
