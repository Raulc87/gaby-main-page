// US-041 AC1, AC2: every Spanish string the site shows uses voseo, and the old
// programme name ("Mentoría VIP") appears in neither language. The list of "tú"
// forms is the check list of the phase 2d copy (CONTENT.md, voseo rule FR-043).
import { describe, expect, it } from 'vitest';
import { RESOURCES } from '../../../src/data/resources';

const spanishModules = import.meta.glob('../../../src/i18n/es/*.ts', { eager: true });
const englishModules = import.meta.glob('../../../src/i18n/en/*.ts', { eager: true });

/** Every string value of an exported dictionary, with the dotted path to it. */
function strings(value: unknown, path = ''): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => strings(child, path ? `${path}.${key}` : key));
  }
  return [];
}

function allStrings(modules: Record<string, unknown>): Array<[string, string]> {
  return Object.entries(modules).flatMap(([file, module]) => strings(module, file.split('/').pop()));
}

const TU_FORMS = [
  // pronouns
  'tú', 'ti', 'contigo', 'usted', 'ustedes',
  // present
  'quieres', 'tienes', 'puedes', 'sabes', 'sientes', 'eres', 'gastas', 'inviertes', 'decides',
  'aprendes', 'entiendes', 'conviertes', 'ordenas', 'inflas', 'construyes', 'vives', 'buscas',
  'necesitas', 'prefieres', 'descubres', 'recibes', 'deseas', 'usas', 'escribes', 'calificas', 'aceptas',
  // subjunctive
  'trabajes', 'incluyas',
  // imperative, as phrases (a bare imperative is also the third person)
  'aplica a', 'calcula tus', 'calcúlalo', 'define tu', 'descubre cuánto', 'descubre qué',
  'escribe tu', 'escribe un', 'escribe el', 'escribe 0', 'escríbenos', 'inténtalo', 'déjanos',
  'lee mi', 'llena la', 'llena una', 'mira el', 'ordena tu', 'convierte los', 'invierte y',
  'usa la', 'usa solo', 'incluye el', 'selecciona una', 'conoce la', 'imagina saber',
  'espera unos', 'trabaja directamente', 'organiza tus', 'reparte tu', 'agenda tu', 'empieza gratis',
  // perfect, as a phrase
  'has construido',
];

/** Whole word, case-insensitive, accent-sensitive; accented letters count as letters. */
function tuFormPattern(form: string): RegExp {
  return new RegExp(`(?<!\\p{L})${form}(?!\\p{L})`, 'iu');
}

describe('voseo (US-041 AC1)', () => {
  const spanish = allStrings(spanishModules);

  it('reads the Spanish dictionaries', () => {
    expect(spanish.length).toBeGreaterThan(200);
  });

  it('matches whole words, case-insensitively and accent-sensitively', () => {
    expect(tuFormPattern('puedes').test('Si puedes, hacelo')).toBe(true);
    expect(tuFormPattern('puedes').test('Podés hacerlo')).toBe(false);
    expect(tuFormPattern('aplica a').test('Aplica a Wealth Mastery')).toBe(true);
    expect(tuFormPattern('aplica a').test('Aplicá a Wealth Mastery')).toBe(false);
    expect(tuFormPattern('ti').test('Un título')).toBe(false);
    expect(tuFormPattern('ti').test('Es para ti.')).toBe(true);
  });

  it.each(TU_FORMS)('has no Spanish string with the "tú" form "%s"', (form) => {
    const pattern = tuFormPattern(form);
    const offenders = spanish.filter(([, value]) => pattern.test(value)).map(([path]) => path);
    expect(offenders).toEqual([]);
  });

  it('has no "tú" form in the Spanish resource data', () => {
    const descriptions = RESOURCES.flatMap((resource) => [resource.title.es, resource.description.es]);
    for (const form of TU_FORMS) {
      const pattern = tuFormPattern(form);
      expect(descriptions.filter((value) => pattern.test(value)), form).toEqual([]);
    }
  });
});

describe('the programme name (US-041 AC2)', () => {
  const everything = [
    ...allStrings(spanishModules),
    ...allStrings(englishModules),
    ...RESOURCES.flatMap((resource) => [
      resource.title.es,
      resource.title.en,
      resource.description.es,
      resource.description.en,
    ]),
  ];

  it.each(['Mentoría VIP', 'VIP Mentorship'])('does not show "%s"', (name) => {
    const offenders = everything.filter(([, value]) => value.includes(name)).map(([path]) => path);
    expect(offenders).toEqual([]);
  });
});
