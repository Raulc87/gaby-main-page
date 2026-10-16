// Free resource list (CONTENT.md section 7.3, US-024 AC3): the single typed source
// for the library, the VIP not-ready screen and the Home teaser. `id` is the
// stable identifier. `file` is filled per language only when the real file
// exists in public/resources/ (none yet): a resource without a file shows the
// pending state and no link (US-024 AC4, BR-011).
import type { Language } from '../i18n';

export const RESOURCE_TYPES = ['minicourse', 'guide', 'template', 'checklist', 'class'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const RESOURCE_TOPICS = ['debt', 'wallets', 'investing', 'mindset'] as const;
export type ResourceTopic = (typeof RESOURCE_TOPICS)[number];

export type ResourceAccess = 'download' | 'email';

export interface Resource {
  id: string;
  type: ResourceType;
  topic: ResourceTopic;
  access: ResourceAccess;
  /** 1-3 for the resources the Home teaser shows, in order; absent otherwise. */
  homeOrder?: 1 | 2 | 3;
  title: Record<Language, string>;
  description: Record<Language, string>;
  /** Path inside public/resources/ per language; absent until the file is delivered. */
  file?: Partial<Record<Language, string>>;
}

export const RESOURCES: readonly Resource[] = [
  {
    id: 'minicourse-debt',
    type: 'minicourse',
    topic: 'debt',
    access: 'email',
    homeOrder: 1,
    title: { es: 'Cómo salir de deudas', en: 'How to get out of debt' },
    description: {
      es: 'Un minicurso para salir de deudas paso a paso.',
      en: 'A mini-course to get out of debt step by step.',
    },
  },
  {
    id: 'guide-wallets',
    type: 'guide',
    topic: 'wallets',
    access: 'email',
    homeOrder: 2,
    title: { es: 'Sistema de Billeteras', en: 'The Wallet System' },
    description: {
      es: 'Cada ingreso y cada beneficio con un propósito.',
      en: 'Every income and every benefit with a purpose.',
    },
  },
  {
    id: 'guide-corporate-benefits',
    type: 'guide',
    topic: 'investing',
    access: 'download',
    homeOrder: 3,
    title: {
      es: 'Cómo aprovechar tus beneficios corporativos',
      en: 'How to make the most of your corporate benefits',
    },
    description: {
      es: 'Convierte los beneficios de tu carrera en capital para invertir.',
      en: "Turn your career's benefits into capital to invest.",
    },
  },
  {
    id: 'template-debt',
    type: 'template',
    topic: 'debt',
    access: 'download',
    title: { es: 'Plantilla para salir de deudas', en: 'Debt payoff template' },
    description: {
      es: 'Organiza tus deudas y define el orden para pagarlas.',
      en: 'Organize your debts and decide the order to pay them.',
    },
  },
  {
    id: 'checklist-investing',
    type: 'checklist',
    topic: 'investing',
    access: 'download',
    title: { es: 'Checklist para empezar a invertir', en: 'Checklist to start investing' },
    description: {
      es: 'Lo que conviene tener claro antes de tu primera inversión.',
      en: 'What to be clear about before your first investment.',
    },
  },
  {
    id: 'class-mindset',
    type: 'class',
    topic: 'mindset',
    access: 'email',
    title: { es: 'Clase: tu relación con el dinero', en: 'Class: your relationship with money' },
    description: {
      es: 'Una clase grabada sobre mentalidad y dinero.',
      en: 'A recorded class on mindset and money.',
    },
  },
  {
    id: 'guide-investing',
    type: 'guide',
    topic: 'investing',
    access: 'email',
    title: { es: 'Guía para invertir desde tu salario', en: 'Guide to investing from your salary' },
    description: {
      es: 'Primeros pasos para que tu salario trabaje para ti.',
      en: 'First steps so your salary works for you.',
    },
  },
  {
    id: 'template-budget',
    type: 'template',
    topic: 'wallets',
    access: 'download',
    title: { es: 'Plantilla de presupuesto por billeteras', en: 'Wallet budget template' },
    description: {
      es: 'Reparte tu ingreso en billeteras con propósito.',
      en: 'Split your income into wallets with a purpose.',
    },
  },
];

/** The featured mini-course (CONTENT.md section 7.1) and the one the VIP not-ready screen offers. */
export const FEATURED_RESOURCE_ID = 'minicourse-debt';

export function getResource(id: string): Resource {
  const resource = RESOURCES.find((candidate) => candidate.id === id);
  if (!resource) throw new Error(`Unknown resource: ${id}`);
  return resource;
}

/** The delivered file for a language, or undefined while the resource is pending. */
export function resourceFile(resource: Resource, lang: Language): string | undefined {
  return resource.file?.[lang];
}

export function isResourcePending(resource: Resource, lang: Language): boolean {
  return resourceFile(resource, lang) === undefined;
}
