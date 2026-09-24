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
    headline: 'Ganas bien, pero tu dinero no te está dando tranquilidad.',
    supportingLine:
      'No siempre se trata de generar más. A veces, el siguiente paso es ordenar mejor lo que ya tienes.',
    cta: 'Quiero dar el primer paso',
  },
  recognition: {
    paragraphs: [
      'Tener buenos ingresos no garantiza sentir claridad con el dinero. Cuando no existe una estructura clara, es fácil trabajar cada vez más sin sentir que realmente avanzas.',
      'La buena noticia es que no necesitas convertirte en una persona experta en finanzas de la noche a la mañana. Puedes empezar por ordenar, entender y tomar mejores decisiones paso a paso.',
    ],
  },
  roadmap: {
    steps: [
      { title: 'Ordena', description: 'entiende con claridad dónde estás hoy.' },
      { title: 'Decide', description: 'prioriza mejor cómo usar tus recursos.' },
      {
        title: 'Construye',
        description:
          'empieza a crear una estructura en la que tu dinero también pueda trabajar a favor de tus objetivos.',
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
    label: 'Pendiente de validación',
  },
};
