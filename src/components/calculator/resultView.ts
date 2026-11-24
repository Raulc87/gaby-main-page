// Step 3 of the calculator (UX_UI_DIRECTION.md sections 5.6, 6.7, 6.8): writes the result into the
// markup CalculatorPage.astro renders: the months (or "∞"), the zone pill, the gauge, the zone's
// title and message, the two amounts and, when it applies, the concentration alert.
import type { Language } from '../../i18n';
import { formatMoney, localizeMonths, monthsUnit } from '../../lib/calculator/format';
import type { CalculatorResult } from '../../lib/calculator/formula';
import { gaugePosition } from '../../lib/calculator/gauge';
import type { CalculatorDictionary, Currency } from '../../lib/calculator/types';

/** What the page script needs from the dictionary to write a result. */
export interface ResultCopy {
  zones: CalculatorDictionary['result']['zones'];
  unit: CalculatorDictionary['result']['unit'];
}

export interface ResultToShow {
  result: CalculatorResult;
  currency: Currency;
  concentrationAlert: boolean;
}

/** Shown for the financially free result, which has no months (FR-034). */
export const INFINITY_SIGN = '∞';

export function renderResult(
  root: HTMLElement,
  copy: ResultCopy,
  language: Language,
  { result, currency, concentrationAlert }: ResultToShow,
): void {
  const set = (selector: string, text: string) => {
    const el = root.querySelector<HTMLElement>(selector);
    if (el) el.textContent = text;
  };
  const zone = copy.zones[result.zone];

  if (result.shown_months === null) {
    set('#calc-result-number', INFINITY_SIGN);
    set('#calc-result-unit', '');
  } else {
    set('#calc-result-number', localizeMonths(result.shown_months, language));
    set('#calc-result-unit', monthsUnit(result.shown_months, copy.unit));
  }

  root.querySelector('#calc-zone-pill')?.setAttribute('data-zone', result.zone);
  set('#calc-zone-label', zone.label);
  set('#calc-zone-title', zone.title);
  set('#calc-zone-body', zone.body);
  set('#calc-available-amount', formatMoney(result.available_money, currency, language));
  set('#calc-gap-amount', formatMoney(result.monthly_gap, currency, language));

  const marker = root.querySelector<HTMLElement>('#calc-gauge-marker');
  if (marker) marker.style.left = `${Number((gaugePosition(result.api_months) * 100).toFixed(2))}%`;

  const alert = root.querySelector<HTMLElement>('#calc-alert');
  if (alert) alert.hidden = !concentrationAlert;
}
