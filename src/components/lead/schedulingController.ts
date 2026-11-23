// Loads Gaby's GoHighLevel booking calendar only after a successful save (US-037 AC1,
// US-007 AC2), pre-fills the applicant's details (AC2), and falls back to a mailto link
// when the URL is unset, the embed script fails to load, or the calendar does not report
// that it is running within 10 seconds (AC3).
//
// The embed is GoHighLevel's own pair: an <iframe> on the widget URL plus its
// `form_embed.js` script, which resizes the iframe to its content and forwards the
// query string. Two hosts are involved, both named in the PR and the security baseline:
// api.leadconnectorhq.com (the widget) and link.msgsndr.com (the script).
//
// Prefill: the widget reads `first_name`, `last_name`, `email` and `phone` from the
// iframe URL's query string (verified against the live widget, see the PR). It has
// separate first and last name fields, and ignores `full_name` for them.
const EMBED_SCRIPT_SRC = 'https://link.msgsndr.com/js/form_embed.js';
export const RENDER_TIMEOUT_MS = 10_000;

interface SchedulerFallbackCopy {
  before: string;
  after: string;
  contactEmail: string;
}

export interface LeadSuccessDetail {
  name?: string;
  email?: string;
  phone?: string;
}

function showFallback(widget: HTMLElement | null, fallbackEl: HTMLElement | null, copy: SchedulerFallbackCopy): void {
  if (widget) {
    widget.hidden = true;
    widget.replaceChildren();
  }
  if (!fallbackEl) return;
  fallbackEl.replaceChildren();
  fallbackEl.append(document.createTextNode(copy.before));
  const link = document.createElement('a');
  link.href = `mailto:${copy.contactEmail}`;
  link.textContent = copy.contactEmail;
  // 44px touch target (US-008 AC2): a bare <a> only hit-tests its glyphs.
  link.className = 'inline-flex min-h-11 items-center text-heritage-blue underline underline-offset-2 hover:text-charcoal';
  fallbackEl.append(link);
  fallbackEl.append(document.createTextNode(copy.after));
  fallbackEl.hidden = false;
}

/**
 * Splits the single "name" field of the application into the calendar's first and last
 * name fields. The application requires at least two words. With two or three words the
 * first word is the first name; from four words the first two are (compound given names,
 * as in "Ana María Pérez Soto"). The applicant can correct both fields in the calendar.
 */
export function splitName(fullName: string): { first_name: string; last_name: string } {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return { first_name: words[0] ?? '', last_name: '' };
  const givenCount = words.length >= 4 ? 2 : 1;
  return { first_name: words.slice(0, givenCount).join(' '), last_name: words.slice(givenCount).join(' ') };
}

/** The widget URL with the applicant's details as query parameters; unchanged without details. */
export function buildSchedulerUrl(schedulerUrl: string, lead: LeadSuccessDetail): string {
  const params = new URLSearchParams();
  if (lead.name) {
    const { first_name, last_name } = splitName(lead.name);
    if (first_name) params.set('first_name', first_name);
    if (last_name) params.set('last_name', last_name);
  }
  if (lead.email) params.set('email', lead.email);
  if (lead.phone) params.set('phone', lead.phone);
  if (params.toString() === '') return schedulerUrl;
  const separator = schedulerUrl.includes('?') ? '&' : '?';
  return `${schedulerUrl}${separator}${params.toString()}`;
}

/** Only an https URL is embedded: anything else (a typo, a `javascript:` URL) counts as unset. */
export function isEmbeddableUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

/** The widget id is the last path segment (`.../widget/booking/<id>`); the embed script maps iframes by an id built from it. */
function iframeId(schedulerUrl: string): string {
  const segments = new URL(schedulerUrl).pathname.split('/').filter(Boolean);
  return `${segments[segments.length - 1] ?? 'scheduler'}_${Date.now()}`;
}

export function startScheduling(container: HTMLElement, lead: LeadSuccessDetail): void {
  const schedulerUrl = container.dataset.schedulerUrl ?? '';
  const widget = container.querySelector<HTMLElement>('#scheduler-widget');
  const fallbackEl = container.querySelector<HTMLElement>('#scheduler-fallback');
  const fallbackCopy = JSON.parse(container.dataset.fallback ?? '{}') as SchedulerFallbackCopy;

  if (!schedulerUrl || !widget || !isEmbeddableUrl(schedulerUrl)) {
    showFallback(widget, fallbackEl, fallbackCopy);
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.id = iframeId(schedulerUrl);
  iframe.src = buildSchedulerUrl(schedulerUrl, lead);
  // GoHighLevel's embed script resizes the iframe to its content; until it does, the widget scrolls.
  iframe.style.cssText = 'width:100%;min-height:630px;border:none;';
  iframe.setAttribute('aria-labelledby', 'lead-success-title');
  widget.append(iframe);
  widget.hidden = false;

  let settled = false;
  const fail = () => {
    if (settled) return;
    settled = true;
    window.removeEventListener('message', onMessage);
    showFallback(widget, fallbackEl, fallbackCopy);
  };

  // Ready means two things: the embed script loaded, and the widget itself is running. The
  // iframe's `load` event is not enough: a browser fires it for an error page too. The widget
  // posts messages to its parent as it starts (verified against the live widget: height and
  // sticky-contact messages within about two seconds), so a message that comes from the
  // iframe's own window, at the widget's origin, proves it rendered.
  const widgetOrigin = new URL(schedulerUrl).origin;
  let widgetReady = false;
  let scriptReady = false;
  const check = () => {
    if (widgetReady && scriptReady && !settled) {
      settled = true;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
    }
  };
  function onMessage(event: MessageEvent): void {
    if (event.source !== iframe.contentWindow || event.origin !== widgetOrigin) return;
    widgetReady = true;
    check();
  }
  window.addEventListener('message', onMessage);
  iframe.addEventListener('error', fail);

  const script = document.createElement('script');
  script.src = EMBED_SCRIPT_SRC;
  script.async = true;
  script.addEventListener('load', () => {
    scriptReady = true;
    check();
  });
  script.addEventListener('error', fail);
  document.body.append(script);

  // Nothing usable within 10 seconds: fall back, whichever part is missing.
  const timer = setTimeout(fail, RENDER_TIMEOUT_MS);
}

export function initScheduling(container: HTMLElement, successContainer: HTMLElement): void {
  successContainer.addEventListener('lead:success', (event) => {
    const detail = (event as CustomEvent<LeadSuccessDetail>).detail ?? {};
    startScheduling(container, detail);
  });
}
