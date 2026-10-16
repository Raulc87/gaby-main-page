// US-027 AC3: in a preview build the application form, wherever it is used (the VIP
// page and the phase 1 Home), never calls an endpoint and loads no third party.
// After client-side validation it shows the next screen per the routing with
// `preview.form_note`; the scheduler is the static stand-in (`preview.scheduler`)
// whatever PUBLIC_CALENDLY_URL is.
//
// This spec builds its own preview build (PUBLIC_PREVIEW=true, with a Calendly URL
// configured to prove it is ignored) into a temporary directory and serves it on its
// own port with no /api proxy, so it never touches the build the rest of the suite uses.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { preview, type PreviewServer } from 'vite';
import { getCommon, type Language } from '../../src/i18n';
import { routePath } from '../../src/i18n/routes';
import { getForm } from '../../src/lib/lead/dictionaries';
import { fillLeadForm, SELECTORS } from './support/lead-form';

const PORT = 4322;
const ORIGIN = `http://127.0.0.1:${PORT}`;

let outDir = '';
let server: PreviewServer | undefined;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  outDir = mkdtempSync(join(tmpdir(), 'gk-preview-e2e-'));
  execFileSync('npx', ['astro', 'build', '--outDir', outDir], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PUBLIC_PREVIEW: 'true',
      PUBLIC_CALENDLY_URL: 'https://calendly.com/test-account/intro-call',
    },
    stdio: 'pipe',
  });
  server = await preview({
    root: process.cwd(),
    build: { outDir },
    preview: { host: '127.0.0.1', port: PORT, strictPort: true },
  });
});

test.afterAll(async () => {
  await server?.close();
  if (outDir) rmSync(outDir, { recursive: true, force: true });
});

/** Records every request that is not to the preview build itself or to Google Fonts (the site's own fonts). */
function trackRequests(page: Page): { forbidden: string[]; api: string[] } {
  const tracked = { forbidden: [] as string[], api: [] as string[] };
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.startsWith('/api')) tracked.api.push(request.url());
    const allowedHost = ['127.0.0.1', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname);
    if (!allowedHost || url.hostname.includes('calendly')) tracked.forbidden.push(request.url());
  });
  return tracked;
}

const PAGES: Array<[string, (lang: Language) => string]> = [
  ['VIP page', (lang) => routePath('vip', lang)],
  ['phase 1 Home', (lang) => `${routePath('home', lang)}#lead-form`],
];

for (const lang of ['es', 'en'] as const) {
  const form = getForm(lang);
  const common = getCommon(lang);

  for (const [label, path] of PAGES) {
    test(`preview ${label} (${lang}): qualified answer shows the stand-in, sends and loads nothing`, async ({ page }) => {
      const tracked = trackRequests(page);
      await page.goto(`${ORIGIN}${path(lang)}`);

      // The build is a preview build.
      await expect(page.locator('[data-preview-bar]')).toContainText(common.preview.banner);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

      await fillLeadForm(page, { screeningCode: 'ready_to_invest' });
      await page.locator(SELECTORS.submitButton).click();

      await expect(page.getByRole('heading', { name: form.thankYou.title })).toBeVisible();
      await expect(page.locator(`${SELECTORS.successContainer} [data-preview-note]`)).toHaveText(
        common.preview.form_note,
      );
      await expect(page.locator('#scheduler-preview')).toHaveText(common.preview.scheduler);
      expect(await page.locator('#calendly-container, #calendly-widget, iframe').count()).toBe(0);
      expect(await page.locator('script[src*="calendly"]').count()).toBe(0);

      await page.waitForLoadState('networkidle');
      expect(tracked.api).toEqual([]);
      expect(tracked.forbidden).toEqual([]);
    });

    test(`preview ${label} (${lang}): not-ready answer shows the not-ready screen, sends and loads nothing`, async ({ page }) => {
      const tracked = trackRequests(page);
      await page.goto(`${ORIGIN}${path(lang)}`);

      await fillLeadForm(page, { screeningCode: 'exploring' });
      await page.locator(SELECTORS.submitButton).click();

      await expect(page.getByRole('heading', { name: form.notReady.title })).toBeVisible();
      await expect(page.locator('#lead-not-ready-container [data-preview-note]')).toHaveText(
        common.preview.form_note,
      );
      expect(await page.locator('#scheduler-preview').isVisible()).toBe(false);

      await page.waitForLoadState('networkidle');
      expect(tracked.api).toEqual([]);
      expect(tracked.forbidden).toEqual([]);
    });
  }

  test(`preview (${lang}): an invalid form still shows its validation errors and sends nothing`, async ({ page }) => {
    const tracked = trackRequests(page);
    await page.goto(`${ORIGIN}${routePath('vip', lang)}`);

    await page.locator(SELECTORS.submitButton).click();

    await expect(page.locator(SELECTORS.nameError)).toHaveText(form.fieldErrors.required);
    await expect(page.locator(SELECTORS.formContainer)).toBeVisible();
    expect(tracked.api).toEqual([]);
    expect(tracked.forbidden).toEqual([]);
  });
}

test('a normal build shows no preview note and no stand-in markup on the form screens', async ({ page }) => {
  // Served by the suite's regular webServer (baseURL), which is not a preview build.
  await page.goto(routePath('vip', 'es'));
  await expect(page.locator('[data-preview-note]')).toHaveCount(0);
  await expect(page.locator('#scheduler-preview')).toHaveCount(0);
  await expect(page.locator('#calendly-container')).toHaveCount(1);
});
