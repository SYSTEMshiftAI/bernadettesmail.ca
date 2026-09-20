const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const filters = [...document.querySelectorAll('[data-filter]')];
const cases = [...document.querySelectorAll('[data-tags]')];
const empty = document.querySelector('[data-empty]');

const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  const label = menuButton.querySelector('.sr-only');
  if (label) label.textContent = open ? 'Open menu' : 'Close menu';
  nav?.classList.toggle('is-open', !open);
});

nav?.addEventListener('click', (event) => {
  if (!(event.target instanceof HTMLAnchorElement)) return;
  menuButton?.setAttribute('aria-expanded', 'false');
  const label = menuButton?.querySelector('.sr-only');
  if (label) label.textContent = 'Open menu';
  nav.classList.remove('is-open');
});

function applyFilter(filter) {
  let visible = 0;
  filters.forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  cases.forEach((item) => {
    const tags = item.dataset.tags?.split(' ') ?? [];
    const show = filter === 'all' || tags.includes(filter);
    item.hidden = !show;
    if (show) visible += 1;
    if (!show && item instanceof HTMLDetailsElement) item.open = false;
  });

  if (empty) empty.hidden = visible !== 0;
}

filters.forEach((button) => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter ?? 'all'));
});

document.querySelectorAll('[data-filter-link]').forEach((link) => {
  link.addEventListener('click', () => {
    applyFilter(link.dataset.filterLink ?? 'all');
  });
});

document.querySelectorAll('details.case').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    const summary = detail.querySelector('summary');
    summary?.setAttribute('aria-expanded', String(detail.open));
  });
});
