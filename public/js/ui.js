// Shared UI helpers. Text is always inserted with textContent (never innerHTML), so user input cannot inject HTML.

/** Create an element: el('div', { class: 'card' }, 'text', childNode) */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

const PAGES = [
  { href: '/', label: 'Home' },
  { href: '/teams.html', label: 'Captain' },
  { href: '/organiser.html', label: 'Organiser' },
  { href: '/fixtures.html', label: 'Fixtures' },
  { href: '/standings.html', label: 'Standings' },
];

/** Fills <header id="site-header"> with the brand and navigation. */
export function renderHeader() {
  const host = document.getElementById('site-header');
  if (!host) return;
  const current = location.pathname === '/index.html' ? '/' : location.pathname;
  host.className = 'site-header';
  host.append(
    el(
      'div',
      { class: 'bar' },
      el('a', { class: 'brand', href: '/' }, el('span', { class: 'ball' }, '⚽'), 'Sports Tournament Manager'),
      el(
        'nav',
        { class: 'nav' },
        PAGES.map((p) => el('a', { href: p.href, class: p.href === current ? 'active' : null }, p.label)),
      ),
    ),
  );
}

/** Shows a short message at the bottom of the screen. */
export function toast(message, type = 'ok') {
  const node = el('div', { class: `toast ${type === 'error' ? 'error' : ''}`, role: 'status' }, message);
  document.body.append(node);
  setTimeout(() => node.remove(), 3000);
}

/** Writes an error/success message into a container element (clears it when text is empty). */
export function setMessage(container, text, type = 'error') {
  container.textContent = text || '';
  container.className = text ? `message ${type}` : 'message';
}

/** Friendly empty-state block. */
export function emptyState(emoji, text) {
  return el('div', { class: 'empty' }, el('span', { class: 'emoji' }, emoji), text);
}
