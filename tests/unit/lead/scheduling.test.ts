// US-037 AC6: unit tests for the calendar's URL handling (the applicant's details as query
// parameters) and the fallback timing (unset URL, failed script, nothing within 10 seconds).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildSchedulerUrl,
  initScheduling,
  isEmbeddableUrl,
  RENDER_TIMEOUT_MS,
  splitName,
  startScheduling,
} from '../../../src/components/lead/schedulingController';

const WIDGET = 'https://api.leadconnectorhq.com/widget/booking/abc123';

describe('splitName', () => {
  it.each([
    ['Ana Pérez', 'Ana', 'Pérez'],
    ['Ana Pérez Soto', 'Ana', 'Pérez Soto'],
    ['Ana María Pérez Soto', 'Ana María', 'Pérez Soto'],
    ['Ana María Pérez Soto de Lima', 'Ana María', 'Pérez Soto de Lima'],
    ['  Ana   Pérez ', 'Ana', 'Pérez'],
    ['Ana', 'Ana', ''],
    ['', '', ''],
  ])('%j -> %j / %j', (full, first, last) => {
    expect(splitName(full)).toEqual({ first_name: first, last_name: last });
  });
});

describe('buildSchedulerUrl', () => {
  it('adds the first name, last name, email and phone as query parameters', () => {
    const url = new URL(
      buildSchedulerUrl(WIDGET, { name: 'Ana María Pérez Soto', email: 'ana@example.com', phone: '+50684104791' }),
    );
    expect(url.origin + url.pathname).toBe(WIDGET);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      first_name: 'Ana María',
      last_name: 'Pérez Soto',
      email: 'ana@example.com',
      phone: '+50684104791',
    });
  });

  it('encodes special characters', () => {
    const built = buildSchedulerUrl(WIDGET, { name: 'Ana Pérez', email: 'ana+test@example.com', phone: '+50684104791' });
    expect(built).toContain('email=ana%2Btest%40example.com');
    expect(built).toContain('phone=%2B50684104791');
    expect(built).toContain('last_name=P%C3%A9rez');
  });

  it('keeps an existing query string', () => {
    const built = buildSchedulerUrl(`${WIDGET}?widthMode=full`, { email: 'ana@example.com' });
    expect(built).toBe(`${WIDGET}?widthMode=full&email=ana%40example.com`);
  });

  it('returns the URL unchanged when there are no details', () => {
    expect(buildSchedulerUrl(WIDGET, {})).toBe(WIDGET);
  });

  it('never sends the screening answer or any other field', () => {
    const lead = { name: 'Ana Pérez', email: 'a@b.co', phone: '+50684104791', screening_answer: 'ready_to_invest' } as never;
    expect([...new URL(buildSchedulerUrl(WIDGET, lead)).searchParams.keys()].sort()).toEqual([
      'email',
      'first_name',
      'last_name',
      'phone',
    ]);
  });
});

describe('isEmbeddableUrl', () => {
  it('accepts https URLs only', () => {
    expect(isEmbeddableUrl(WIDGET)).toBe(true);
    expect(isEmbeddableUrl('http://api.leadconnectorhq.com/x')).toBe(false);
    expect(isEmbeddableUrl('javascript:alert(1)')).toBe(false);
    expect(isEmbeddableUrl('not a url')).toBe(false);
    expect(isEmbeddableUrl('')).toBe(false);
  });
});

function mountContainer(url: string): { container: HTMLElement; success: HTMLElement } {
  document.body.innerHTML = '';
  const success = document.createElement('div');
  success.id = 'lead-success-container';
  const container = document.createElement('div');
  container.id = 'scheduler-container';
  container.dataset.schedulerUrl = url;
  container.dataset.fallback = JSON.stringify({ before: 'Escríbenos a ', after: ' y coordinamos.', contactEmail: 'gkelly@poliartcr.com' });
  container.innerHTML = '<div id="scheduler-widget" hidden></div><p id="scheduler-fallback" hidden></p>';
  success.append(container);
  document.body.append(success);
  return { container, success };
}
const widgetOf = (c: HTMLElement) => c.querySelector<HTMLElement>('#scheduler-widget')!;
const fallbackOf = (c: HTMLElement) => c.querySelector<HTMLElement>('#scheduler-fallback')!;
const embedScript = () => document.querySelector<HTMLScriptElement>('script[src*="msgsndr"]');

