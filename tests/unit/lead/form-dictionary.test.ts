import { describe, expect, it } from 'vitest';
import { form as enForm } from '../../../src/i18n/en/form';
import { form as esForm } from '../../../src/i18n/es/form';

describe('form dictionaries', () => {
  it('expose the same top-level keys in both languages', () => {
    expect(Object.keys(esForm).sort()).toEqual(Object.keys(enForm).sort());
  });

  it('define the same field error codes in both languages', () => {
    expect(Object.keys(esForm.fieldErrors).sort()).toEqual(Object.keys(enForm.fieldErrors).sort());
  });

  it('carries the {contact_email} placeholder in the submission error message', () => {
    expect(esForm.submissionError).toContain('{contact_email}');
    expect(enForm.submissionError).toContain('{contact_email}');
  });
});
