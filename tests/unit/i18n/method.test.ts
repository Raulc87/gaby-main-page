// CONTENT.md section 12 is the only source of the Método Polaris page copy: the
// dictionary equals its table verbatim, by key, in both languages (US-028 AC1). The
// aliased keys (`method.eyebrow`, `method.title`) point at the Home's keys.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getHome, getMethod } from '../../../src/i18n';

const content = readFileSync(join(__dirname, '..', '..', '..', 'docs/ux/CONTENT.md'), 'utf8');

const table = new Map<string, [string, string]>();
for (const line of content.split('\n')) {
  const row = line.match(/^\| `([a-z0-9_.]+)` \| (.*) \| (.*) \| (?:approved|provisional) \|$/);
  if (row) table.set(row[1], [row[2], row[3]]);
}

describe.each([
  ['es', 0],
  ['en', 1],
] as const)('Método Polaris page dictionary (%s)', (lang, column) => {
  const { method } = getMethod(lang);

  it('copies the lead and the placeholder verbatim from CONTENT.md', () => {
    expect(method.lead).toBe(table.get('method.lead')![column]);
    expect(method.steps.placeholder).toBe(table.get('method.steps.placeholder')![column]);
  });

  it('reads the eyebrow and the title from the Home keys they alias', () => {
    expect(table.get('method.eyebrow')![column]).toBe('= `home.method.eyebrow`');
    expect(table.get('method.title')![column]).toBe('= `home.method.title`');
    const { method: homeMethod } = getHome(lang).home;
    expect(homeMethod.eyebrow).toBe(table.get('home.method.eyebrow')![column]);
    expect(homeMethod.title).toBe(table.get('home.method.title')![column]);
    expect(Object.keys(method)).not.toContain('eyebrow');
    expect(Object.keys(method)).not.toContain('title');
  });
});

describe('Método Polaris page dictionaries', () => {
  it('have the same keys in both languages', () => {
    expect(Object.keys(getMethod('es').method)).toEqual(Object.keys(getMethod('en').method));
  });
});
