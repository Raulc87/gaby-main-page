// US-022 AC1: the My story dictionaries equal docs/ux/CONTENT.md section 6 verbatim,
// by key, in both languages.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { story as en } from '../../../src/i18n/en/story';
import { story as es } from '../../../src/i18n/es/story';

const content = readFileSync(join(__dirname, '..', '..', '..', 'docs/ux/CONTENT.md'), 'utf8');
const section = content.split('\n## 6. ')[1].split('\n## 7. ')[0];

const table = new Map<string, [string, string]>();
for (const line of section.split('\n')) {
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
] as const)('story dictionary (%s)', (_lang, dictionary, column) => {
  const entries = flatten(dictionary, 'story.');

  it('copies every value verbatim', () => {
    for (const [key, value] of entries) expect(value, key).toBe(table.get(key)![column]);
  });

  it('has every story key of CONTENT.md except the shared resources link', () => {
    const expected = [...table.keys()].filter((key) => key !== 'story.resources_link').sort();
    expect(entries.map(([key]) => key).sort()).toEqual(expected);
  });
});
