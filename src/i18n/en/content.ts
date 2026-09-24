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
    headline: "You earn well, but your money isn't giving you peace of mind.",
    supportingLine:
      "It's not always about earning more. Sometimes the next step is to better organize what you already have.",
    cta: 'I want to take the first step',
  },
  recognition: {
    paragraphs: [
      "A good income doesn't guarantee clarity with money. Without a clear structure, it's easy to keep working harder without feeling that you're really moving forward.",
      "The good news is that you don't need to become a finance expert overnight. You can start by organizing, understanding, and making better decisions step by step.",
    ],
  },
  roadmap: {
    steps: [
      { title: 'Organize', description: 'understand clearly where you are today.' },
      { title: 'Decide', description: 'prioritize how to use your resources.' },
      {
        title: 'Build',
        description: 'start creating a structure where your money can also work toward your goals.',
      },
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
