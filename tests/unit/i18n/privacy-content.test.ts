// CONTENT.md section 9 is the only source of the privacy notice text: the page and
// the consent dialog read it from privacy.ts, which equals the table verbatim by key
// in both languages (US-020 AC1, US-011 AC2).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { privacy as en } from '../../../src/i18n/en/privacy';
import { privacy as es } from '../../../src/i18n/es/privacy';
import { PRIVACY_PARAGRAPH_KEYS } from '../../../src/lib/lead/types';

const content = readFileSync(join(__dirname, '..', '..', '..', 'docs/ux/CONTENT.md'), 'utf8');

const table = new Map<string, [string, string]>();
for (const line of content.split('\n')) {
  const row = line.match(/^\| `([a-z0-9_.]+)` \| (.*) \| (.*) \| (?:approved|provisional) \|$/);
  if (row) table.set(row[1], [row[2], row[3]]);
}

describe.each([
  ['es', es, 0],
  ['en', en, 1],
] as const)('privacy dictionary (%s)', (_lang, dictionary, column) => {
  it('copies every privacy.* value verbatim from CONTENT.md', () => {
    const entries = Object.entries(dictionary.privacy);
    expect(entries.length).toBe(3 + PRIVACY_PARAGRAPH_KEYS.length);
    for (const [key, value] of entries) {
      expect(table.has(`privacy.${key}`), key).toBe(true);
      expect(value, key).toBe(table.get(`privacy.${key}`)![column]);
    }
  });

  it('has the DRAFT label and the contact email placeholder where CONTENT.md has it', () => {
    expect(dictionary.privacy.draft_label.length).toBeGreaterThan(0);
    expect(dictionary.privacy.p1).toContain('{contact_email}');
    expect(dictionary.privacy.p6).toContain('{contact_email}');
  });
});

describe('privacy dictionaries', () => {
  it('have the same keys in both languages', () => {
    expect(Object.keys(es.privacy)).toEqual(Object.keys(en.privacy));
  });

  it('cover every privacy.* key of CONTENT.md', () => {
    const keys = [...table.keys()].filter((key) => key.startsWith('privacy.'));
    expect(keys.sort()).toEqual(Object.keys(es.privacy).map((key) => `privacy.${key}`).sort());
  });
});
