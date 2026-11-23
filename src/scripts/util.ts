export const html = document.documentElement;
export const reducedMotion = html.classList.contains('rm');
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

export function toast(message: string, actionLabel?: string, action?: () => void, ms = 0) {
  const el = $('.toast');
  if (!el) return;
  el.hidden = false;
  el.replaceChildren();
  const text = document.createElement('span');
  text.textContent = message;
  el.append(text);
  const close = () => {
    el.classList.remove('is-open');
  };
  if (actionLabel && action) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = actionLabel;
    b.addEventListener('click', () => {
      action();
      close();
    });
    el.append(b);
  }
  const x = document.createElement('button');
  x.type = 'button';
  x.setAttribute('aria-label', 'Dismiss');
  x.textContent = '×';
  x.addEventListener('click', close);
  el.append(x);
  requestAnimationFrame(() => el.classList.add('is-open'));
  if (ms) setTimeout(close, ms);
}
