import { $, $$, html, finePointer } from './util';

export function initNav() {
  const nav = $('.nav');
  const toggle = $<HTMLButtonElement>('.nav__toggle');
  const links = $('.nav__links');
  const bar = $<HTMLElement>('.progress span');
  if (!nav) return;

  // Mobile menu
  const setMenu = (open: boolean) => {
    html.classList.toggle('menu-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (links) {
      const mobile = matchMedia('(max-width: 56rem)').matches;
      if (mobile) links.inert = !open;
      else links.inert = false;
    }
  };
  toggle?.addEventListener('click', () => setMenu(!html.classList.contains('menu-open')));
  links?.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && html.classList.contains('menu-open')) {
      setMenu(false);
      toggle?.focus();
    }
  });
  const mq = matchMedia('(max-width: 56rem)');
  const sync = () => setMenu(false);
  sync();
  mq.addEventListener('change', sync);

  // Hide on scroll down, show on scroll up, progress bar
  let lastY = scrollY;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    const dy = y - lastY;
    if (Math.abs(dy) > 6) {
      const hide = dy > 0 && y > 480 && !html.classList.contains('menu-open');
      nav.classList.toggle('is-hidden', hide);
      lastY = y;
    }
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
  };
  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
  update();

  // Sliding hover pill behind desktop links
  const ink = $<HTMLElement>('.nav__ink');
  if (ink && links && finePointer) {
    const anchors = $$<HTMLAnchorElement>('a:not(.btn)', links);
    const move = (a: HTMLElement) => {
      ink.style.opacity = '1';
      ink.style.width = `${a.offsetWidth}px`;
      ink.style.transform = `translate3d(${a.offsetLeft}px,0,0)`;
    };
    anchors.forEach((a) => a.addEventListener('pointerenter', () => move(a)));
    links.addEventListener('pointerleave', () => (ink.style.opacity = '0'));
    anchors.forEach((a) => a.addEventListener('focus', () => move(a)));
    links.addEventListener('focusout', () => (ink.style.opacity = '0'));
    ink.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1), width .45s cubic-bezier(.16,1,.3,1), opacity .25s';
  }
}
