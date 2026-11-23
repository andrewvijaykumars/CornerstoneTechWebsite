import { $, $$ } from './util';

export function initFaq() {
  const items = $$('[data-faq]');
  items.forEach((item) => {
    const btn = $<HTMLButtonElement>('.faq__q', item);
    btn?.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach((o) => {
        const isThis = o === item;
        const should = isThis ? open : false;
        o.classList.toggle('is-open', should);
        $('.faq__q', o)?.setAttribute('aria-expanded', String(should));
      });
    });
  });
}

export function initIndustries() {
  const root = $('[data-ind]');
  if (!root) return;
  const tabs = $$<HTMLButtonElement>('[role=tab]', root);
  const panel = $('[role=tabpanel]', root);
  const title = $('[data-ind-title]', root);
  const desc = $('[data-ind-desc]', root);
  const link = $<HTMLAnchorElement>('[data-ind-link]', root);
  const num = $('.ind__num', root);
  if (!panel || !title || !desc || !link || !num) return;

  const select = (i: number, focus = false) => {
    const tab = tabs[i];
    if (!tab) return;
    tabs.forEach((t, n) => {
      t.setAttribute('aria-selected', String(n === i));
      t.tabIndex = n === i ? 0 : -1;
    });
    title.textContent = tab.dataset.title ?? '';
    desc.textContent = tab.dataset.desc ?? '';
    link.href = tab.dataset.href ?? '#';
    num.textContent = String(i + 1).padStart(2, '0');
    panel.setAttribute('aria-labelledby', tab.id);
    if (focus) tab.focus();
    root.dispatchEvent(new CustomEvent('ind-change', { bubbles: true }));
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const n = tabs.length;
      const key = e.key;
      let next = -1;
      if (key === 'ArrowDown' || key === 'ArrowRight') next = (i + 1) % n;
      else if (key === 'ArrowUp' || key === 'ArrowLeft') next = (i - 1 + n) % n;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = n - 1;
      if (next >= 0) {
        e.preventDefault();
        select(next, true);
        tabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
  });
}
