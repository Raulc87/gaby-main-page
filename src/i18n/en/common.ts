// Shared strings: header, footer, calls to action, VIP band, per-page metadata,
// preview marker and the pending badge label (docs/ux/CONTENT.md sections 1-4,
// 8.6 and 10). Copied verbatim by key; `*text*` marks the italic emphasis of a
// heading and is parsed at render time. Changing copy means changing CONTENT.md
// first. `nav.blog` is added with US-026.
import type { CommonContent } from '../index';

export const common: CommonContent = {
  meta: {
    site_name: 'Gaby Kelly',
    home: {
      title:
        'Gaby Kelly — From corporate life to your financial freedom',
      description:
        'Financial mentorship for executives and professionals at multinational companies: organize your money, make the most of your career\'s benefits and invest to build wealth.',
    },
    story: {
      title: 'My story — Gaby Kelly',
      description: 'From corporate life to my freedom: Gaby Kelly\'s story.',
    },
    resources: {
      title: 'Free resources — Gaby Kelly',
      description:
        'Free guides, templates and mini-courses to organize, invest and grow.',
    },
    vip: {
      title: 'VIP Mentorship · Wealth Mastery — Gaby Kelly',
      description:
        'Apply to work directly with Gaby and book your free initial call.',
    },
    privacy: {
      title: 'Privacy notice — Gaby Kelly',
      description:
        'How we handle your personal data under Costa Rica Law 8968.',
    },
  },
  nav: {
    brand: 'Gaby Kelly',
    story: 'My story',
    method: 'Polaris Method',
    resources: 'Free resources',
    vip: 'VIP Mentorship',
    menu_open: 'Open menu',
    menu_close: 'Close menu',
    label: 'Main navigation',
  },
  lang: {
    toggle_label: 'Change language',
  },
  skip_link: 'Skip to content',
  footer: {
    brand: 'Gaby Kelly',
    concept: 'From corporate life to your financial freedom.',
    disclaimer:
      'Gaby Kelly is an investor and mentor, not a financial advisor. The content is educational and does not constitute investment advice.',
    data_note: 'Your data is protected under Costa Rica Law 8968.',
    privacy_link: 'Privacy notice',
  },
  cta: {
    vip_long: 'Work directly with Gaby · VIP',
    vip_apply: 'Apply to the VIP Mentorship',
    start_free: 'Or start free with the resources',
    all_resources: 'See the full library',
    read_story: 'Read my full story',
  },
  vip_band: {
    eyebrow: 'VIP Mentorship · Wealth Mastery',
    title: 'Do you want to work *directly with me*?',
    body:
      'Imagine knowing exactly what you have, having your money work for you, and making career decisions from freedom, not necessity. And when you\'re with your family, truly being there. Fill in a short application and book your initial call.',
    short_title:
      'Would you prefer a plan made for you? *Work directly with Gaby.*',
  },
  preview: {
    badge: 'Preview',
    banner:
      'Preview of the site under construction. Forms do not send or save anything.',
    form_note: 'This is a demonstration: nothing was sent or saved.',
    scheduler: 'The calendar to book the call will appear here.',
  },
  pending: {
    badge: 'Pending validation',
  },
};
