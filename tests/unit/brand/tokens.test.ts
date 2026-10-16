// US-019 AC1, AC2, AC5, AC7: the brand tokens of UX_UI_DIRECTION.md v1.0
// section 2, the allowed contrast pairs of section 2.2, and no colour literal
// outside src/styles/global.css.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..', '..', '..');
const css = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');

/** Hex values of the `--color-*` tokens declared in `@theme` (literal values only). */
function themeColors(): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const [, name, value] of css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    colors[name] = value.toLowerCase();
  }
  return colors;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(astro|ts|tsx|css)$/.test(entry) ? [path] : [];
  });
}

describe('brand tokens (UX_UI_DIRECTION.md section 2.1)', () => {
  const colors = themeColors();

  it('declares the nine brand colors with the specified values', () => {
    expect(colors).toMatchObject({
      'heritage-blue': '#3c5f8d',
      ivory: '#f5f1ea',
      sand: '#d8c5b1',
      'soft-gold': '#d6b04d',
      terracotta: '#c98368',
      charcoal: '#2b2b2b',
      surface: '#ffffff',
      muted: '#5a5148',
      'field-line': '#8c7b6b',
    });
  });

  it('declares no other literal color: Proposal A names only alias the brand tokens', () => {
    const literal = new Set(Object.keys(colors));
    expect([...literal].sort()).toEqual(
      [
        'charcoal',
        'field-line',
        'heritage-blue',
        'ivory',
        'muted',
        'sand',
        'soft-gold',
        'surface',
        'terracotta',
      ].sort(),
    );
    for (const alias of ['paper', 'ink', 'navy', 'brand', 'gold', 'gold-ink', 'line']) {
      expect(css).toMatch(new RegExp(`--color-${alias}:\\s*var\\(--color-[a-z-]+\\);`));
    }
  });

  it('uses Playfair Display and Manrope, not Crimson Pro or IBM Plex Sans (AC2)', () => {
    expect(css).toMatch(/--font-sans:\s*'Manrope'/);
    expect(css).toMatch(/--font-serif:\s*'Playfair Display'/);
    const layout = readFileSync(join(ROOT, 'src/layouts/BaseLayout.astro'), 'utf8');
    expect(layout).toContain('family=Manrope:wght@400;600;700');
    expect(layout).toContain('family=Playfair+Display:ital,wght@0,500;1,500');
    expect(layout).not.toMatch(/Crimson|IBM\+Plex|Inter/);
    expect(css).not.toMatch(/Crimson|IBM Plex|Inter\b/);
  });
});

describe('allowed color pairs (UX_UI_DIRECTION.md section 2.2, AC5, AC7)', () => {
  const c = themeColors();

  // [text, background, ratio in the spec table, minimum required]
  const allowed: Array<[string, string, number, number]> = [
    ['charcoal', 'ivory', 12.58, 4.5],
    ['charcoal', 'surface', 14.16, 4.5],
    ['charcoal', 'sand', 8.46, 4.5],
    ['charcoal', 'soft-gold', 6.86, 4.5],
    ['charcoal', 'terracotta', 4.67, 4.5],
    ['heritage-blue', 'ivory', 5.8, 4.5],
    ['heritage-blue', 'surface', 6.53, 4.5],
    ['muted', 'ivory', 6.89, 4.5],
    ['muted', 'surface', 7.76, 4.5],
    ['ivory', 'heritage-blue', 5.8, 4.5],
    ['surface', 'heritage-blue', 6.53, 4.5],
    ['ivory', 'charcoal', 12.58, 4.5],
    ['soft-gold', 'charcoal', 6.86, 4.5],
    // Non-text, 3:1 (WCAG 1.4.11)
    ['field-line', 'ivory', 3.61, 3],
    ['field-line', 'surface', 4.07, 3],
    ['heritage-blue', 'ivory', 5.8, 3],
  ];

  it.each(allowed)('%s on %s is %f:1 and at least the required ratio', (fg, bg, listed, min) => {
    const ratio = contrast(c[fg], c[bg]);
    expect(ratio).toBeGreaterThanOrEqual(min);
    expect(ratio).toBeCloseTo(listed, 1);
  });

  it('red-700 error text on ivory and surface reaches 4.5:1', () => {
    expect(contrast('#b91c1c', c.ivory)).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#b91c1c', c.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ['soft-gold', 'ivory'],
    ['terracotta', 'ivory'],
    ['sand', 'ivory'],
  ])('%s on %s is documented as never text (below 4.5:1)', (fg, bg) => {
    expect(contrast(c[fg], c[bg])).toBeLessThan(3);
  });

  it('no component uses sand as text color', () => {
    const offenders = sourceFiles(join(ROOT, 'src'))
      .filter((file) => /\btext-sand\b/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(ROOT, file));
    expect(offenders).toEqual([]);
  });
});

describe('no color literals outside the token file (AC1)', () => {
  const literal = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3,4}\b(?![-\w])|\b(?:rgb|rgba|hsl|hsla|oklch)\(/;

  it('finds none in src/ except src/styles/global.css', () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(join(ROOT, 'src'))) {
      if (relative(ROOT, file) === 'src/styles/global.css') continue;
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, index) => {
          // In-page anchors such as href="#hero" or `#${id}` are not colors.
          const text = line.replace(/(?:href|to)=["'`]#[a-z$][^"'`]*["'`]/g, '');
          if (literal.test(text)) offenders.push(`${relative(ROOT, file)}:${index + 1}`);
        });
    }
    expect(offenders).toEqual([]);
  });
});
