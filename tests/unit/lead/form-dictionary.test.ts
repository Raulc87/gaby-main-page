import { describe, expect, it } from 'vitest';
import { form as enForm } from '../../../src/i18n/en/form';
import { form as esForm } from '../../../src/i18n/es/form';
import { SCREENING_ANSWER_CODES } from '../../../src/lib/lead/types';

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

  it('defines exactly the four contract screening_answer codes, in order, in both languages', () => {
    const esCodes = esForm.screening.options.map((option) => option.code);
    const enCodes = enForm.screening.options.map((option) => option.code);
    expect(esCodes).toEqual(SCREENING_ANSWER_CODES);
    expect(enCodes).toEqual(SCREENING_ANSWER_CODES);
  });

  it('carries the {privacy_notice_link} placeholder in the consent text', () => {
    expect(esForm.consent.text).toContain('{privacy_notice_link}');
    expect(enForm.consent.text).toContain('{privacy_notice_link}');
  });

  it('marks the privacy notice as a draft in both languages', () => {
    expect(esForm.privacyNotice.draftLabel.length).toBeGreaterThan(0);
    expect(enForm.privacyNotice.draftLabel.length).toBeGreaterThan(0);
  });

  it('defines the same number of privacy notice paragraphs in both languages', () => {
    expect(esForm.privacyNotice.paragraphs).toHaveLength(enForm.privacyNotice.paragraphs.length);
  });
});
