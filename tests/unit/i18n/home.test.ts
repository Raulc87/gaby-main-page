// CONTENT.md section 5 is the only source of the Home copy: the Home dictionary
// equals its tables verbatim, by key, in both languages (US-021 AC1). Keys that
// CONTENT.md defines as another key are not copied; they point at it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCommon, getHome } from '../../../src/i18n';
import { story as storyEn } from '../../../src/i18n/en/story';
import { story as storyEs } from '../../../src/i18n/es/story';

const content = readFileSync(join(__dirname, '..', '..', '..', 'docs/ux/CONTENT.md'), 'utf8');

const table = new Map<string, [string, string]>();
for (const line of content.split('\n')) {
  const row = line.match(/^\| `([a-z0-9_.]+)` \| (.*) \| (.*) \| (?:approved|provisional) \|$/);
  if (row) table.set(row[1], [row[2], row[3]]);
}

function flatten(value: object, prefix = ''): Array<[string, string]> {
  return Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'string'
      ? [[`${prefix}${key}`, child] as [string, string]]
      : flatten(child as object, `${prefix}${key}.`),
  );
}

describe.each([
  ['es', 0],
  ['en', 1],
] as const)('Home dictionary (%s)', (lang, column) => {
  const entries = flatten(getHome(lang));

  it('copies every value verbatim from CONTENT.md', () => {
    expect(entries.length).toBeGreaterThan(30);
    for (const [key, value] of entries) {
      expect(table.has(key), key).toBe(true);
      expect(value, key).toBe(table.get(key)![column]);
    }
  });

  it('holds every non-alias home.* and testimonial.* key of CONTENT.md', () => {
    const keys = new Set(entries.map(([key]) => key));
    for (const [key, [es]] of table) {
      if (!/^(home|testimonial)\./.test(key) || es.startsWith('= `')) continue;
      expect(keys.has(key), key).toBe(true);
    }
  });

  it('reads the aliased keys from their source instead of copying them', () => {
    const common = getCommon(lang);
    const story = lang === 'es' ? storyEs : storyEn;
    const aliases: Record<string, [source: string, value: string]> = {
      'home.story.media.label': ['story.media.label', story.media.label],
      'home.story.cta': ['cta.read_story', common.cta.read_story],
      'home.mastery.eyebrow': ['vip_band.eyebrow', common.vip_band.eyebrow],
      'home.mastery.cta': ['cta.vip_apply', common.cta.vip_apply],
      'home.vip.eyebrow': ['vip_band.eyebrow', common.vip_band.eyebrow],
      'home.vip.title': ['vip_band.title', common.vip_band.title],
      'home.vip.cta': ['cta.vip_apply', common.cta.vip_apply],
    };
    const keys = entries.map(([key]) => key);
    for (const [key, [source, value]] of Object.entries(aliases)) {
      expect(table.get(key)![column], key).toBe(`= \`${source}\``);
      expect(value, source).toBe(table.get(source)![column]);
      expect(keys).not.toContain(key);
    }
  });

  it('no longer has the resources teaser keys (the calculator replaced it)', () => {
    expect(entries.map(([key]) => key).some((key) => key.startsWith('home.resources.'))).toBe(false);
    expect([...table.keys()].some((key) => key.startsWith('home.resources.'))).toBe(false);
  });
});

describe('Home dictionaries', () => {
  it('have the same keys in both languages', () => {
    expect(flatten(getHome('es')).map(([key]) => key)).toEqual(
      flatten(getHome('en')).map(([key]) => key),
    );
  });
});
