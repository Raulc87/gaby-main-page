// CONTENT.md is the only source of visitor-facing copy: the form, VIP page and
// resource dictionaries equal its tables verbatim, by key, in both languages
// (US-023 AC2, US-024). The privacy notice text is checked with GK-020-privacy-page.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { common as enCommon } from '../../../src/i18n/en/common';
import { form as enForm } from '../../../src/i18n/en/form';
import { resources as enResources } from '../../../src/i18n/en/resources';
import { vip as enVip } from '../../../src/i18n/en/vip';
import { common as esCommon } from '../../../src/i18n/es/common';
import { form as esForm } from '../../../src/i18n/es/form';
import { resources as esResources } from '../../../src/i18n/es/resources';
import { vip as esVip } from '../../../src/i18n/es/vip';
import type { FormDictionary, ResourcesDictionary, VipDictionary } from '../../../src/lib/lead/types';

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

/** CONTENT.md key -> value, for the form dictionary (the privacy notice is out of scope here). */
function formEntries(form: FormDictionary): Array<[string, string]> {
  const option = (code: string) => form.screening.options.find((o) => o.code === code)!.label;
  return [
    ['form.title', form.formTitle],
    ['form.name.label', form.name.label],
    ['form.name.hint', form.name.hint],
    ['form.email.label', form.email.label],
    ['form.phone.label', form.phone.label],
    ['form.phone.hint', form.phone.hint],
    ['form.screening.prompt', form.screening.prompt],
    ['form.screening.ready_to_invest', option('ready_to_invest')],
    ['form.screening.needs_investment_info', option('needs_investment_info')],
    ['form.screening.no_capacity_now', option('no_capacity_now')],
    ['form.screening.exploring', option('exploring')],
    ['form.submit', form.submit.idle],
    ['form.submitting', form.submit.submitting],
    ['form.trust', form.trust],
    ['form.error.required', form.fieldErrors.required],
    ['form.error.too_short', form.fieldErrors.too_short],
    ['form.error.too_long', form.fieldErrors.too_long],
    ['form.error.invalid_characters', form.fieldErrors.invalid_characters],
    ['form.error.full_name_required', form.fieldErrors.full_name_required],
    ['form.error.invalid_format.email', form.fieldErrors.invalid_format_email],
    ['form.error.invalid_format.phone', form.fieldErrors.invalid_format_phone],
    ['form.error.invalid_option', form.fieldErrors.invalid_option],
    ['form.error.consent_required', form.fieldErrors.consent_required],
    ['form.error.submission', form.submissionError],
    ['form.error.rate_limited', form.rateLimited],
    ['thanks.qualified.title', form.thankYou.title],
    ['thanks.qualified.body', form.thankYou.text],
    ['thanks.calendly_fallback', form.calendlyFallback],
    ['thanks.not_ready.title', form.notReady.title],
    ['thanks.not_ready.body', form.notReady.text],
  ];
}

function vipEntries(vip: VipDictionary): Array<[string, string]> {
  return [
    ['vip.eyebrow', vip.eyebrow],
    ['vip.title', vip.title],
    ['vip.steps.1', vip.steps[0]],
    ['vip.steps.2', vip.steps[1]],
    ['vip.steps.3', vip.steps[2]],
    ['vip.video.title', vip.video.title],
    ['vip.video.placeholder', vip.video.placeholder],
  ];
}

describe.each([
  ['es', esForm, esVip, esResources, esCommon, 0],
  ['en', enForm, enVip, enResources, enCommon, 1],
] as const)('Agent 2 dictionaries (%s)', (_lang, form, vip, resources, common, column) => {
  const entries: Array<[string, string]> = [
    ...formEntries(form),
    ...vipEntries(vip),
    ...flatten(resources),
  ];

  it('copies every value verbatim from CONTENT.md', () => {
    for (const [key, value] of entries) {
      expect(table.has(key), `${key} is in CONTENT.md`).toBe(true);
      expect(value, key).toBe(table.get(key)![column]);
    }
  });

  it('shows the VIP lead from the shared vip_band.body (vip.lead)', () => {
    expect(common.vip_band.body).toBe(table.get('vip_band.body')![column]);
  });

  it('carries the submit label decided by the human owner', () => {
    expect(form.submit.idle).toBe(column === 0 ? 'Enviar mi aplicación' : 'Submit my application');
  });

  it('gives every card label the form of its key', () => {
    expect(resources.resource.cover_alt).toContain('{title}');
  });
});

describe('Agent 2 dictionaries', () => {
  it('have the same keys in both languages', () => {
    expect(formEntries(esForm).map(([key]) => key)).toEqual(formEntries(enForm).map(([key]) => key));
    expect(flatten(esResources).map(([key]) => key)).toEqual(flatten(enResources).map(([key]) => key));
    expect(vipEntries(esVip).map(([key]) => key)).toEqual(vipEntries(enVip).map(([key]) => key));
  });

  it('every resource-dictionary key is a CONTENT.md key', () => {
    for (const [key] of flatten(esResources as ResourcesDictionary)) {
      expect(table.has(key), key).toBe(true);
    }
  });
});
