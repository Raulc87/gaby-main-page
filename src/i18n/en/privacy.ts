// Privacy notice (EN), docs/ux/CONTENT.md section 9, copied verbatim. DRAFT: requires
// legal review before public launch (US-018). The page and the consent dialog show
// the same text. The keys mirror CONTENT.md (`privacy.p1`, ...).
import type { PrivacyDictionary } from '../../lib/lead/types';

export const privacy: PrivacyDictionary = {
  privacy: {
    title: 'Privacy Notice',
    draft_label: 'Draft — pending legal review',
    close: 'Close',
    p1:
      'Responsible party: Gaby Kelly (Gabriela Kelly). Contact: {contact_email} (to be confirmed).',
    p2:
      'Data we collect: full name, email, phone (WhatsApp), your pre-screening answer, the language you viewed the site in, and the date and time of your submission.',
    p3:
      'Purpose: to contact you about the initial call and the VIP Mentorship, and to prioritize calls. We do not use it for any other purpose and do not sell it.',
    p4:
      'Who we share it with: Google (Google Sheets storage) and Calendly (scheduling the call), which may store data outside Costa Rica.',
    p5:
      'Voluntary nature: providing your data is optional. Without it, we cannot process your application or schedule your call from this site.',
    p6:
      'Your rights: you can request access, rectification, cancellation (deletion), or opposition to the processing of your data by emailing {contact_email}.',
    p7:
      'Retention period: to be defined; this will be updated once legal review is complete.',
    p8:
      'Each submission is associated with the version of this notice in effect at the time you submitted it.',
  },
};