describe('startScheduling', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('shows the fallback at once when the URL is unset, and loads nothing', () => {
    const { container } = mountContainer('');
    startScheduling(container, { email: 'a@b.co' });
    expect(fallbackOf(container).hidden).toBe(false);
    expect(fallbackOf(container).querySelector('a')?.getAttribute('href')).toBe('mailto:gkelly@poliartcr.com');
    expect(widgetOf(container).hidden).toBe(true);
    expect(container.querySelector('iframe')).toBeNull();
    expect(embedScript()).toBeNull();
  });

  it('shows the fallback and loads nothing for a URL that is not https', () => {
    const { container } = mountContainer('http://api.leadconnectorhq.com/widget/booking/abc123');
    startScheduling(container, {});
    expect(fallbackOf(container).hidden).toBe(false);
    expect(container.querySelector('iframe')).toBeNull();
    expect(embedScript()).toBeNull();
  });

  it('embeds the iframe with the prefilled URL and loads the embed script', () => {
    const { container } = mountContainer(WIDGET);
    startScheduling(container, { name: 'Ana Pérez', email: 'a@b.co', phone: '+50684104791' });
    const iframe = container.querySelector('iframe')!;
    expect(new URL(iframe.src).searchParams.get('email')).toBe('a@b.co');
    expect(iframe.id).toMatch(/^abc123_\d+$/);
    expect(widgetOf(container).hidden).toBe(false);
    expect(embedScript()?.src).toBe('https://link.msgsndr.com/js/form_embed.js');
  });

  it('keeps the calendar when the iframe and the script load within 10 seconds', () => {
    const { container } = mountContainer(WIDGET);
    startScheduling(container, {});
    container.querySelector('iframe')!.dispatchEvent(new Event('load'));
    embedScript()!.dispatchEvent(new Event('load'));
    vi.advanceTimersByTime(RENDER_TIMEOUT_MS + 1_000);
    expect(fallbackOf(container).hidden).toBe(true);
    expect(widgetOf(container).hidden).toBe(false);
  });

  it('shows the fallback when nothing has loaded after 10 seconds, and not before', () => {
    const { container } = mountContainer(WIDGET);
    startScheduling(container, {});
    vi.advanceTimersByTime(RENDER_TIMEOUT_MS - 1);
    expect(fallbackOf(container).hidden).toBe(true);
    vi.advanceTimersByTime(1);
    expect(fallbackOf(container).hidden).toBe(false);
    expect(widgetOf(container).hidden).toBe(true);
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('shows the fallback when only the iframe loaded after 10 seconds (the script never came)', () => {
    const { container } = mountContainer(WIDGET);
    startScheduling(container, {});
    container.querySelector('iframe')!.dispatchEvent(new Event('load'));
    vi.advanceTimersByTime(RENDER_TIMEOUT_MS);
    expect(fallbackOf(container).hidden).toBe(false);
  });

  it('shows the fallback at once when the embed script fails to load', () => {
    const { container } = mountContainer(WIDGET);
    startScheduling(container, {});
    embedScript()!.dispatchEvent(new Event('error'));
    expect(fallbackOf(container).hidden).toBe(false);
    expect(widgetOf(container).hidden).toBe(true);
  });
});

describe('initScheduling', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('starts only on lead:success, so nothing is requested before a saved lead', () => {
    const { container, success } = mountContainer(WIDGET);
    initScheduling(container, success);
    expect(container.querySelector('iframe')).toBeNull();
    expect(embedScript()).toBeNull();

    success.dispatchEvent(new CustomEvent('lead:success', { detail: { name: 'Ana Pérez', email: 'a@b.co', phone: '+50684104791' } }));
    expect(container.querySelector('iframe')).not.toBeNull();
    expect(embedScript()).not.toBeNull();
  });
});
