// CONTENT.md section 11 is the only source of the calculator's copy: the dictionaries
// equal its tables verbatim, by key, in both languages (US-035 AC1).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { calculator as enCalculator } from '../../../src/i18n/en/calculator';
import { common as enCommon } from '../../../src/i18n/en/common';
import { calculator as esCalculator } from '../../../src/i18n/es/calculator';
import { common as esCommon } from '../../../src/i18n/es/common';
import type { CalculatorDictionary } from '../../../src/lib/calculator/types';

const content = readFileSync(join(__dirname, '..', '..', '..', 'docs/ux/CONTENT.md'), 'utf8');
const table = new Map<string, [string, string]>();
for (const line of content.split('\n')) {
  const row = line.match(/^\| `([a-z0-9_.]+)` \| (.*) \| (.*) \| (?:approved|provisional) \|$/);
  if (row) table.set(row[1], [row[2], row[3]]);
}

function entries(c: CalculatorDictionary): Array<[string, string]> {
  return [
    ['calc.eyebrow', c.eyebrow],
    ['calc.title', c.title],
    ['calc.lead', c.lead],
    ['calc.expenses.label', c.figures.expenses.label],
    ['calc.expenses.hint', c.figures.expenses.hint],
    ['calc.debt.label', c.figures.debt.label],
    ['calc.debt.hint', c.figures.debt.hint],
    ['calc.savings.label', c.figures.savings.label],
    ['calc.savings.hint', c.figures.savings.hint],
    ['calc.investments.label', c.figures.investments.label],
    ['calc.investments.hint', c.figures.investments.hint],
    ['calc.other_income.label', c.figures.other_income.label],
    ['calc.other_income.hint', c.figures.other_income.hint],
    ['calc.next', c.next],
    ['calc.error.number', c.errors.number],
    ['calc.error.no_outflow', c.errors.no_outflow],
    ['calc.capture.title', c.capture.title],
    ['calc.capture.body', c.capture.body],
    ['calc.capture.phone.label', c.capture.phoneLabel],
    ['calc.capture.consent', c.capture.consent.text.replace('{privacy_notice_link}', `[${c.capture.consent.linkLabel}]`)],
    ['calc.capture.marketing', c.capture.marketing],
    ['calc.capture.submit', c.capture.submit],
    ['calc.result.label', c.result.label],
    ['calc.result.months', c.result.months],
    ['calc.result.covered', c.result.covered],
    ['calc.zone.alert.title', c.zones.alert.title],
    ['calc.zone.alert.body', c.zones.alert.body],
    ['calc.zone.building.title', c.zones.building.title],
    ['calc.zone.building.body', c.zones.building.body],
    ['calc.zone.freedom.title', c.zones.freedom.title],
    ['calc.zone.freedom.body', c.zones.freedom.body],
    ['calc.result.email_note', c.result.emailNote],
    ['calc.result.disclaimer', c.result.disclaimer],
    ['calc.restart', c.result.restart],
  ];
}

describe.each([
  ['es', 0, esCalculator],
  ['en', 1, enCalculator],
] as const)('calculator copy (%s) equals CONTENT.md section 11', (_lang, column, dictionary) => {
  it.each(entries(dictionary))('%s', (key, value) => {
    const row = table.get(key);
    expect(row, `${key} is missing from CONTENT.md`).toBeDefined();
    expect(value).toBe(row![column]);
  });

  it('covers every calc.* key of CONTENT.md except the two aliases', () => {
    const covered = new Set(entries(dictionary).map(([key]) => key));
    const documented = [...table.keys()].filter((key) => key.startsWith('calc.'));
    const aliases = ['calc.result.cta', 'calc.result.secondary'];
    expect(documented.filter((key) => !covered.has(key) && !aliases.includes(key))).toEqual([]);
  });
});

describe('aliases of the result buttons', () => {
  it('calc.result.cta and calc.result.secondary point at cta.vip_apply and cta.all_resources', () => {
    expect(table.get('calc.result.cta')).toEqual(['= `cta.vip_apply`', '= `cta.vip_apply`']);
    expect(table.get('calc.result.secondary')).toEqual(['= `cta.all_resources`', '= `cta.all_resources`']);
    expect(esCommon.cta.vip_apply).toBeTruthy();
    expect(enCommon.cta.all_resources).toBeTruthy();
  });
});
