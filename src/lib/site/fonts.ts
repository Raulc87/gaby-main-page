// The site's typefaces (US-040, UX_UI_DIRECTION.md section 2.3), served from public/fonts/
// instead of Google Fonts. The @font-face rules are in src/styles/global.css; a unit test
// keeps them equal to this list. Only the weights the design uses are here.
import { assetUrl } from './links';

export interface FontFile {
  family: 'Manrope' | 'Playfair Display';
  weight: 400 | 500 | 600 | 700;
  style: 'normal' | 'italic';
  /** File name in public/fonts/. */
  file: string;
  /** Preloaded in every page's head, so text does not jump on load (US-040 AC3). */
  preload: boolean;
}

export const FONT_FILES: readonly FontFile[] = [
  // Body, buttons, forms, navigation and labels: Manrope 400 is the body text.
  { family: 'Manrope', weight: 400, style: 'normal', file: 'manrope-latin-400-normal.woff2', preload: true },
  { family: 'Manrope', weight: 600, style: 'normal', file: 'manrope-latin-600-normal.woff2', preload: false },
  { family: 'Manrope', weight: 700, style: 'normal', file: 'manrope-latin-700-normal.woff2', preload: false },
  // Headings and the wordmark: Playfair Display 500; its italic is the emphasis of titles.
  { family: 'Playfair Display', weight: 500, style: 'normal', file: 'playfair-display-latin-500-normal.woff2', preload: true },
  { family: 'Playfair Display', weight: 500, style: 'italic', file: 'playfair-display-latin-500-italic.woff2', preload: false },
];

/** URL of a font file, with the base path. */
export function fontUrl(file: string, base?: string): string {
  return assetUrl(`/fonts/${file}`, base);
}

/** The files every page preloads. */
export function preloadedFonts(): readonly FontFile[] {
  return FONT_FILES.filter((font) => font.preload);
}
