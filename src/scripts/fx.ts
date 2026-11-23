import { $, $$, html, reducedMotion, finePointer } from './util';

/** Custom cursor, pointer-tracked glow, 3D tilt, magnetic buttons and click ripples. */
export function initFx() {
  initSpotAndTilt();
  initRipple();
  if (!reducedMotion) initRoll();
  if (finePointer && !reducedMotion) {
    initCursor();
    initMagnetic();
  }
}

// Duplicates each button label so it can roll upwards on hover.
function initRoll() {
  $$<HTMLElement>('.btn > span:first-child').forEach((label) => {
    const text = label.textContent ?? '';
    if (!text.trim() || label.querySelector('.roll')) return;
    label.textContent = '';
    const roll = document.createElement('span');
    roll.className = 'roll';
    const a = document.createElement('span');
    a.textContent = text;
    const b = document.createElement('span');
    b.textContent = text;
    b.setAttribute('aria-hidden', 'true');
    roll.append(a, b);
    label.append(roll);
  });
}

function initCursor() {
  const cursor = $('.cursor');
  const dot = $<HTMLElement>('.cursor__dot');
  const ring = $<HTMLElement>('.cursor__ring');
  const aura = $<HTMLElement>('.cursor__aura');
  if (!cursor || !dot || !ring) return;
  html.classList.add('has-cursor');
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let rx = x;
  let ry = y;
  let ax = x;
  let ay = y;
  let seen = false;
  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        rx = ax = x;
        ry = ay = y;
        seen = true;
      }
      cursor.classList.toggle('is-link', !!(e.target as Element).closest?.('a,button,[role=tab],input,textarea,label,summary'));
    },
    { passive: true },
  );
  addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => (cursor.style.opacity = '0'));
  document.addEventListener('mouseenter', () => (cursor.style.opacity = '1'));
  const loop = () => {
    rx += (x - rx) * 0.2;
    ry += (y - ry) * 0.2;
    ax += (x - ax) * 0.07;
    ay += (y - ay) * 0.07;
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    if (aura) aura.style.transform = `translate3d(${ax}px,${ay}px,0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function initSpotAndTilt() {
  if (!finePointer) return;
  let frame = 0;
  let last: PointerEvent | null = null;
  const settle = (el: HTMLElement) => {
    el.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)';
    el.style.transform = '';
    setTimeout(() => (el.style.transition = ''), 720);
  };
  const run = () => {
    frame = 0;
    const e = last;
    if (!e) return;
    const spot = (e.target as Element).closest?.<HTMLElement>('.spot');
    if (!spot) return;
    const r = spot.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    spot.style.setProperty('--mx', `${px * 100}%`);
    spot.style.setProperty('--my', `${py * 100}%`);
    if (!reducedMotion && spot.classList.contains('tilt')) {
      spot.style.setProperty('--gx', `${px * 100}%`);
      spot.style.setProperty('--gy', `${py * 100}%`);
      spot.style.transition = 'none';
      spot.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 9}deg) rotateY(${(px - 0.5) * 11}deg) translateZ(0)`;
    }
  };
  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      last = e;
      if (!frame) frame = requestAnimationFrame(run);
    },
    { passive: true },
  );
  document.addEventListener(
    'pointerout',
    (e) => {
      const el = (e.target as Element).closest?.<HTMLElement>('.tilt');
      if (el && !el.contains(e.relatedTarget as Node | null)) settle(el);
    },
    { passive: true },
  );
}

function initMagnetic() {
  $$('.magnetic').forEach((el) => {
    let raf = 0;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.4;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transition = 'none';
        el.style.transform = `translate3d(${dx}px,${dy}px,0)`;
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
      el.style.transform = '';
      setTimeout(() => (el.style.transition = ''), 620);
    });
  });
}

function initRipple() {
  if (reducedMotion) return;
  document.addEventListener('pointerdown', (e) => {
    const btn = (e.target as Element).closest?.<HTMLElement>('.btn');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.width = s.style.height = `${size}px`;
    s.style.left = `${e.clientX - r.left - size / 2}px`;
    s.style.top = `${e.clientY - r.top - size / 2}px`;
    btn.append(s);
    setTimeout(() => s.remove(), 750);
  });
}
