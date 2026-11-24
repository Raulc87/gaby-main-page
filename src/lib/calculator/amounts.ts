// How the calculator's money inputs read and show whole amounts (UX_UI_DIRECTION.md section 5.6):
// the visitor types digits, the field shows them with thousands separators (a point in Spanish,
// a comma in English), and the amount is the digits. No decimals: Gaby's prototype takes whole amounts.
import type { Language } from '../../i18n';

/** The digits of a field's text, leading zeros dropped (a single 0 stays). The field shows only whole, grouped amounts. */
export function digitsOf(raw: string): string {
  return raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
}

/**
 * The digits of text the visitor pasted or dropped into a field. A decimal part of one or two digits
 * at the end ("1234.56", "1.234,5") is cut off rather than glued on, so a pasted "1234.56" reads as
 * 1234, not 123456. Three digits after a mark are thousands ("1.234", "1,234"). Typing and deleting
 * use `digitsOf` instead: after a Backspace "4.500" is "4.50", which is 450, not a decimal.
 */
export function sanitizePastedAmount(raw: string): string {
  return digitsOf(raw.trim().replace(/[.,]\d{1,2}$/, ''));
}

/** The thousands separator of a language: a point in Spanish, a comma in English. */
export function thousandsSeparator(lang: Language): string {
  return lang === 'en' ? ',' : '.';
}

/** "4500" → "4.500" (es) or "4,500" (en). Takes digits, so a huge amount never loses precision. */
export function groupThousands(digits: string, lang: Language): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator(lang));
}

/** The digits of a whole non-negative amount, as a string (never in exponent form). */
export function wholeDigits(amount: number): string {
  return BigInt(Math.round(amount)).toString();
}
