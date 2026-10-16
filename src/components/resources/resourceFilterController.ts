// Topic filters of the resource library (US-024 AC2, UX_UI_DIRECTION.md section 5.3):
// toggle buttons with `aria-pressed` that show or hide the cards of the grid without
// reloading. Without JavaScript the filter row stays hidden (it is rendered `hidden`)
// and every card is shown. Buttons are native, so the keyboard works (Tab, Enter,
// Space); the empty-state message is a status region.
export const ALL_TOPICS = 'all';

export function initResourceFilters(root: HTMLElement): void {
  const filterGroup = root.querySelector<HTMLElement>('[data-filter-group]');
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-resource-grid] [data-topic]'));
  const emptyState = root.querySelector<HTMLElement>('[data-empty]');
  if (!filterGroup || buttons.length === 0) return;

  function select(topic: string): void {
    let visible = 0;
    for (const card of cards) {
      const show = topic === ALL_TOPICS || card.dataset.topic === topic;
      card.hidden = !show;
      if (show) visible += 1;
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === topic));
    }
    if (emptyState) emptyState.hidden = visible > 0;
  }

  for (const button of buttons) {
    button.addEventListener('click', () => select(button.dataset.filter ?? ALL_TOPICS));
  }

  filterGroup.hidden = false;
  select(ALL_TOPICS);
}
