// Shared fixtures and helpers for the Playwright suite (tests/e2e/**).
// Uses the same example values as LEAD_API_CONTRACT.md section 3 and
// tests/unit/lead/api.test.ts, so client, server, and e2e all agree on one
// canonical valid payload.
import type { Page } from '@playwright/test';
import type { Language } from '../../../src/i18n';

export const VALID_LEAD = {
  name: 'Ana María Pérez Soto',
  email: 'ana.perez@example.com',
  phone: '+50684104791',
  screeningCode: 'needs_investment_info',
} as const;

/**
 * Mirrors the fallback in src/lib/lead/config.ts and the placeholder in
 * .env.example. Hardcoded rather than imported: config.ts reads
 * `import.meta.env`, an Astro/Vite build-time global that Playwright's
 * plain Node test runner (unlike Vitest) does not provide, so importing it
 * here would throw.
 */
export const DEFAULT_CONTACT_EMAIL = 'gkelly@poliartcr.com';

export const SELECTORS = {
  nameInput: '#lead-name',
  nameError: '#lead-name-error',
  emailInput: '#lead-email',
  emailError: '#lead-email-error',
  phoneInput: '#lead-phone',
  phoneError: '#lead-phone-error',
  screeningError: '#lead-screening-error',
  consentCheckbox: '#lead-consent',
  consentError: '#lead-consent-error',
  submitButton: '#lead-submit',
  submissionError: '#lead-submission-error',
  formContainer: '#lead-form-container',
  successContainer: '#lead-success-container',
  calendlyContainer: '#calendly-container',
  calendlyWidget: '#calendly-widget',
  calendlyFallback: '#calendly-fallback',
} as const;

export function screeningOption(code: string): string {
  return `input[name="screening_answer"][value="${code}"]`;
}

interface FillOptions {
  name?: string;
  email?: string;
  phone?: string;
  screeningCode?: string;
  /** Defaults to true; pass false to leave the consent checkbox unchecked. */
  consent?: boolean;
}

/** Fills every lead-form field. Does not submit. */
export async function fillLeadForm(page: Page, overrides: FillOptions = {}): Promise<void> {
  const values = { ...VALID_LEAD, ...overrides };

  await page.locator(SELECTORS.nameInput).fill(values.name);
  await page.locator(SELECTORS.emailInput).fill(values.email);
  await page.locator(SELECTORS.phoneInput).fill(values.phone);
  await page.locator(screeningOption(values.screeningCode)).check();

  const consent = overrides.consent ?? true;
  if (consent) {
    await page.locator(SELECTORS.consentCheckbox).check();
  }
}

export async function gotoLang(page: Page, lang: Language, hash = ''): Promise<void> {
  await page.goto(`/${lang}/${hash}`);
}
