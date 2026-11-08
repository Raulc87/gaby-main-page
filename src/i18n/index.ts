// Shared i18n constants and types (ADR-003, UX_UI_DIRECTION.md section 3).
// Routes (page id -> path per language) are in ./routes.
// Browser-language detection and the ES|EN toggle are implemented in
// GK-010-i18n-toggle; this scaffold only defines the shared shape.

import { common as commonEs } from './es/common';
import { common as commonEn } from './en/common';
import { home as homeEs } from './es/home';
import { home as homeEn } from './en/home';

export const LANGUAGES = ['es', 'en'] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'es';

export const LANGUAGE_STORAGE_KEY = 'preferred_language';

/**
 * The application form's section id, used by src/components/lead (the Home
 * anchors are in ./routes ANCHORS).
 */
export const SECTION_IDS = {
  leadForm: 'lead-form',
} as const;

export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}

export interface DetectLanguageOptions {
  /** Value read from localStorage[LANGUAGE_STORAGE_KEY], if any. */
  storedPreference?: string | null;
  /** navigator.languages (or [navigator.language] as a fallback). */
  browserLanguages?: readonly string[];
}

/**
 * Resolves which language `/` should redirect to (ADR-003): the saved
 * toggle choice first, otherwise Spanish when the browser's first
 * preferred language starts with "es" (e.g. "es", "es-CR", "es-MX"),
 * otherwise English.
 */
export function detectLanguage({
  storedPreference,
  browserLanguages = [],
}: DetectLanguageOptions): Language {
  if (storedPreference && isLanguage(storedPreference)) {
    return storedPreference;
  }

  const primary = browserLanguages[0] ?? '';
  return primary.toLowerCase().startsWith('es') ? 'es' : 'en';
}

/** Per-page metadata (docs/ux/CONTENT.md section 1). */
export interface PageMeta {
  title: string;
  description: string;
}

/**
 * Shared strings (CONTENT.md sections 1-4, 8.6, 10), keyed exactly as in
 * CONTENT.md: `common.nav.menu_open` is the key `nav.menu_open`.
 */
export interface CommonContent {
  meta: {
    site_name: string;
    home: PageMeta;
    story: PageMeta;
    resources: PageMeta;
    vip: PageMeta;
    privacy: PageMeta;
    calculator: PageMeta;
    method: PageMeta;
  };
  nav: {
    brand: string;
    story: string;
    method: string;
    resources: string;
    vip: string;
    vip_short: string;
    menu_open: string;
    menu_close: string;
    label: string;
  };
  lang: { toggle_label: string };
  skip_link: string;
  footer: {
    brand: string;
    concept: string;
    disclaimer: string;
    data_note: string;
    privacy_link: string;
  };
  cta: {
    vip_long: string;
    vip_apply: string;
    start_free: string;
    all_resources: string;
    read_story: string;
  };
  vip_band: {
    eyebrow: string;
    title: string;
    body: string;
    short_title: string;
  };
  preview: {
    badge: string;
    banner: string;
    form_note: string;
    scheduler: string;
  };
  pending: { badge: string };
}

/** The shared strings of a language. */
export function getCommon(lang: Language): CommonContent {
  return lang === 'es' ? commonEs : commonEn;
}

/** Home copy (CONTENT.md section 5 and the testimonial placeholders), keyed as in CONTENT.md. */
export interface HomeDictionary {
  home: {
    hero: {
      eyebrow: string;
      title: string;
      lead: string;
      cta: string;
      secondary: string;
      trust: string;
      photo: {
        placeholder: string;
      };
      photo_alt: string;
    };
    ladder: {
      title: string;
      p1: string;
      p2: string;
      p3: string;
      closing: string;
    };
    stakes: {
      title: string;
      '1': {
        title: string;
        body: string;
      };
      '2': {
        title: string;
        body: string;
      };
      '3': {
        title: string;
        body: string;
      };
      closing: string;
      cta: string;
    };
    story: {
      eyebrow: string;
      title: string;
      p1: string;
      p2: string;
      stat: {
        '1': {
          value: string;
          label: string;
        };
        '2': {
          value: string;
          label: string;
        };
        '3': {
          value: string;
          label: string;
        };
      };
      portrait_alt: string;
    };
    opportunity: {
      eyebrow: string;
      title: string;
      lead: string;
      '1': {
        title: string;
        body: string;
      };
      '2': {
        title: string;
        body: string;
      };
      '3': {
        title: string;
        body: string;
      };
      '4': {
        title: string;
        body: string;
      };
      '5': {
        title: string;
        body: string;
      };
      '6': {
        title: string;
        body: string;
      };
    };
    method: {
      eyebrow: string;
      title: string;
      '1': {
        title: string;
        body: string;
      };
      '2': {
        title: string;
        body: string;
      };
      '3': {
        title: string;
        body: string;
      };
      cta: string;
    };
    mastery: {
      title: string;
      lead: string;
      '1': {
        title: string;
        body: string;
      };
      '2': {
        title: string;
        body: string;
      };
      '3': {
        title: string;
        body: string;
      };
      '4': {
        title: string;
        body: string;
      };
      '5': {
        title: string;
        body: string;
      };
      '6': {
        title: string;
        body: string;
      };
      '7': {
        title: string;
        body: string;
      };
    };
    change: {
      title: string;
      before: {
        label: string;
        '1': string;
        '2': string;
        '3': string;
        '4': string;
        '5': string;
      };
      after: {
        label: string;
        '1': string;
        '2': string;
        '3': string;
        '4': string;
        '5': string;
      };
    };
    testimonials: {
      title: string;
      cta: string;
    };
    calculator: {
      eyebrow: string;
      title: string;
      lead: string;
      receive: string;
      receive_with_guide: string;
      cta: string;
      example: {
        label: string;
        value: string;
        zone: string;
      };
      more: string;
    };
    vip: {
      body: string;
      step: {
        '1': {
          title: string;
          body: string;
        };
        '2': {
          title: string;
          body: string;
        };
        '3': {
          title: string;
          body: string;
        };
      };
    };
  };
  testimonial: {
    placeholder: {
      text: string;
      video: string;
      photo: string;
      attribution: string;
    };
  };
}

/** The Home copy of a language. */
export function getHome(lang: Language): HomeDictionary {
  return lang === 'es' ? homeEs : homeEn;
}
