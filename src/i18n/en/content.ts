import type { ContentDictionary } from '../index';

// Skeleton dictionary (Phase 0 scaffold). Approved copy from
// docs/ux/UX_UI_DIRECTION.md is filled in by GK-001-hero, GK-002-roadmap,
// and GK-003-guide-section.
export const content: ContentDictionary = {
  meta: {
    title: 'Gabriela Kelly — Financial Health',
  },
  header: {
    languageToggleLabel: 'Change language',
  },
  hero: {
    headline: 'TODO: hero headline (GK-001-hero)',
    supportingLine: 'TODO: hero supporting line (GK-001-hero)',
    cta: 'TODO: hero CTA (GK-001-hero)',
  },
  recognition: {
    paragraphs: ['TODO: recognition copy (GK-002-roadmap)'],
  },
  roadmap: {
    steps: [
      { title: 'TODO', description: 'TODO: roadmap step 1 (GK-002-roadmap)' },
      { title: 'TODO', description: 'TODO: roadmap step 2 (GK-002-roadmap)' },
      { title: 'TODO', description: 'TODO: roadmap step 3 (GK-002-roadmap)' },
    ],
  },
  guide: {
    paragraphs: [
      "You don't have to go through this process alone.",
      'Gabriela works with people who want to build a clearer, more strategic relationship with their finances, starting with order and moving toward more deliberate investment decisions.',
    ],
    photoPlaceholder: "Gabriela's photo",
    bioPlaceholder: 'Short bio',
    credentialsPlaceholder: 'Credentials and experience',
  },
  proof: {
    heading: 'Trust and credibility',
    testimonialPlaceholder: 'Client testimonial',
    credibilityPlaceholder: 'Credibility statement',
  },
  offer: {
    paragraph:
      "In an initial call, we'll review your situation at a general level, talk about what you're looking for, and see whether the program makes sense for you.",
  },
  closing: {
    paragraph:
      "If this resonates with you, you can take the first step at your own pace. Leave your details and book a conversation to see whether this process is a good fit for you.",
  },
  pendingBadge: {
    label: 'Pending validation',
  },
};
