import type { ContentDictionary } from '../index';

// Skeleton dictionary (Phase 0 scaffold). Approved copy from
// docs/ux/UX_UI_DIRECTION.md is filled in by GK-001-hero, GK-002-roadmap,
// and GK-003-guide-section.
export const content: ContentDictionary = {
  meta: {
    title: 'Gabriela Kelly — Salud financiera',
  },
  header: {
    languageToggleLabel: 'Cambiar idioma',
  },
  hero: {
    headline: 'TODO: hero headline (GK-001-hero)',
    supportingLine: 'TODO: hero supporting line (GK-001-hero)',
    cta: 'TODO: hero CTA (GK-001-hero)',
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
    paragraphs: [
      'No necesitas recorrer este proceso a solas.',
      'Gabriela acompaña a personas que quieren construir una relación más clara y estratégica con sus finanzas, empezando por el orden y avanzando hacia decisiones de inversión más conscientes.',
    ],
    photoPlaceholder: 'Foto de Gabriela',
    bioPlaceholder: 'Biografía breve',
    credentialsPlaceholder: 'Credenciales y experiencia',
  },
  proof: {
    heading: 'Respaldo y confianza',
    testimonialPlaceholder: 'Testimonio de una clienta o cliente',
    credibilityPlaceholder: 'Declaración de credibilidad',
  },
  offer: {
    paragraph:
      'En una llamada inicial revisaremos tu situación a un nivel general, conversaremos sobre lo que buscas y veremos si el programa tiene sentido para ti.',
  },
  closing: {
    paragraph:
      'Si esto resuena contigo, puedes dar el primer paso con calma. Déjanos tus datos y agenda una conversación para entender si este proceso encaja contigo.',
  },
  pendingBadge: {
    label: 'Pendiente de validación',
  },
};
