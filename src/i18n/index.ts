// Shared i18n constants and types (ADR-003, UX_UI_DIRECTION.md section 3).
// Browser-language detection and the ES|EN toggle are implemented in
// GK-010-i18n-toggle; this scaffold only defines the shared shape.

export const LANGUAGES = ['es', 'en'] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'es';

export const LANGUAGE_STORAGE_KEY = 'preferred_language';

/** Section anchor IDs, identical across languages (UX_UI_DIRECTION.md section 3). */
export const SECTION_IDS = {
  hero: 'hero',
  recognition: 'recognition',
  roadmap: 'roadmap',
  guide: 'guide',
  proof: 'proof',
  offer: 'offer',
  leadForm: 'lead-form',
  closing: 'closing',
} as const;

export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}

/**
 * Single flag controlling every "Pendiente de validación" / "Pending
 * validation" marker (US-009, UX_UI_DIRECTION.md section 5). Set to false
 * once stakeholder content is approved, to hide the markers for production.
 */
export const SHOW_PENDING_VALIDATION_BADGES = true;

// Shape shared by src/i18n/es/content.ts and src/i18n/en/content.ts.
// Copy is filled in progressively (GK-001-hero, GK-002-roadmap,
// GK-003-guide-section); this scaffold only fixes the structure so every
// section component can compile against typed dictionaries from the start.

export interface HeaderContent {
  languageToggleLabel: string;
}

export interface MetaContent {
  title: string;
}

export interface HeroContent {
  headline: string;
  supportingLine: string;
  cta: string;
}

export interface RecognitionContent {
  paragraphs: string[];
}

export interface RoadmapStep {
  title: string;
  description: string;
}

export interface RoadmapContent {
  steps: RoadmapStep[];
}

export interface GuideContent {
  paragraphs: string[];
  /** Captions for the photo/bio/credentials placeholder spaces (US-003 AC2). */
  photoPlaceholder: string;
  bioPlaceholder: string;
  credentialsPlaceholder: string;
}

export interface ProofContent {
  heading: string;
  /** Captions for the placeholder structure (US-003 AC2); never real testimonials. */
  testimonialPlaceholder: string;
  credibilityPlaceholder: string;
}

export interface OfferContent {
  paragraph: string;
}

export interface ClosingContent {
  paragraph: string;
}

export interface PendingBadgeContent {
  label: string;
}

export interface ContentDictionary {
  meta: MetaContent;
  header: HeaderContent;
  hero: HeroContent;
  recognition: RecognitionContent;
  roadmap: RoadmapContent;
  guide: GuideContent;
  proof: ProofContent;
  offer: OfferContent;
  closing: ClosingContent;
  pendingBadge: PendingBadgeContent;
}
