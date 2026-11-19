// Shared fixtures and helpers for the calculator's e2e tests (US-035).
import type { Page } from '@playwright/test';
import type { Language } from '../../../src/i18n';
import { routePath } from '../../../src/i18n/routes';

/** Gap 1,000 a month, 4,400 available: 4.4 months, alert zone. */
export const ALERT_FIGURES = {
  expenses: '800',
  debt: '200',
  savings: '4400',
  investments: '0',
  other_income: '0',
} as const;

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
  months: '#calc-result-months',
  zonePill: '#calc-zone-pill',
  zoneTitle: '#calc-zone-title',
  zoneBody: '#calc-zone-body',
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

/** Fills the five figures and goes on to the details step. */
export async function answerQuestions(page: Page, figures: Record<string, string> = ALERT_FIGURES): Promise<void> {
  await fillFigures(page, figures);
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
