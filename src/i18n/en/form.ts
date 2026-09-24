// Lead form copy (EN). Owned by Implementation Agent 2 (see SPRINT_001.md
// file ownership map). Source: docs/ux/UX_UI_DIRECTION.md section 4
// (sections 7-8) and docs/specs/LEAD_API_CONTRACT.md section 8 (field error
// codes). Filled in progressively across GK-004-lead-form,
// GK-005-pre-screening, GK-011-privacy-consent, and GK-007-calendly.
import type { FormDictionary } from '../../lib/lead/types';

export const form: FormDictionary = {
  formTitle: 'Take the first step',
  name: {
    label: 'Full name',
    hint: 'Enter your first and last name.',
  },
  email: {
    label: 'Email',
  },
  phone: {
    label: 'Phone (WhatsApp)',
    hint: 'Include your country code. Example: +50684104791',
  },
  submit: {
    idle: 'Send and book my call',
    submitting: 'Sending…',
  },
  fieldErrors: {
    required: 'This field is required.',
    too_short: 'This is too short.',
    too_long: 'This is too long.',
    invalid_characters: 'Use only letters, spaces, apostrophes, hyphens, or periods.',
    full_name_required: 'Please enter your full name: first name and at least one last name.',
    invalid_format_email: 'Enter a valid email, for example name@domain.com.',
    invalid_format_phone: 'Enter the number with country code, for example +50684104791.',
  },
  submissionError:
    "We couldn't save your information. Please try again in a few minutes. If the problem continues, email us at {contact_email}.",
};
