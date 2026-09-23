import { describe, expect, it } from 'vitest';
import { SECTION_IDS } from '../../../src/i18n';
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
});
