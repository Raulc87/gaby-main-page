// Route map (ADR-003 update, UX_UI_DIRECTION.md section 3): page id -> path per
// language, relative to the site root. Paths here never include the base path;
// build links with `pageHref` from src/lib/site/links.ts. The Blog (US-026) and
// Método Polaris (US-028) pages are phase 2b and are added with their stories.
import type { Language } from './index';

export const PAGE_IDS = ['home', 'story', 'resources', 'vip', 'privacy'] as const;

export type PageId = (typeof PAGE_IDS)[number];

export const ROUTES: Record<PageId, Record<Language, string>> = {
  home: { es: '/es/', en: '/en/' },
  story: { es: '/es/mi-historia/', en: '/en/my-story/' },
  resources: { es: '/es/recursos/', en: '/en/resources/' },
  vip: { es: '/es/mentoria-vip/', en: '/en/vip-mentorship/' },
  privacy: { es: '/es/privacidad/', en: '/en/privacy/' },
};

/** The path of a page in a language, without the base path. */
export function routePath(id: PageId, lang: Language): string {
  return ROUTES[id][lang];
}

/** Section anchors shared by both languages (UX_UI_DIRECTION.md section 3). */
export const ANCHORS = {
  home: {
    hero: 'hero',
    ladder: 'escalera',
    opportunity: 'oportunidad',
    method: 'metodo',
    resources: 'recursos',
    story: 'historia',
    testimonials: 'testimonios',
    vip: 'vip',
  },
  vip: { apply: 'aplicar' },
} as const;
