// US-040 AC2, AC3, AC4: no page requests anything from Google Fonts (fonts.googleapis.com,
// fonts.gstatic.com); the typefaces load from the site itself, in both languages, at the
// domain root and under the preview's base path (/gaby-main-page/); the heading and body
// files are preloaded. The base-path half builds its own preview build, as preview-forms.spec.ts
// does, and serves it on its own port, so it never touches the build the rest of the suite uses.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { preview, type PreviewServer } from 'vite';
import { LANGUAGES } from '../../src/i18n';
import { PAGE_IDS, routePath } from '../../src/i18n/routes';

const GOOGLE_FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const PORT = 4323;
const BASE = '/gaby-main-page';

interface Tracked {
  googleFonts: string[];
  fontFiles: Array<{ url: string; status: number }>;
}

/** Records every request to a Google Fonts host and every font file the page loads. */
function trackFonts(page: Page): Tracked {
  const tracked: Tracked = { googleFonts: [], fontFiles: [] };
  page.on('request', (request) => {
    if (GOOGLE_FONT_HOSTS.includes(new URL(request.url()).hostname)) tracked.googleFonts.push(request.url());
  });
  page.on('response', (response) => {
    if (/\.woff2?(\?|$)/.test(response.url())) tracked.fontFiles.push({ url: response.url(), status: response.status() });
  });
  return tracked;
}

/** The faces the browser has loaded, as "family weight style". */
async function loadedFaces(page: Page): Promise<string[]> {
  return page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].filter((face) => face.status === 'loaded').map((face) => `${face.family.replace(/"/g, '')} ${face.weight} ${face.style}`);
  });
}

/** `origin` includes the base path (for the preview build, `http://127.0.0.1:4323/gaby-main-page`). */
async function expectSelfHosted(page: Page, origin: string, path: string) {
  const tracked = trackFonts(page);
  await page.goto(`${origin}${path}`);
  await page.waitForLoadState('networkidle');
  expect(tracked.googleFonts, `${path} requested Google Fonts`).toEqual([]);
  // Every font file comes from the site itself, under the base path, and loads.
  for (const file of tracked.fontFiles) {
    expect(file.url.startsWith(`${origin}/fonts/`), file.url).toBe(true);
    expect(file.status, file.url).toBe(200);
  }
  return { tracked, faces: await loadedFaces(page) };
}

/** `getOrigin` includes the base path; `base` is that path alone (empty at the root). */
function suite(label: string, getOrigin: () => string, base: string) {
  test.describe(label, () => {
    for (const lang of LANGUAGES) {
      for (const id of PAGE_IDS) {
        test(`${id} (${lang}) requests nothing from Google Fonts`, async ({ page }) => {
          await expectSelfHosted(page, getOrigin(), routePath(id, lang));
        });
      }

      test(`the Home loads Manrope and Playfair Display from the site, with the italic emphasis (${lang})`, async ({ page }) => {
        const { tracked, faces } = await expectSelfHosted(page, getOrigin(), routePath('home', lang));
        expect(faces).toEqual(expect.arrayContaining(['Manrope 400 normal', 'Playfair Display 500 normal', 'Playfair Display 500 italic']));
        const names = tracked.fontFiles.map((file) => file.url.split('/').pop());
        expect(names).toEqual(expect.arrayContaining(['manrope-latin-400-normal.woff2', 'playfair-display-latin-500-normal.woff2']));
      });

      test(`the heading and body files are preloaded as same-origin WOFF2 (${lang})`, async ({ page }) => {
        await page.goto(`${getOrigin()}${routePath('home', lang)}`);
        const preloads = await page.$$eval('head link[rel="preload"][as="font"]', (links) =>
          links.map((link) => ({
            href: link.getAttribute('href'),
            type: link.getAttribute('type'),
            crossorigin: link.hasAttribute('crossorigin'),
          })),
        );
        expect(preloads).toEqual([
          { href: `${base}/fonts/manrope-latin-400-normal.woff2`, type: 'font/woff2', crossorigin: true },
          { href: `${base}/fonts/playfair-display-latin-500-normal.woff2`, type: 'font/woff2', crossorigin: true },
        ]);
        await expect(page.locator('head link[href*="fonts.googleapis.com"], head link[href*="fonts.gstatic.com"]')).toHaveCount(0);
      });
    }

    test('the page text uses the typefaces of the tokens, with the fallbacks after them', async ({ page }) => {
      await page.goto(`${getOrigin()}${routePath('home', 'es')}`);
      const body = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
      const heading = await page.evaluate(() => getComputedStyle(document.querySelector('h1')!).fontFamily);
      expect(body).toMatch(/^Manrope, /);
      expect(heading).toMatch(/^"Playfair Display", /);
    });
  });
}

suite("at the domain root (the suite's own build)", () => 'http://127.0.0.1:4321', '');

test.describe('under the preview base path', () => {
  let outDir = '';
  let server: PreviewServer | undefined;
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    outDir = mkdtempSync(join(tmpdir(), 'gk-fonts-e2e-'));
    execFileSync('npx', ['astro', 'build', '--outDir', outDir], {
      cwd: process.cwd(),
      env: { ...process.env, PUBLIC_PREVIEW: 'true', SITE_BASE_PATH: `${BASE}/` },
      stdio: 'pipe',
    });
    server = await preview({
      root: process.cwd(),
      build: { outDir },
      base: `${BASE}/`,
      preview: { host: '127.0.0.1', port: PORT, strictPort: true },
    });
  });

  test.afterAll(async () => {
    await server?.close();
    if (outDir) rmSync(outDir, { recursive: true, force: true });
  });

  suite('the preview build', () => `http://127.0.0.1:${PORT}${BASE}`, BASE);
});
