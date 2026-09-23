// Loads the Calendly inline widget only after a successful save (US-007
// AC2), pre-fills name/email (AC3), and falls back to a mailto link when
// the URL is unset, the script fails to load, or no scheduler iframe
// appears within 10 seconds (AC5).
const WIDGET_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
const RENDER_TIMEOUT_MS = 10_000;

interface CalendlyFallbackCopy {
  before: string;
  after: string;
  contactEmail: string;
}

interface LeadSuccessDetail {
  name?: string;
  email?: string;
}

function showFallback(widget: HTMLElement | null, fallbackEl: HTMLElement | null, copy: CalendlyFallbackCopy): void {
  if (widget) widget.hidden = true;
  if (!fallbackEl) return;
  fallbackEl.replaceChildren();
  fallbackEl.append(document.createTextNode(copy.before));
  const link = document.createElement('a');
  link.href = `mailto:${copy.contactEmail}`;
  link.textContent = copy.contactEmail;
  fallbackEl.append(link);
  fallbackEl.append(document.createTextNode(copy.after));
  fallbackEl.hidden = false;
}

function buildPrefilledUrl(calendlyUrl: string, lead: LeadSuccessDetail): string {
  const params = new URLSearchParams();
  if (lead.name) params.set('name', lead.name);
  if (lead.email) params.set('email', lead.email);
  if (params.toString() === '') return calendlyUrl;
  const separator = calendlyUrl.includes('?') ? '&' : '?';
  return `${calendlyUrl}${separator}${params.toString()}`;
}

function startScheduling(container: HTMLElement, lead: LeadSuccessDetail): void {
  const calendlyUrl = container.dataset.calendlyUrl ?? '';
  const widget = container.querySelector<HTMLElement>('#calendly-widget');
  const fallbackEl = container.querySelector<HTMLElement>('#calendly-fallback');
  const fallbackCopy = JSON.parse(container.dataset.fallback ?? '{}') as CalendlyFallbackCopy;

  if (!calendlyUrl || !widget) {
    showFallback(widget, fallbackEl, fallbackCopy);
    return;
  }

  const widgetDiv = document.createElement('div');
  widgetDiv.className = 'calendly-inline-widget';
  widgetDiv.style.minWidth = '280px';
  widgetDiv.style.height = '100%';
  widgetDiv.dataset.url = buildPrefilledUrl(calendlyUrl, lead);
  widget.append(widgetDiv);
  widget.hidden = false;

  let rendered = false;
  const observer = new MutationObserver(() => {
    if (widgetDiv.querySelector('iframe')) {
      rendered = true;
      observer.disconnect();
    }
  });
  observer.observe(widgetDiv, { childList: true, subtree: true });

  const script = document.createElement('script');
  script.src = WIDGET_SCRIPT_SRC;
  script.async = true;
  script.onerror = () => {
    observer.disconnect();
    showFallback(widget, fallbackEl, fallbackCopy);
  };
  document.body.append(script);

  setTimeout(() => {
    if (!rendered) {
      observer.disconnect();
      showFallback(widget, fallbackEl, fallbackCopy);
    }
  }, RENDER_TIMEOUT_MS);
}

export function initScheduling(container: HTMLElement, successContainer: HTMLElement): void {
  successContainer.addEventListener('lead:success', (event) => {
    const detail = (event as CustomEvent<LeadSuccessDetail>).detail ?? {};
    startScheduling(container, detail);
  });
}
