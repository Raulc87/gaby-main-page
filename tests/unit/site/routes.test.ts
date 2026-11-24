// US-020 AC1, AC4, AC7 / ADR-003 update: every page id has a path in both
// languages, paths are unique, and the map matches UX_UI_DIRECTION.md section 3
// and the files under src/pages.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LANGUAGES } from '../../../src/i18n';
import { PAGE_IDS, ROUTES, routePath } from '../../../src/i18n/routes';

const ROOT = join(__dirname, '..', '..', '..');

describe('route map', () => {
  it('lists exactly the page ids of phases 2a, 2c and 2d (blog is phase 2b)', () => {
    expect([...PAGE_IDS]).toEqual([
      'home',
      'story',
      'vip',
      'privacy',
      'method',
      'calculator',
      'mastery',
    ]);
  });

  it('gives method and calculator the paths of UX_UI_DIRECTION.md section 3', () => {
    expect(ROUTES.method).toEqual({ es: '/es/metodo-polaris/', en: '/en/polaris-method/' });
    expect(ROUTES.calculator).toEqual({ es: '/es/calculadora/', en: '/en/calculator/' });
  });

  it('moves the application page to /aplicar/ and /apply/ and adds the Wealth Mastery page (US-041 AC4, AC5)', () => {
    expect(ROUTES.vip).toEqual({ es: '/es/aplicar/', en: '/en/apply/' });
    expect(ROUTES.mastery).toEqual({ es: '/es/wealth-mastery/', en: '/en/wealth-mastery/' });
  });

  it('has no resources page: no route, no page file at the old paths (US-046 AC1, AC3)', () => {
    const paths = PAGE_IDS.flatMap((id) => LANGUAGES.map((lang) => routePath(id, lang)));
    expect(PAGE_IDS as readonly string[]).not.toContain('resources');
    expect(paths).not.toContain('/es/recursos/');
    expect(paths).not.toContain('/en/resources/');
    expect(existsSync(join(ROOT, 'src/pages/es/recursos'))).toBe(false);
    expect(existsSync(join(ROOT, 'src/pages/en/resources'))).toBe(false);
    expect(existsSync(join(ROOT, 'src/data/resources.ts'))).toBe(false);
  });

  it('no longer has a path to the old VIP pages', () => {
    const paths = PAGE_IDS.flatMap((id) => LANGUAGES.map((lang) => routePath(id, lang)));
    expect(paths).not.toContain('/es/mentoria-vip/');
    expect(paths).not.toContain('/en/vip-mentorship/');
  });

  it.each(PAGE_IDS)('%s has a path in both languages', (id) => {
    for (const lang of LANGUAGES) {
      expect(routePath(id, lang)).toMatch(new RegExp(`^/${lang}/([a-z-]+/)?$`));
    }
  });

  it('has unique paths', () => {
    const paths = PAGE_IDS.flatMap((id) => LANGUAGES.map((lang) => routePath(id, lang)));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('matches the site map table of UX_UI_DIRECTION.md section 3', () => {
    const doc = readFileSync(join(ROOT, 'docs/ux/UX_UI_DIRECTION.md'), 'utf8');
    for (const id of PAGE_IDS) {
      const row = doc.split('\n').find((line) => line.startsWith(`| \`${id}\` |`));
      expect(row, `row for ${id}`).toBeDefined();
      expect(row).toContain(`\`${ROUTES[id].es}\``);
      expect(row).toContain(`\`${ROUTES[id].en}\``);
    }
  });

  it('has a page file for every page id and language', () => {
    for (const id of PAGE_IDS) {
      for (const lang of LANGUAGES) {
        const file = join(ROOT, 'src/pages', `${routePath(id, lang)}index.astro`);
        expect(existsSync(file), file).toBe(true);
      }
    }
  });
});
