// Determines which language dictionary the lead form should render, from the
// static page path (`/es/...` or `/en/...`). LeadForm.astro is composed
// identically into both pages/{es,en}/index.astro (Agent 1 owns those pages
// and does not pass a language prop), so the component resolves its own
// language from the URL instead (see ADR-003 section anchors, which are
// already shared across languages).
//
// The site may be served under a base path (`/gaby-main-page/` on the GitHub
// Pages preview, ADR-005), so the base is stripped before the language segment is
// read; otherwise the first segment would be the base's own and the form would
// fall back to Spanish on every page.
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../../i18n';

/** `pathname` without the leading base path (`/gaby-main-page/es/` -> `/es/`). */
function stripBase(pathname: string, base: string): string {
  const prefix = base.replace(/\/+$/, '');
  if (prefix === '') return pathname;
  if (pathname === prefix) return '/';
  return pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
}

export function detectPageLanguage(pathname: string, base: string = import.meta.env.BASE_URL): Language {
  const segment = stripBase(pathname, base)
    .split('/')
    .find((part) => part.length > 0);
  return segment && isLanguage(segment) ? segment : DEFAULT_LANGUAGE;
}
