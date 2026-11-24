// CONTENT.md section 12 is the only source of the Wealth Mastery page copy: the dictionary equals
// its table verbatim, by key, in both languages (US-042 AC1). Keys that CONTENT.md defines as
// another key are not copied; the components read their source. The page shows no price (AC5).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getMastery } from '../../../src/components/mastery/dictionary';
import { MASTERY_PENDING_BLOCKS, showsMasteryBadge } from '../../../src/components/mastery/pending';
import { getCommon, getHome } from '../../../src/i18n';

const content = readFileSync(join(__dirname, '..', '..', '..', 'docs/ux/CONTENT.md'), 'utf8');
const section12 = content.slice(content.indexOf('## 12. Wealth Mastery page'));

const table = new Map<string, [string, string, string]>();
for (const line of section12.split('\n')) {
  const row = line.match(/^\| `(mastery\.[a-z0-9_.]+)` \| (.*) \| (.*) \| (approved|provisional) \|$/);
  if (row) table.set(row[1], [row[2], row[3], row[4]]);
}

function flatten(value: object, prefix = ''): Array<[string, string]> {
  return Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'string'
      ? [[`${prefix}${key}`, child] as [string, string]]
      : flatten(child as object, `${prefix}${key}.`),
  );
}

const isAlias = (es: string) => es.startsWith('= `');

describe.each([
  ['es', 0],
  ['en', 1],
] as const)('Wealth Mastery page dictionary (%s)', (lang, column) => {
  const entries = flatten(getMastery(lang));

  it('copies every value verbatim from CONTENT.md section 12', () => {
    expect(entries.length).toBeGreaterThan(50);
    for (const [key, value] of entries) {
      expect(table.has(key), key).toBe(true);
      expect(value, key).toBe(table.get(key)![column]);
    }
  });

  it('holds every non-alias mastery.* key of CONTENT.md', () => {
    const keys = new Set(entries.map(([key]) => key));
    for (const [key, [es]] of table) {
      if (isAlias(es)) continue;
      expect(keys.has(key), key).toBe(true);
    }
  });

  it('reads the aliased keys from their source instead of copying them', () => {
    const common = getCommon(lang);
    const { home } = getHome(lang);
    const aliases: Record<string, [source: string, value: string]> = {
      'mastery.eyebrow': ['vip_band.eyebrow', common.vip_band.eyebrow],
      'mastery.cta': ['cta.vip_apply', common.cta.vip_apply],
      'mastery.secondary': ['home.hero.secondary', home.hero.secondary],
      'mastery.method.eyebrow': ['home.method.eyebrow', home.method.eyebrow],
      'mastery.guide.cta': ['cta.read_story', common.cta.read_story],
      'mastery.testimonials.title': ['home.testimonials.title', home.testimonials.title],
      'mastery.apply.eyebrow': ['vip_band.eyebrow', common.vip_band.eyebrow],
      'mastery.apply.cta': ['cta.vip_apply', common.cta.vip_apply],
    };
    const keys = entries.map(([key]) => key);
    for (const [key, [source, value]] of Object.entries(aliases)) {
      expect(table.get(key)![column], key).toBe(`= \`${source}\``);
      expect(value.length, source).toBeGreaterThan(0);
      expect(keys).not.toContain(key);
    }
  });

  it('keeps the asterisks only in the two titles with an italic part', () => {
    const withAsterisk = entries.filter(([, value]) => value.includes('*')).map(([key]) => key);
    expect(withAsterisk.sort()).toEqual(['mastery.apply.title', 'mastery.method.title', 'mastery.title'].sort());
  });

  it('shows no price (US-042 AC5)', () => {
    for (const [key, value] of entries) {
      expect(value, key).not.toMatch(/[$₡€]|\bUSD\b|\bCRC\b|\bcolones\b|\bdólares\b|\bdollars?\b|\d{3,}/i);
    }
  });

  it('has no "tú" form, only voseo (FR-043)', () => {
    if (lang !== 'es') return;
    for (const [key, value] of entries) {
      expect(value, key).not.toMatch(/\b(tienes|puedes|quieres|sabes|eres|ganas|invierte|trabaja|calcula|aplica)\b/i);
    }
  });
});

describe('Wealth Mastery page dictionaries', () => {
  it('have the same keys in both languages', () => {
    expect(flatten(getMastery('es')).map(([key]) => key)).toEqual(
      flatten(getMastery('en')).map(([key]) => key),
    );
  });

  it('the pillars have three points each and no numbers', () => {
    for (const lang of ['es', 'en'] as const) {
      const { method } = getMastery(lang).mastery;
      for (const n of ['1', '2', '3'] as const) {
        expect(Object.keys(method[n].point)).toEqual(['1', '2', '3']);
        expect(method[n].title).not.toMatch(/\d/);
        expect(method[n].label).not.toMatch(/\d/);
      }
    }
  });
});

describe('pending badge blocks of the page (CONTENT.md -> Metadata -> Pending badge)', () => {
  const production = { preview: false, dev: false };
  const preview = { preview: true, dev: false };

  it('lists the guide photo as a placeholder and the FAQ answers and adapted lines as provisional', () => {
    expect(MASTERY_PENDING_BLOCKS).toEqual({
      'mastery.guide_photo': 'placeholder',
      'mastery.faq': 'provisional',
      'mastery.adapted_lines': 'provisional',
    });
  });

  it('shows the placeholder in every build and the provisional copy in preview and development only', () => {
    expect(showsMasteryBadge('mastery.guide_photo', production)).toBe(true);
    expect(showsMasteryBadge('mastery.faq', production)).toBe(false);
    expect(showsMasteryBadge('mastery.adapted_lines', production)).toBe(false);
    expect(showsMasteryBadge('mastery.faq', preview)).toBe(true);
    expect(showsMasteryBadge('mastery.adapted_lines', { preview: false, dev: true })).toBe(true);
  });

  it('matches the statuses of section 12: the provisional rows are the FAQ answers and the adapted lines', () => {
    const provisional = [...table.entries()]
      .filter(([, [, , status]]) => status === 'provisional')
      .map(([key]) => key)
      .sort();
    expect(provisional).toEqual(
      [
        'mastery.fit.no.2',
        'mastery.fit.no.3',
        'mastery.how.4.body',
        'mastery.faq.1.answer',
        'mastery.faq.2.answer',
        'mastery.faq.3.answer',
        'mastery.faq.4.answer',
        'mastery.guide.photo.placeholder',
        'mastery.guide.photo_alt',
      ].sort(),
    );
  });
});
