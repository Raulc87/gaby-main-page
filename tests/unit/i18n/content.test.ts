import { describe, expect, it } from 'vitest';
import { SECTION_IDS, SHOW_PENDING_VALIDATION_BADGES } from '../../../src/i18n';
import { content as esContent } from '../../../src/i18n/es/content';
import { content as enContent } from '../../../src/i18n/en/content';

describe('content dictionaries', () => {
  it('expose the same top-level sections in both languages', () => {
    expect(Object.keys(esContent).sort()).toEqual(Object.keys(enContent).sort());
  });

  it('defines the anchor IDs shared across languages (UX_UI_DIRECTION.md section 3)', () => {
    expect(SECTION_IDS).toEqual({
      hero: 'hero',
      recognition: 'recognition',
      roadmap: 'roadmap',
      guide: 'guide',
      proof: 'proof',
      offer: 'offer',
      leadForm: 'lead-form',
      closing: 'closing',
    });
  });

  it('provides exactly three roadmap steps in both languages', () => {
    expect(esContent.roadmap.steps).toHaveLength(3);
    expect(enContent.roadmap.steps).toHaveLength(3);
  });

  it('uses the approved hero copy from UX_UI_DIRECTION.md section 4 (US-001)', () => {
    expect(esContent.hero).toEqual({
      headline: 'Ganas bien, pero tu dinero no te está dando tranquilidad.',
      supportingLine:
        'No siempre se trata de generar más. A veces, el siguiente paso es ordenar mejor lo que ya tienes.',
      cta: 'Quiero dar el primer paso',
    });
    expect(enContent.hero).toEqual({
      headline: "You earn well, but your money isn't giving you peace of mind.",
      supportingLine:
        "It's not always about earning more. Sometimes the next step is to better organize what you already have.",
      cta: 'I want to take the first step',
    });
  });

  it('uses the approved recognition and roadmap copy from UX_UI_DIRECTION.md section 4 (US-002)', () => {
    expect(esContent.recognition.paragraphs).toEqual([
      'Tener buenos ingresos no garantiza sentir claridad con el dinero. Cuando no existe una estructura clara, es fácil trabajar cada vez más sin sentir que realmente avanzas.',
      'La buena noticia es que no necesitas convertirte en una persona experta en finanzas de la noche a la mañana. Puedes empezar por ordenar, entender y tomar mejores decisiones paso a paso.',
    ]);
    expect(enContent.recognition.paragraphs).toEqual([
      "A good income doesn't guarantee clarity with money. Without a clear structure, it's easy to keep working harder without feeling that you're really moving forward.",
      "The good news is that you don't need to become a finance expert overnight. You can start by organizing, understanding, and making better decisions step by step.",
    ]);

    expect(esContent.roadmap.steps).toEqual([
      { title: 'Ordena', description: 'entiende con claridad dónde estás hoy.' },
      { title: 'Decide', description: 'prioriza mejor cómo usar tus recursos.' },
      {
        title: 'Construye',
        description:
          'empieza a crear una estructura en la que tu dinero también pueda trabajar a favor de tus objetivos.',
      },
    ]);
    expect(enContent.roadmap.steps).toEqual([
      { title: 'Organize', description: 'understand clearly where you are today.' },
      { title: 'Decide', description: 'prioritize how to use your resources.' },
      {
        title: 'Build',
        description: 'start creating a structure where your money can also work toward your goals.',
      },
    ]);
  });

  it('uses the approved guide, proof, offer, and closing copy from UX_UI_DIRECTION.md section 4 (US-003)', () => {
    expect(esContent.guide.paragraphs).toEqual([
      'No necesitas recorrer este proceso a solas.',
      'Gabriela acompaña a personas que quieren construir una relación más clara y estratégica con sus finanzas, empezando por el orden y avanzando hacia decisiones de inversión más conscientes.',
    ]);
    expect(enContent.guide.paragraphs).toEqual([
      "You don't have to go through this process alone.",
      'Gabriela works with people who want to build a clearer, more strategic relationship with their finances, starting with order and moving toward more deliberate investment decisions.',
    ]);

    expect(esContent.offer.paragraph).toBe(
      'En una llamada inicial revisaremos tu situación a un nivel general, conversaremos sobre lo que buscas y veremos si el programa tiene sentido para ti.',
    );
    expect(enContent.offer.paragraph).toBe(
      "In an initial call, we'll review your situation at a general level, talk about what you're looking for, and see whether the program makes sense for you.",
    );

    expect(esContent.closing.paragraph).toBe(
      'Si esto resuena contigo, puedes dar el primer paso con calma. Déjanos tus datos y agenda una conversación para entender si este proceso encaja contigo.',
    );
    expect(enContent.closing.paragraph).toBe(
      "If this resonates with you, you can take the first step at your own pace. Leave your details and book a conversation to see whether this process is a good fit for you.",
    );
  });

  it('never hard-codes the guide/proof placeholder captions outside the translation files (US-010 AC5)', () => {
    expect(esContent.guide.photoPlaceholder).not.toBe(enContent.guide.photoPlaceholder);
    expect(esContent.guide.bioPlaceholder).not.toBe(enContent.guide.bioPlaceholder);
    expect(esContent.guide.credentialsPlaceholder).not.toBe(enContent.guide.credentialsPlaceholder);
    expect(esContent.proof.testimonialPlaceholder).not.toBe(enContent.proof.testimonialPlaceholder);
    expect(esContent.proof.credibilityPlaceholder).not.toBe(enContent.proof.credibilityPlaceholder);
  });

  it('never invents a testimonial or a quantified outcome in the proof placeholders (BR-003, UX_UI_DIRECTION.md section 5)', () => {
    const forbidden = /\d|garantiz|guarantee/i;
    expect(esContent.proof.testimonialPlaceholder).not.toMatch(forbidden);
    expect(esContent.proof.credibilityPlaceholder).not.toMatch(forbidden);
    expect(enContent.proof.testimonialPlaceholder).not.toMatch(forbidden);
    expect(enContent.proof.credibilityPlaceholder).not.toMatch(forbidden);
  });

  it('exposes a single flag controlling every pending-validation badge (US-009)', () => {
    expect(typeof SHOW_PENDING_VALIDATION_BADGES).toBe('boolean');
  });
});
