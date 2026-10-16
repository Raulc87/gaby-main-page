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
  it('lists exactly the phase 2a page ids', () => {
    expect([...PAGE_IDS]).toEqual(['home', 'story', 'resources', 'vip', 'privacy']);
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
