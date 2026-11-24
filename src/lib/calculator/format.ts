// How the calculator writes its result (FR-034; Gaby's rules, brief section 4.3).
import type { Language } from '../../i18n';
import { CURRENCY_SYMBOL } from './currency';
import { groupThousands, wholeDigits } from './amounts';
import type { CalculatorDictionary, Currency } from './types';

/** "4.5" from the formula → "4,5" in Spanish, "4.5" in English; a whole value has no decimal. */
export function localizeMonths(shown: string, lang: Language): string {
  return lang === 'en' ? shown : shown.replace('.', ',');
}

/** "mes" when the shown value is exactly 1, "meses" otherwise (`calc.result.unit.*`). */
export function monthsUnit(shown: string, unit: CalculatorDictionary['result']['unit']): string {
  return shown === '1' ? unit.one : unit.many;
}

/** "$4.500" or "₡1.250.000" (es), "$4,500" (en): the symbol, then the whole amount with its separators. */
export function formatMoney(amount: number, currency: Currency, lang: Language): string {
  return `${CURRENCY_SYMBOL[currency]}${groupThousands(wholeDigits(amount), lang)}`;
}
