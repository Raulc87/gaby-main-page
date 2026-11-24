// Language lookup for the Wealth Mastery page copy, as `getCalculator` does for the calculator.
import type { Language } from '../../i18n';
import { mastery as enMastery } from '../../i18n/en/mastery';
import { mastery as esMastery } from '../../i18n/es/mastery';
import type { MasteryDictionary } from './types';

export function getMastery(lang: Language): MasteryDictionary {
  return lang === 'en' ? enMastery : esMastery;
}
