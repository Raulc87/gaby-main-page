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
  /** Trust row below the CTA (UX_UI_DIRECTION.md section 4, Section 1; US-015 AC8). */
  trustRow: string;
}

export interface RecognitionContent {
  paragraphs: string[];
}

export interface RoadmapStep {
  title: string;
  description: string;
}

export interface RoadmapContent {
  /** Step label prefix (e.g. "Paso" / "Step") for the gold-ink "PASO 1–3" markers (section 2.1). */
  stepLabel: string;
  steps: RoadmapStep[];
}

export interface GuideContent {
  paragraphs: string[];
  /** Captions for the photo/bio/credentials placeholder spaces (US-003 AC2). */
  photoPlaceholder: string;
  bioPlaceholder: string;
  credentialsPlaceholder: string;
}

export type TestimonialCardKind = 'text' | 'video';

/**
 * A testimonial card slot (US-017 AC3/AC4): text and video are the two
 * supported kinds. `placeholder` is the caption/summary shown until a real,
 * approved testimonial is supplied — for a video card this doubles as the
 * caption/summary required by AC4. Never a real testimonial (BR-003).
 */
export interface TestimonialCardContent {
  kind: TestimonialCardKind;
  placeholder: string;
}

export interface ProofContent {
  heading: string;
  /** Text and video testimonial card placeholders (US-017 AC3). */
  cards: TestimonialCardContent[];
  /** Caption for the credibility-statement placeholder (US-003 AC2). */
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
