// Links and assets always go through these helpers, never hand-written paths,
// so the same build works at the site root (production) and under
// `/gaby-main-page/` (GitHub Pages preview): ADR-003 update, ADR-005.
import { routePath, type PageId } from '../../i18n/routes';
import type { Language } from '../../i18n';

/** Prefix an absolute site path ("/es/", "/favicon.svg") with the base path. */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  const prefix = base.replace(/\/+$/, '');
  return `${prefix}${path.startsWith('/') ? path : `/${path}`}`;
}

/** URL of a file in `public/`. */
export function assetUrl(path: string, base?: string): string {
  return withBase(path, base);
}

/** Link to a page in a language, optionally to a section anchor (without "#"). */
export function pageHref(id: PageId, lang: Language, anchor?: string, base?: string): string {
  return `${withBase(routePath(id, lang), base)}${anchor ? `#${anchor}` : ''}`;
}
