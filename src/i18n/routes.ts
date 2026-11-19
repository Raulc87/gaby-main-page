// Route map (ADR-003 update, UX_UI_DIRECTION.md section 3): page id -> path per
// language, relative to the site root. Paths here never include the base path;
// build links with `pageHref` from src/lib/site/links.ts. The Blog (US-026) is
// phase 2b and is added with its story.
import type { Language } from './index';

export const PAGE_IDS = ['home', 'story', 'resources', 'vip', 'privacy', 'method', 'calculator'] as const;

export type PageId = (typeof PAGE_IDS)[number];

export const ROUTES: Record<PageId, Record<Language, string>> = {
  home: { es: '/es/', en: '/en/' },
  story: { es: '/es/mi-historia/', en: '/en/my-story/' },
  resources: { es: '/es/recursos/', en: '/en/resources/' },
  vip: { es: '/es/mentoria-vip/', en: '/en/vip-mentorship/' },
  privacy: { es: '/es/privacidad/', en: '/en/privacy/' },
  method: { es: '/es/metodo-polaris/', en: '/en/polaris-method/' },
  calculator: { es: '/es/calculadora/', en: '/en/calculator/' },
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
    stakes: 'en-juego',
    story: 'historia',
    opportunity: 'oportunidad',
    method: 'metodo',
    mastery: 'wealth-mastery',
    change: 'antes-despues',
    testimonials: 'testimonios',
    calculator: 'calculadora',
    vip: 'vip',
  },
  vip: { apply: 'aplicar' },
} as const;
