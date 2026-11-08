// Language lookup for the calculator copy, as `getForm` does for the form.
import type { Language } from '../../i18n';
import { calculator as enCalculator } from '../../i18n/en/calculator';
import { calculator as esCalculator } from '../../i18n/es/calculator';
import type { CalculatorDictionary } from './types';

export function getCalculator(lang: Language): CalculatorDictionary {
  return lang === 'en' ? enCalculator : esCalculator;
}
