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

// Back-to-top button and the mobile quick-contact dock. Both step aside when the page's own contact area is on screen.
export function initDock() {
  const top = $<HTMLElement>('.to-top');
  const dock = $<HTMLElement>('.dock');
  if (!top && !dock) return;
  const blockers = $$('.cta-wrap, .footer, .letter');
  let blocked = false;
  if ('IntersectionObserver' in window && blockers.length) {
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      blocked = seen.size > 0;
      sync();
    });
    blockers.forEach((b) => io.observe(b));
  }
  const set = (el: HTMLElement | null, on: boolean) => {
    if (!el) return;
    el.classList.toggle('is-on', on);
    el.inert = !on;
  };
  const sync = () => {
    const y = scrollY;
    const menu = html.classList.contains('menu-open');
    set(top, y > innerHeight * 1.2 && !menu);
    set(dock, y > innerHeight * 0.6 && !blocked && !menu);
    html.classList.toggle('dock-on', !!dock?.classList.contains('is-on'));
  };
  let ticking = false;
  addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        sync();
      });
    },
    { passive: true },
  );
  new MutationObserver(sync).observe(html, { attributes: true, attributeFilter: ['class'] });
  top?.addEventListener('click', () => setTimeout(() => $<HTMLElement>('.brand')?.focus({ preventScroll: true }), 900));
  sync();
}
