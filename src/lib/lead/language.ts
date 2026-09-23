// Determines which language dictionary the lead form should render, from the
// static page path (`/es/...` or `/en/...`). LeadForm.astro is composed
// identically into both pages/{es,en}/index.astro (Agent 1 owns those pages
// and does not pass a language prop), so the component resolves its own
// language from the URL instead (see ADR-003 section anchors, which are
// already shared across languages).
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../../i18n';

export function detectPageLanguage(pathname: string): Language {
  const segment = pathname.split('/').find((part) => part.length > 0);
  return segment && isLanguage(segment) ? segment : DEFAULT_LANGUAGE;
}
