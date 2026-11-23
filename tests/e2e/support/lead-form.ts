// Shared fixtures and helpers for the Playwright suite (tests/e2e/**).
// Uses the same example values as LEAD_API_CONTRACT.md section 3 and
// tests/unit/lead/api.test.ts, so client, server, and e2e all agree on one
// canonical valid payload.
import type { Page } from '@playwright/test';
import type { Language } from '../../../src/i18n';
import { routePath } from '../../../src/i18n/routes';

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
  honeypotInput: '#lead-hp',
  honeypotForm: '#lead-hp-form',
  submitButton: '#lead-submit',
  submissionError: '#lead-submission-error',
  formContainer: '#lead-form-container',
  leadForm: '#lead-form-form',
  successContainer: '#lead-success-container',
  schedulerContainer: '#scheduler-container',
  schedulerWidget: '#scheduler-widget',
  schedulerFallback: '#scheduler-fallback',
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

/** Opens the VIP page, where the application form lives (US-023). */
export async function gotoVip(page: Page, lang: Language, hash = ''): Promise<void> {
  await page.goto(`${routePath('vip', lang)}${hash}`);
}

/** The two GoHighLevel hosts of the embed (US-037): the booking widget and its resize script. */
export const GHL_HOSTS = ['api.leadconnectorhq.com', 'link.msgsndr.com'] as const;
/** A stand-in for Gaby's calendar URL, forced onto the container so the suite does not depend on the build's PUBLIC_SCHEDULER_URL. */
export const STUB_SCHEDULER_URL = 'https://api.leadconnectorhq.com/widget/booking/TESTWIDGETID';

/**
 * Stubs both GoHighLevel hosts so CI never reaches GoHighLevel: the widget answers with a tiny
 * page and the embed script with an empty script. Returns the list of requests that were stubbed.
 */
export async function stubScheduler(page: Page): Promise<string[]> {
  const requests: string[] = [];
  await page.route('https://api.leadconnectorhq.com/**', (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title><p>calendar stub</p>' });
  });
  await page.route('https://link.msgsndr.com/**', (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* embed script stub */' });
  });
  return requests;
}

/** Forces a calendar URL on the container regardless of the build's PUBLIC_SCHEDULER_URL. */
export async function setSchedulerUrl(page: Page, url: string): Promise<void> {
  await page.evaluate((value) => {
    const container = document.getElementById('scheduler-container');
    if (container) container.dataset.schedulerUrl = value;
  }, url);
}
