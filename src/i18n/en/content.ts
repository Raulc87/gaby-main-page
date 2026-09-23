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
