// Shared fixtures and helpers for the calculator's e2e tests (US-035, US-044).
import type { Page } from '@playwright/test';
import type { Language } from '../../../src/i18n';
import { routePath } from '../../../src/i18n/routes';

/**
 * Gap 4,500 a month and 20,000 available, as in Gaby's example: 4.44 months, which the page shows as
 * 4.4 (and the API receives as 4.44, rounded down), in the alert zone.
 */
export const ALERT_FIGURES = {
  expenses: '4500',
  savings: '9000',
  investments: '6000',
  solidarity: '5000',
  passive: '0',
} as const;

/** The company-shares answers by option value (`SHARES_ANSWERS`). */
export type SharesOption = 'none' | 'under_20' | 'from_20_to_50' | 'over_50';

export const CALCULATOR_DETAILS = {
  name: 'Ana María Pérez Soto',
  email: 'ana.perez@example.com',
  phone: '',
} as const;

export const CALC = {
  questionsForm: '#calc-questions-form',
  detailsForm: '#calc-details-form',
  stepQuestions: '#calc-step-questions',
  stepDetails: '#calc-step-details',
  stepResult: '#calc-step-result',
  next: '#calc-next',
  submit: '#calc-submit',
  submissionError: '#calc-submission-error',
  shares: '#calc-shares',
  sharesError: '#calc-shares-error',
  number: '#calc-result-number',
  unit: '#calc-result-unit',
  zonePill: '#calc-zone-pill',
  zoneLabel: '#calc-zone-label',
  zoneTitle: '#calc-zone-title',
  zoneBody: '#calc-zone-body',
  available: '#calc-available-amount',
  gap: '#calc-gap-amount',
  alert: '#calc-alert',
  restart: '#calc-restart',
  consent: '#calc-consent',
  marketing: '#calc-marketing',
  honeypot: '#calc-hp',
} as const;

export const CALCULATOR_ENDPOINT_GLOB = '**/api/save-calculator-lead';

export async function gotoCalculator(page: Page, lang: Language): Promise<void> {
  await page.goto(routePath('calculator', lang));
}

/** Opens the calculator on another origin (the preview build served under its base path). */
export async function gotoCalculatorAt(page: Page, origin: string, lang: Language): Promise<void> {
  await page.goto(`${origin}${routePath('calculator', lang)}`);
}

export async function fillFigures(page: Page, figures: Record<string, string> = ALERT_FIGURES): Promise<void> {
  for (const [key, value] of Object.entries(figures)) {
    await page.locator(`#calc-${key}`).fill(value);
  }
}

/** Switches the currency (the buttons of UX section 6.10). */
export async function chooseCurrency(page: Page, currency: 'USD' | 'CRC'): Promise<void> {
  await page.locator(`[data-currency="${currency}"]`).click();
}

/** Fills the five figures, answers the company-shares question and goes on to the details step. */
export async function answerQuestions(
  page: Page,
  figures: Record<string, string> = ALERT_FIGURES,
  shares: SharesOption = 'from_20_to_50',
): Promise<void> {
  await fillFigures(page, figures);
  await page.locator(CALC.shares).selectOption(shares);
  await page.locator(CALC.next).click();
}

export async function fillDetails(
  page: Page,
  { marketing = false, consent = true }: { marketing?: boolean; consent?: boolean } = {},
): Promise<void> {
  await page.locator('#calc-name').fill(CALCULATOR_DETAILS.name);
  await page.locator('#calc-email').fill(CALCULATOR_DETAILS.email);
  if (consent) await page.locator(CALC.consent).check();
  if (marketing) await page.locator(CALC.marketing).check();
}

/** How many gold buttons are visible on the page right now (BR-010: at most one). */
export async function visibleGoldButtons(page: Page): Promise<number> {
  return page.evaluate(() => {
    return [...document.querySelectorAll<HTMLElement>('a, button')].filter((el) => {
      if (getComputedStyle(el).backgroundColor !== 'rgb(214, 176, 77)') return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }).length;
  });
}
