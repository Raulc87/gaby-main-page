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

// Shape shared by src/i18n/es/content.ts and src/i18n/en/content.ts.
// Copy is filled in progressively (GK-001-hero, GK-002-roadmap,
// GK-003-guide-section); this scaffold only fixes the structure so every
// section component can compile against typed dictionaries from the start.

export interface HeaderContent {
  languageToggleLabel: string;
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
}

export interface ProofContent {
  heading: string;
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
