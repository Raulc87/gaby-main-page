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
    const aliases: Record<string, string> = {
      'home.hero.cta': common.cta.vip_long,
      'home.hero.secondary': common.cta.start_free,
      'home.resources.cta': common.cta.all_resources,
      'home.story.p1': story.p1,
      'home.story.p2': story.p2,
      'home.story.p3': story.p3,
      'home.story.cta': common.cta.read_story,
    };
    const source: Record<string, string> = {
      'home.hero.cta': 'cta.vip_long',
      'home.hero.secondary': 'cta.start_free',
      'home.resources.cta': 'cta.all_resources',
      'home.story.p1': 'story.p1',
      'home.story.p2': 'story.p2',
      'home.story.p3': 'story.p3',
      'home.story.cta': 'cta.read_story',
    };
    for (const [key, value] of Object.entries(aliases)) {
      expect(table.get(key)![column], key).toBe(`= \`${source[key]}\``);
      expect(value, source[key]).toBe(table.get(source[key])![column]);
    }
    const keys = entries.map(([key]) => key);
    for (const key of Object.keys(aliases)) expect(keys).not.toContain(key);
  });
});

describe('Home dictionaries', () => {
  it('have the same keys in both languages', () => {
    expect(flatten(getHome('es')).map(([key]) => key)).toEqual(
      flatten(getHome('en')).map(([key]) => key),
    );
  });
});
