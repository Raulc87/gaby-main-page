// Step 1 of the calculator (UX_UI_DIRECTION.md sections 5.6 and 6.10): the five money inputs, the
// currency switch and the company-shares select. Each input keeps what the visitor typed and the
// currency they typed it in (`typed`), and shows it converted for the chosen currency, so switching
// back and forth never drifts. The visitor's figures stay in the browser: `read` hands the form's
// values to the validation, and nothing here sends them anywhere.
import type { Language } from '../../i18n';
import { digitsOf, groupThousands, sanitizePastedAmount, wholeDigits } from '../../lib/calculator/amounts';
import {
  CURRENCY_SYMBOL,
  displayAmount,
  exampleAmounts,
  type TypedAmount,
} from '../../lib/calculator/currency';
import { FIGURE_KEYS, type Currency, type FigureKey } from '../../lib/calculator/types';

/** More digits than any accepted amount has (MAX_FIGURE has 14), so an absurd paste still reaches the "number" error. */
const MAX_TYPED_DIGITS = 15;

export interface FiguresPanel {
  /** The raw values of the five inputs, as shown, and the select's value ("" while unanswered). */
  read(): { figures: Record<FigureKey, string>; shares: string };
  currency(): Currency;
}

export interface FiguresPanelOptions {
  language: Language;
  crcPerUsd: number;
}

/** Puts the caret after the same number of digits as before the input was reformatted. */
function restoreCaret(input: HTMLInputElement, digitsBeforeCaret: number): void {
  let seen = 0;
  let position = 0;
  while (position < input.value.length && seen < digitsBeforeCaret) {
    if (/\d/.test(input.value[position])) seen += 1;
    position += 1;
  }
  input.setSelectionRange(position, position);
}

export function initFiguresPanel(root: HTMLElement, { language, crcPerUsd }: FiguresPanelOptions): FiguresPanel {
  const typed: Record<FigureKey, TypedAmount> = exampleAmounts();
  let currency: Currency = 'USD';

  const input = (key: FigureKey) => root.querySelector<HTMLInputElement>(`#calc-${key}`);
  const switchButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-currency]'));

  function render(): void {
    for (const key of FIGURE_KEYS) {
      const field = input(key);
      const amount = displayAmount(typed[key], currency, crcPerUsd);
      if (field) field.value = amount === null ? '' : groupThousands(wholeDigits(amount), language);
    }
    root.querySelectorAll<HTMLElement>('[data-currency-symbol]').forEach((el) => {
      el.textContent = CURRENCY_SYMBOL[currency];
    });
    for (const button of switchButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.currency === currency));
    }
  }

  for (const key of FIGURE_KEYS) {
    input(key)?.addEventListener('input', (event) => {
      const field = event.currentTarget as HTMLInputElement;
      const caret = field.selectionStart ?? field.value.length;
      const digitsBeforeCaret = field.value.slice(0, caret).replace(/\D/g, '').length;
      const pasted = event instanceof InputEvent && /^insertFrom(Paste|Drop)/.test(event.inputType);
      const digits = (pasted ? sanitizePastedAmount(field.value) : digitsOf(field.value)).slice(0, MAX_TYPED_DIGITS);
      typed[key] = digits === '' ? null : { value: Number(digits), currency };
      field.value = groupThousands(digits, language);
      restoreCaret(field, Math.min(digitsBeforeCaret, digits.length));
    });
  }

  for (const button of switchButtons) {
    button.addEventListener('click', () => {
      currency = button.dataset.currency === 'CRC' ? 'CRC' : 'USD';
      render();
    });
  }

  render();
  const shares = () => root.querySelector<HTMLSelectElement>('#calc-shares')?.value ?? '';
  return {
    read() {
      const figures = {} as Record<FigureKey, string>;
      for (const key of FIGURE_KEYS) figures[key] = input(key)?.value ?? '';
      return { figures, shares: shares() };
    },
    currency: () => currency,
  };
}
