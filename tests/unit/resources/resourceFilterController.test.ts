// Topic filters of the resource library (US-024 AC2): the buttons toggle `aria-pressed`
// and show or hide the grid's cards; the empty state shows when a topic has no card;
// the filter row is revealed only when the controller runs (hidden without JavaScript).
import { beforeEach, describe, expect, it } from 'vitest';
import { initResourceFilters } from '../../../src/components/resources/resourceFilterController';

function mount(topics: string[]): HTMLElement {
  const root = document.createElement('div');
  root.setAttribute('data-resource-library', '');
  root.innerHTML = `
    <article data-topic="debt" id="featured"></article>
    <div data-filter-group hidden>
      <button type="button" data-filter="all" aria-pressed="true">All</button>
      <button type="button" data-filter="debt" aria-pressed="false">Debt</button>
      <button type="button" data-filter="wallets" aria-pressed="false">Wallets</button>
      <button type="button" data-filter="mindset" aria-pressed="false">Mindset</button>
    </div>
    <div data-resource-grid>
      ${topics.map((topic, index) => `<article data-topic="${topic}" id="card-${index}"></article>`).join('')}
    </div>
    <p data-empty hidden>Empty</p>`;
  document.body.appendChild(root);
  return root;
}

const click = (root: HTMLElement, filter: string) =>
  (root.querySelector(`[data-filter="${filter}"]`) as HTMLButtonElement).click();
const visible = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[data-resource-grid] [data-topic]'))
    .filter((card) => !card.hidden)
    .map((card) => card.id);
const pressed = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[data-filter]'))
    .filter((button) => button.getAttribute('aria-pressed') === 'true')
    .map((button) => button.dataset.filter);

describe('initResourceFilters', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reveals the filter row and shows every card with "all" pressed', () => {
    const root = mount(['debt', 'wallets', 'debt']);
    expect((root.querySelector('[data-filter-group]') as HTMLElement).hidden).toBe(true);

    initResourceFilters(root);

    expect((root.querySelector('[data-filter-group]') as HTMLElement).hidden).toBe(false);
    expect(visible(root)).toEqual(['card-0', 'card-1', 'card-2']);
    expect(pressed(root)).toEqual(['all']);
  });

  it('shows only the cards of the chosen topic and moves aria-pressed', () => {
    const root = mount(['debt', 'wallets', 'debt']);
    initResourceFilters(root);

    click(root, 'debt');

    expect(visible(root)).toEqual(['card-0', 'card-2']);
    expect(pressed(root)).toEqual(['debt']);
    expect((root.querySelector('[data-empty]') as HTMLElement).hidden).toBe(true);
  });

  it('restores every card with "all"', () => {
    const root = mount(['debt', 'wallets']);
    initResourceFilters(root);
    click(root, 'wallets');
    click(root, 'all');

    expect(visible(root)).toEqual(['card-0', 'card-1']);
    expect(pressed(root)).toEqual(['all']);
  });

  it('shows the empty state for a topic without cards and hides it again after', () => {
    const root = mount(['debt', 'wallets']);
    initResourceFilters(root);

    click(root, 'mindset');
    expect(visible(root)).toEqual([]);
    expect((root.querySelector('[data-empty]') as HTMLElement).hidden).toBe(false);

    click(root, 'debt');
    expect((root.querySelector('[data-empty]') as HTMLElement).hidden).toBe(true);
  });

  it('leaves the featured card outside the grid untouched', () => {
    const root = mount(['wallets']);
    initResourceFilters(root);
    click(root, 'wallets');
    expect((root.querySelector('#featured') as HTMLElement).hidden).toBe(false);
  });

  it('does nothing when there is no filter row (the page keeps showing every card)', () => {
    const root = document.createElement('div');
    root.innerHTML = '<div data-resource-grid><article data-topic="debt" id="card-0"></article></div>';
    document.body.appendChild(root);

    expect(() => initResourceFilters(root)).not.toThrow();
    expect(visible(root)).toEqual(['card-0']);
  });
});
