// CONTENT.md section 11 is the only source of the calculator's copy: the dictionaries
// equal its tables verbatim, by key, in both languages (US-044 AC2).
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
  const { figures, result } = c;
  const zoneEntries = Object.entries(result.zones).flatMap(([code, zone]): Array<[string, string]> => [
    [`calc.zone.${code}.label`, zone.label],
    [`calc.zone.${code}.title`, zone.title],
    [`calc.zone.${code}.body`, zone.body],
  ]);
  return [
    ['calc.eyebrow', c.eyebrow],
    ['calc.title', c.title],
    ['calc.lead', c.lead],
    ['calc.figures.title', figures.title],
    ['calc.currency.label', figures.currency.label],
    ['calc.currency.usd', figures.currency.usd],
    ['calc.currency.crc', figures.currency.crc],
    ['calc.example_note', figures.exampleNote],
    ['calc.expenses.label', figures.expenses.label],
    ['calc.expenses.hint', figures.expenses.hint],
    ['calc.savings.label', figures.savings.label],
    ['calc.investments.label', figures.investments.label],
    ['calc.investments.hint', figures.investments.hint],
    ['calc.solidarity.label', figures.solidarity.label],
    ['calc.solidarity.hint', figures.solidarity.hint],
    ['calc.passive.label', figures.passive.label],
    ['calc.passive.hint', figures.passive.hint],
    ['calc.shares.label', figures.shares.label],
    ['calc.shares.placeholder', figures.shares.placeholder],
    ['calc.shares.none', figures.shares.options.none],
    ['calc.shares.under_20', figures.shares.options.under_20],
    ['calc.shares.from_20_to_50', figures.shares.options.from_20_to_50],
    ['calc.shares.over_50', figures.shares.options.over_50],
    ['calc.error.expenses', c.errors.expenses],
    ['calc.error.shares', c.errors.shares],
    ['calc.error.number', c.errors.number],
    ['calc.next', c.next],
    ['calc.capture.title', c.capture.title],
    ['calc.capture.body', c.capture.body],
    ['calc.capture.body_with_guide', c.capture.bodyWithGuide],
    ['calc.capture.phone.label', c.capture.phoneLabel],
    ['calc.capture.consent', c.capture.consent.text.replace('{privacy_notice_link}', `[${c.capture.consent.linkLabel}]`)],
    ['calc.capture.marketing', c.capture.marketing],
    ['calc.capture.submit', c.capture.submit],
    ['calc.result.label', result.label],
    ['calc.result.unit.one', result.unit.one],
    ['calc.result.unit.many', result.unit.many],
    ...zoneEntries,
    ['calc.gauge.max', result.gaugeMax],
    ['calc.result.available', result.available],
    ['calc.result.gap', result.gap],
    ['calc.alert.lead', result.alert.lead],
    ['calc.alert.body', result.alert.body],
    ['calc.next_step.title', result.nextStep.title],
    ['calc.next_step.body', result.nextStep.body],
    ['calc.restart', result.restart],
    ['calc.result.email_note', result.emailNote],
    ['calc.result.disclaimer', result.disclaimer],
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

  it('covers every calc.* key of CONTENT.md except the alias of the apply button', () => {
    const covered = new Set(entries(dictionary).map(([key]) => key));
    const documented = [...table.keys()].filter((key) => key.startsWith('calc.'));
    const aliases = ['calc.result.cta'];
    expect(documented.filter((key) => !covered.has(key) && !aliases.includes(key))).toEqual([]);
  });
});

describe('alias of the result button', () => {
  it('calc.result.cta points at cta.vip_apply', () => {
    expect(table.get('calc.result.cta')).toEqual(['= `cta.vip_apply`', '= `cta.vip_apply`']);
    expect(esCommon.cta.vip_apply).toBeTruthy();
    expect(enCommon.cta.vip_apply).toBeTruthy();
  });
});
