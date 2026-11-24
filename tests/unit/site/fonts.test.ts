// US-040 AC1, AC2, AC3, AC4: the typefaces are WOFF2 files in the repository with their
// OFL texts, the @font-face rules in global.css match the font list, the heading and body
// files are preloaded through the base-path helper, and no page links to Google Fonts.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FONT_FILES, fontUrl, preloadedFonts } from '../../../src/lib/site/fonts';

const ROOT = join(__dirname, '..', '..', '..');
const css = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');
const layout = readFileSync(join(ROOT, 'src/layouts/BaseLayout.astro'), 'utf8');

/** The @font-face rules of global.css: family, style, weight, file. */
function fontFaceRules() {
  return [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, body]) => ({
    family: body.match(/font-family:\s*'([^']+)'/)![1],
    style: body.match(/font-style:\s*(\w+)/)![1],
    weight: Number(body.match(/font-weight:\s*(\d+)/)![1]),
    file: body.match(/url\('\/fonts\/([^']+)'\)/)![1],
    swap: /font-display:\s*swap/.test(body),
    format: /format\('woff2'\)/.test(body),
  }));
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? sourceFiles(path) : [path];
  });
}

describe('the font files (AC1)', () => {
  it('serves exactly Playfair Display 500 + italic 500 and Manrope 400, 600, 700', () => {
    expect(FONT_FILES.map(({ family, weight, style }) => `${family} ${weight} ${style}`)).toEqual([
      'Manrope 400 normal',
      'Manrope 600 normal',
      'Manrope 700 normal',
      'Playfair Display 500 normal',
      'Playfair Display 500 italic',
    ]);
  });

  it.each(FONT_FILES.map((font) => font.file))('%s is a WOFF2 file in public/fonts/', (file) => {
    const bytes = readFileSync(join(ROOT, 'public/fonts', file));
    expect(bytes.subarray(0, 4).toString('latin1')).toBe('wOF2');
    expect(bytes.length).toBeGreaterThan(5_000);
    expect(bytes.length).toBeLessThan(60_000); // Latin subset only
  });

  it('keeps the SIL Open Font License text of each family next to its files', () => {
    for (const license of ['Manrope-OFL.txt', 'PlayfairDisplay-OFL.txt']) {
      const text = readFileSync(join(ROOT, 'public/fonts', license), 'utf8');
      expect(text).toContain('SIL OPEN FONT LICENSE Version 1.1');
      expect(text).toContain('Copyright');
    }
    expect(readFileSync(join(ROOT, 'public/fonts/Manrope-OFL.txt'), 'utf8')).toContain('Manrope');
    expect(readFileSync(join(ROOT, 'public/fonts/PlayfairDisplay-OFL.txt'), 'utf8')).toContain('Playfair Display');
  });

  it('has no other file in public/fonts/ than the listed ones, the licenses and the sources note', () => {
    const allowed = new Set([...FONT_FILES.map((font) => font.file), 'Manrope-OFL.txt', 'PlayfairDisplay-OFL.txt', 'SOURCES.txt']);
    expect(readdirSync(join(ROOT, 'public/fonts')).filter((file) => !allowed.has(file))).toEqual([]);
  });
});

describe('the @font-face rules (AC1, AC3)', () => {
  it('match the font list one to one, with font-display: swap and WOFF2', () => {
    const rules = fontFaceRules();
    expect(rules.map(({ family, style, weight, file }) => ({ family, style, weight, file }))).toEqual(
      FONT_FILES.map(({ family, style, weight, file }) => ({ family, style, weight, file })),
    );
    for (const rule of rules) {
      expect(rule.swap, rule.file).toBe(true);
      expect(rule.format, rule.file).toBe(true);
    }
  });

  it('keep the fallback stacks of the tokens', () => {
    expect(css).toMatch(/--font-sans:\s*'Manrope',\s*ui-sans-serif/);
    expect(css).toMatch(/--font-serif:\s*'Playfair Display',\s*Georgia/);
  });
});

describe('preloads and base path (AC3, AC4)', () => {
  it('preloads the body face and the heading face only', () => {
    expect(preloadedFonts().map((font) => font.file)).toEqual([
      'manrope-latin-400-normal.woff2',
      'playfair-display-latin-500-normal.woff2',
    ]);
    expect(layout).toMatch(/rel="preload"[^>]*as="font"[^>]*type="font\/woff2"[^>]*crossorigin/);
    expect(layout).toContain('fontUrl(font.file)');
  });

  it('builds font URLs from the base path', () => {
    expect(fontUrl('a.woff2', '/')).toBe('/fonts/a.woff2');
    expect(fontUrl('a.woff2', '/gaby-main-page/')).toBe('/gaby-main-page/fonts/a.woff2');
    expect(fontUrl('a.woff2', '/gaby-main-page')).toBe('/gaby-main-page/fonts/a.woff2');
  });
});

describe('no Google Fonts (AC2)', () => {
  it('has no reference to fonts.googleapis.com or fonts.gstatic.com in src/ or public/', () => {
    const offenders = [...sourceFiles(join(ROOT, 'src')), ...sourceFiles(join(ROOT, 'public'))]
      .filter((file) => /\.(astro|ts|css|svg|html|txt|js|mjs)$/.test(file))
      .filter((file) => /fonts\.(googleapis|gstatic)\.com/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(ROOT, file));
    expect(offenders).toEqual([]);
  });
});
