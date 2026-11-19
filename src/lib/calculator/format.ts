import type { Language } from '../../i18n';

/** "4,4" in Spanish, "4.4" in English: always one decimal, no upper limit. */
export function formatMonths(months: number, lang: Language): string {
  // No thousands separator: it varies by locale and ICU version, and the decimal mark is what matters.
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-CR', {
    useGrouping: false,
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(months);
}

/** Fills `{months}` of `calc.result.months`. */
export function monthsText(template: string, months: number, lang: Language): string {
  return template.replace('{months}', formatMonths(months, lang));
}
