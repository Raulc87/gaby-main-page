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
    paragraphs: ['TODO: guide copy (GK-003-guide-section)'],
  },
  proof: {
    heading: 'TODO: proof heading (GK-003-guide-section)',
  },
  offer: {
    paragraph: 'TODO: offer copy (GK-003-guide-section)',
  },
  closing: {
    paragraph: 'TODO: closing CTA copy (GK-003-guide-section)',
  },
  pendingBadge: {
    label: 'Pending validation',
  },
};
