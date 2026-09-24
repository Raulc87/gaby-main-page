import { describe, expect, it } from 'vitest';
import { splitTemplate } from '../../../src/lib/lead/format';

describe('splitTemplate', () => {
  it('splits text around the placeholder', () => {
    expect(splitTemplate('Email us at {contact_email} for help.', 'contact_email')).toEqual({
      before: 'Email us at ',
      after: ' for help.',
    });
  });

  it('returns the whole text as "before" when the placeholder is absent', () => {
    expect(splitTemplate('No placeholder here.', 'contact_email')).toEqual({
      before: 'No placeholder here.',
      after: '',
    });
  });
});
