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
  screening: {
    prompt:
      "If this program fits what you're looking for, how willing are you to invest in improving your financial health?",
    options: [
      { code: 'ready_to_invest', label: 'I want to invest if the program is right for me.' },
      {
        code: 'needs_investment_info',
        label: 'I am willing, but I need to understand the investment first.',
      },
      {
        code: 'no_capacity_now',
        label: 'I am interested, but I do not currently have the capacity to invest.',
      },
      { code: 'exploring', label: 'I am only exploring for now.' },
    ],
  },
  consent: {
    text: 'I agree to the processing of my personal data as described in the {privacy_notice_link}.',
    linkLabel: 'Privacy Notice',
  },
  privacyNotice: {
    title: 'Privacy Notice',
    draftLabel: 'Draft — pending legal review',
    closeLabel: 'Close',
    paragraphs: [
      'Responsible party: Gabriela Kelly. Contact: {contact_email} (to be confirmed).',
      'Data we collect: full name, email, phone, your pre-screening answer, the language you viewed the page in, and the date and time of your submission.',
      'Purpose: to contact you about the initial call and the program, and to prioritize calls. We do not use it for any other purpose and do not sell it.',
      'Who we share it with: Google (Google Sheets storage) and Calendly (scheduling the call), which may store data outside Costa Rica.',
      'Voluntary nature: providing your data is optional. Without it, we cannot process the form or schedule your call from this page.',
      'Your rights: you can request access, rectification, cancellation (deletion), or opposition to the processing of your data by emailing {contact_email}.',
      'Retention period: to be defined; this will be updated once legal review is complete.',
      'Each submission is associated with the version of this notice in effect at the time you submitted it.',
    ],
  },
  submit: {
    idle: 'Send and book my call',
    submitting: 'Sending…',
  },
  thankYou: {
    title: 'Thank you for your information!',
    text: "We may reach out by email or WhatsApp. If you'd like, you can book your initial call now:",
  },
  calendlyFallback:
    "We couldn't load the calendar. Email us at {contact_email} and we'll arrange your call.",
  fieldErrors: {
    required: 'This field is required.',
    too_short: 'This is too short.',
    too_long: 'This is too long.',
    invalid_characters: 'Use only letters, spaces, apostrophes, hyphens, or periods.',
    full_name_required: 'Please enter your full name: first name and at least one last name.',
    invalid_format_email: 'Enter a valid email, for example name@domain.com.',
    invalid_format_phone: 'Enter the number with country code, for example +50684104791.',
    invalid_option: 'Please select an option.',
    consent_required: 'We need your consent to save your information.',
  },
  submissionError:
    "We couldn't save your information. Please try again in a few minutes. If the problem continues, email us at {contact_email}.",
};
