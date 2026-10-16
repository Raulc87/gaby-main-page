// Resource card labels and topic names (EN), docs/ux/CONTENT.md sections 7.1-7.2,
// copied verbatim. The keys mirror CONTENT.md (`resource.type.guide`,
// `resources.topic.debt`, ...), including the library page's own strings (section 7.1).
import type { ResourcesDictionary } from '../../lib/lead/types';

export const resources: ResourcesDictionary = {
  resource: {
    type: {
      minicourse: 'Mini-course',
      guide: 'Guide',
      template: 'Template',
      checklist: 'Checklist',
      class: 'Recorded class',
    },
    free: 'free',
    access: { download: 'Free download', email: 'By email' },
    cta: {
      download: 'Download for free',
      guide: 'Get the guide',
      class: 'Watch the class',
      minicourse: 'I want the mini-course',
    },
    pending: 'Coming soon',
    email: { coming_soon: 'Delivery by email will be available soon.' },
    cover_alt: 'Cover of {title}',
  },
  resources: {
    eyebrow: 'Free library',
    title: 'Tools to organize, *invest and grow.*',
    lead: 'Guides, templates and mini-courses you can use today. Some download directly; others arrive in your inbox.',
    filter: { label: 'Filter by topic', all: 'All' },
    topic: {
      debt: 'Getting out of debt',
      wallets: 'Wallets and budget',
      investing: 'Investing',
      mindset: 'Mindset and money',
    },
    featured: { label: 'Featured mini-course · free' },
    empty: 'There are no resources in this topic yet.',
  },
};
