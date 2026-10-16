// CONTENT.md is the only source of visitor-facing copy: the shared dictionaries
// (header, footer, CTAs, VIP band, metadata, preview marker, pending badge) equal
// its tables verbatim, by key, in both languages (US-020, US-019).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PAGE_IDS } from '../../../src/i18n/routes';
import { common as en } from '../../../src/i18n/en/common';
import { common as es } from '../../../src/i18n/es/common';

const content = readFileSync(join(__dirname, '..', '..', '..', 'docs/ux/CONTENT.md'), 'utf8');

/** key -> [Spanish, English] from the tables of CONTENT.md. */
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
  ['es', es, 0],
  ['en', en, 1],
] as const)('shared dictionary (%s)', (_lang, dictionary, column) => {
  const entries = flatten(dictionary);

  it('has only keys that exist in CONTENT.md', () => {
    for (const [key] of entries) expect(table.has(key), key).toBe(true);
  });

  it('copies every value verbatim', () => {
    for (const [key, value] of entries) expect(value, key).toBe(table.get(key)![column]);
  });

  it('has the title and description of every page id', () => {
    for (const id of PAGE_IDS) {
      expect(dictionary.meta[id].title.length).toBeGreaterThan(0);
      expect(dictionary.meta[id].description.length).toBeGreaterThan(0);
    }
  });

  it('has no Terms link and does not show the blog before US-026', () => {
    expect(entries.map(([key]) => key)).not.toContain('nav.blog');
    expect(entries.map(([key]) => key.toLowerCase()).some((key) => key.includes('terms'))).toBe(false);
  });
});

describe('shared dictionaries', () => {
  it('have the same keys in both languages', () => {
    expect(flatten(es).map(([key]) => key)).toEqual(flatten(en).map(([key]) => key));
  });

  it('use a unique title per page (US-020 AC7)', () => {
    for (const dictionary of [es, en]) {
      const titles = PAGE_IDS.map((id) => dictionary.meta[id].title);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });
});
