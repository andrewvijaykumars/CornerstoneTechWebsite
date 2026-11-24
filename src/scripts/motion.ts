import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { $, $$, html, reducedMotion, finePointer } from './util';

gsap.registerPlugin(ScrollTrigger, SplitText);

const nearTop = (el: Element) => el.closest('[data-hero]') !== null;
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
let lenis: Lenis | null = null;

/** Intro sequence shown once per session on the home page. Resolves when the page is revealed. */
async function runLoader(): Promise<boolean> {
  const loader = $('.loader');
  if (!loader || !html.classList.contains('preload')) return false;
  const path = $('.loader__path', loader);
  const fill = $('.loader__fill', loader);
  const barBox = $('.loader__bar', loader);
  const bar = $('.loader__bar span', loader);
  const mark = $('.loader__mark', loader);
  const word = $('.loader__word', loader);
  await new Promise<void>((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem('cs-seen', '1');
        } catch {
          /* private mode */
        }
        html.classList.remove('preload');
        loader.remove();
        resolve();
      },
    });
    tl.to(path, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, 0)
      .to(bar, { scaleX: 1, duration: 1.5, ease: 'power1.inOut' }, 0)
      .fromTo(word, { opacity: 0, y: 10, letterSpacing: '1em' }, { opacity: 1, y: 0, letterSpacing: '0.5em', duration: 1.1, ease: 'power3.out' }, 0.2)
      .to(fill, { opacity: 0.9, duration: 0.5 }, 1.1)
      .to(mark, { scale: 1.12, rotate: 60, duration: 0.6, ease: 'power3.inOut' }, 1.15)
      .to([mark, word, barBox], { opacity: 0, y: -18, duration: 0.45, ease: 'power2.in', stagger: 0.05 }, 1.75)
      .to(loader, { clipPath: 'circle(0% at 50% 50%)', duration: 1, ease: 'power4.inOut' }, 2.05);
  });
  return true;
}

function splitHeadings() {
  const heroTweens: gsap.core.Tween[] = [];
  const splitLines = (el: HTMLElement) =>
    SplitText.create(el, {
      type: 'lines',
      linesClass: 'line',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        el.style.visibility = 'visible';
        return gsap.from(self.lines, { yPercent: 110, rotate: 2.5, duration: 1.15, ease: 'expo.out', stagger: 0.11, clearProps: 'transform' });
      },
    });
  const splitChars = (el: HTMLElement) =>
    SplitText.create(el, {
      type: 'words,chars',
      wordsClass: 'word',
      charsClass: 'char',
      ignore: '.grad',
      onSplit(self) {
        el.style.visibility = 'visible';
        const tween = gsap.from([...self.chars, ...$$('.grad', el)], {
          yPercent: 90,
          rotateX: -95,
          opacity: 0,
          filter: 'blur(8px)',
          transformOrigin: '50% 100% -20px',
          duration: 1.25,
          ease: 'expo.out',
          stagger: { each: 0.028, from: 'start' },
          clearProps: 'transform,filter',
          paused: true,
        });
        heroTweens.push(tween);
        return tween;
      },
    });
  const others: HTMLElement[] = [];
  $$<HTMLElement>('[data-split]').forEach((el) => {
    if (el.dataset.split === 'chars') splitChars(el);
    else if (nearTop(el)) splitLines(el);
    else others.push(el);
  });
  // Split remaining headings only as they approach the viewport.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        splitLines(e.target as HTMLElement);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  others.forEach((el) => io.observe(el));
  return heroTweens;
}

function initReveals() {
  const items = $$<HTMLElement>('.reveal').filter((el) => !nearTop(el));
  let queue: HTMLElement[] = [];
  let timer = 0;
  const is3d = (el: Element) => el.matches('.card, .model, .chapter__card, .mail-card, .stat, .why__list > li, .value, .aside__box, .pager a');
  const flush = () => {
    timer = 0;
    const batch = queue.sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return Math.round(ra.top / 40) - Math.round(rb.top / 40) || ra.left - rb.left;
    });
    queue = [];
    batch.forEach((b) => b.classList.add('in-view'));
    const flat = batch.filter((b) => !is3d(b));
    const deep = batch.filter(is3d);
    if (flat.length)
      gsap.fromTo(flat, { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true,
        onComplete() {
          flat.forEach((b) => b.classList.add('is-in'));
          gsap.set(flat, { clearProps: 'opacity,transform' });
        },
      });
    if (deep.length)
      gsap.fromTo(deep, { opacity: 0, y: 80, rotateX: 18, scale: 0.94, transformPerspective: 1200, transformOrigin: '50% 0%' }, {
        opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.3, ease: 'expo.out', stagger: 0.09, overwrite: true,
        onComplete() {
          deep.forEach((b) => b.classList.add('is-in'));
          gsap.set(deep, { clearProps: 'opacity,transform' });
        },
      });
  };
  // Cards hidden inside a horizontal scroller are clipped by it, so reveal them with their track.
  const groups = new Map<Element, HTMLElement[]>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const group = groups.get(e.target);
        if (group) queue.push(...group);
        else queue.push(e.target as HTMLElement);
        io.unobserve(e.target);
      }
      if (queue.length && !timer) timer = window.setTimeout(flush, 60);
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  items.forEach((el) => {
    const track = el.closest<HTMLElement>('[data-track]');
    if (track && getComputedStyle(track).overflowX === 'auto') {
      if (!groups.has(track)) {
        groups.set(track, []);
        io.observe(track);
      }
      groups.get(track)!.push(el);
    } else io.observe(el);
  });
}

function initScrub() {
  $$<HTMLElement>('[data-scrub]').forEach((el) => {
    const text = el.textContent?.trim() ?? '';
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const words = text.split(/\s+/).map((w, i, a) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = w;
      el.append(s);
      if (i < a.length - 1) el.append(' ');
      return s;
    });
    gsap.fromTo(words, { opacity: 0.12, y: 14, filter: 'blur(4px)' }, {
      opacity: 1, y: 0, filter: 'blur(0px)', ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: 0.6 },
    });
  });
}

function initCounters() {
  $$<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const obj = { v: 0 };
    el.textContent = `0${suffix}`;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: end,
          duration: 2.4,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = `${Math.round(obj.v)}${suffix}`),
        }),
    });
  });
}

function initShowcase() {
  const section = $('[data-showcase]');
  const track = section && $<HTMLElement>('[data-track]', section);
  const bar = section && $<HTMLElement>('.showcase__bar span', section);
  if (!section || !track) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 64rem) and (min-height: 45rem) and (hover: hover)', () => {
    section.classList.add('is-h');
    const cards = $$<HTMLElement>('.card', track);
    const dist = () => Math.max(0, track.scrollWidth - innerWidth + 80);
    const tween = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 0.8,
        start: 'top top',
        end: () => `+=${dist()}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress }),
      },
    });
    // Cards lean in as they travel across the screen.
    cards.forEach((card) => {
      gsap.fromTo(card, { rotateY: -16, z: -80, transformPerspective: 1200 }, {
        rotateY: 10, z: 0, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
    });
    return () => section.classList.remove('is-h');
  });
}

function initChapters() {
  const root = $('[data-chapters]');
  if (!root) return;
  const items = $$<HTMLElement>('.chapter', root);
  items.forEach((item, i) => {
    const card = $<HTMLElement>('.chapter__card', item);
    const next = items[i + 1];
    if (!card) return;
    gsap.fromTo($$('.chapter__body > *', card), { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: card, start: 'top 75%', once: true },
    });
    const num = $('.chapter__num', card);
    if (num) gsap.fromTo(num, { yPercent: 40, opacity: 0 }, { yPercent: -10, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 20%', scrub: true } });
    // As the next chapter slides over, this one recedes (only where the cards actually stack).
    if (next)
      gsap.matchMedia().add('(min-height: 46rem) and (min-width: 22.5rem)', () => {
        gsap.to(card, {
          scale: 0.9,
          '--shade': 0.65,
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 25%', scrub: true },
        });
      });
  });
}

function initKinetic() {
  $$<HTMLElement>('[data-kinetic]').forEach((row) => {
    const dir = Number(row.dataset.kinetic) || 1;
    const inner = row.firstElementChild as HTMLElement | null;
    if (!inner) return;
    gsap.fromTo(inner, { xPercent: dir > 0 ? -30 : 0 }, {
      xPercent: dir > 0 ? 0 : -30,
      ease: 'none',
      scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
    });
  });
}

function initSkew() {
  const els = $$<HTMLElement>('[data-skew]');
  if (!els.length || !lenis) return;
  const setters = els.map((el) => gsap.quickTo(el, 'skewX', { duration: 0.6, ease: 'power3.out' }));
  lenis.on('scroll', ({ velocity }: { velocity: number }) => {
    const s = gsap.utils.clamp(-10, 10, velocity * -0.35);
    setters.forEach((set) => set(s));
  });
}

function initIndustriesMotion() {
  const root = $('[data-ind]');
  if (!root) return;
  const parts = ['[data-ind-title]', '[data-ind-desc]', '[data-ind-link]'].map((s) => $(s, root)).filter(Boolean) as HTMLElement[];
  const num = $('.ind__num', root);
  const orb = $('.ind__orb', root);
  root.addEventListener('ind-change', () => {
    gsap.fromTo(parts, { y: 26, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out', stagger: 0.07, overwrite: true });
    if (num) gsap.fromTo(num, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out', overwrite: true });
    if (orb) gsap.fromTo(orb, { scale: 0.7 }, { scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.6)', overwrite: true });
  });
}

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz';

function scrambleTo(el: HTMLElement, text: string, duration = 0.9) {
  const from = el.textContent ?? '';
  const len = Math.max(from.length, text.length);
  const state = { p: 0 };
  gsap.to(state, {
    p: 1,
    duration,
    ease: 'power2.out',
    onUpdate() {
      let out = '';
      for (let i = 0; i < len; i++) {
        const settle = (i / len) * 0.7 + 0.3;
        if (state.p >= settle) out += text[i] ?? '';
        else if (text[i] === ' ' || text[i] === '.') out += text[i];
        else if (i < text.length) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
    },
    onComplete: () => (el.textContent = text),
  });
}

function initRotator() {
  const root = $('[data-rotator]');
  if (!root) return;
  const words = $$<HTMLElement>('.rotator__word', root).map((w) => w.textContent ?? '');
  const live = $$<HTMLElement>('.rotator__word', root)[0];
  if (!live || words.length < 2) return;
  root.classList.add('is-live');
  let i = 0;
  gsap.delayedCall(2.6, function tick() {
    if (!document.hidden) {
      i = (i + 1) % words.length;
      scrambleTo(live, words[i]);
    }
    gsap.delayedCall(2.8, tick);
  });
}

function initHeroPointer() {
  const hero = $('[data-hero]');
  if (!hero || !finePointer) return;
  const spot = $<HTMLElement>('.hero__spot', hero);
  const depth = $$<HTMLElement>('[data-depth]', hero);
  const xTo = depth.map((d) => gsap.quickTo(d, 'x', { duration: 1.2, ease: 'power3.out' }));
  const yTo = depth.map((d) => gsap.quickTo(d, 'y', { duration: 1.2, ease: 'power3.out' }));
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    spot?.style.setProperty('--hx', `${px * 100}%`);
    spot?.style.setProperty('--hy', `${py * 100}%`);
    depth.forEach((d, k) => {
      const f = Number(d.dataset.depth) || 0.3;
      xTo[k]((px - 0.5) * -40 * f);
      yTo[k]((py - 0.5) * -40 * f);
    });
  });
}

function initParallax() {
  const hero = $('[data-hero]');
  const content = hero && $('.hero__content', hero);
  if (hero && content) {
    gsap.to(content, {
      yPercent: -18,
      opacity: 0,
      scale: 0.96,
      filter: 'blur(6px)',
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 15%', scrub: true },
    });
  }
  $$<HTMLElement>('.section-head').forEach((head) => {
    if (nearTop(head)) return;
    gsap.fromTo(head, { y: 30 }, { y: -30, ease: 'none', scrollTrigger: { trigger: head, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  const huge = $<HTMLElement>('.footer__huge');
  if (huge) {
    const split = SplitText.create(huge, { type: 'chars', charsClass: 'fchar' });
    gsap.from(split.chars, {
      yPercent: 100,
      opacity: 0,
      rotate: 8,
      ease: 'none',
      stagger: 0.06,
      scrollTrigger: { trigger: '.footer', start: 'top 95%', end: 'bottom bottom', scrub: 0.6 },
    });
  }
}

function initSmoothScroll() {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, anchors: { offset: -72 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // Pause smooth scrolling while the mobile menu is open.
  new MutationObserver(() => (html.classList.contains('menu-open') ? lenis?.stop() : lenis?.start())).observe(html, { attributes: true, attributeFilter: ['class'] });
}

function staticState() {
  $$<HTMLElement>('.rotator__word').forEach((w, i) => (w.style.display = i === 0 ? '' : 'none'));
}

export async function initMotion(onHeroReady: () => void) {
  if (reducedMotion) {
    html.classList.add('ready');
    staticState();
    onHeroReady();
    return;
  }

  initSmoothScroll();
  const heroTweens = splitHeadings();
  initShowcase();
  html.classList.add('ready');
  // Spread the remaining set-up over several tasks so the main thread stays responsive.
  await yieldToMain();
  initReveals();
  initScrub();
  await yieldToMain();
  initCounters();
  initChapters();
  initKinetic();
  initSkew();
  initIndustriesMotion();
  initParallax();
  initHeroPointer();

  const showLoader = await runLoader();

  // Hero intro (home page only)
  const heroEls = $$('.hero .reveal');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  heroTweens.forEach((t, i) => tl.add(t.play(0), i * 0.1));
  if (heroEls.length) {
    tl.fromTo(
      heroEls,
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        stagger: 0.12,
        onComplete() {
          heroEls.forEach((e) => e.classList.add('is-in', 'in-view'));
          gsap.set(heroEls, { clearProps: 'opacity,transform,filter' });
        },
      },
      0.45,
    );
  }
  if (showLoader) tl.fromTo('.nav', { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, clearProps: 'transform,opacity' }, 0.3);
  initRotator();
  onHeroReady();
  ScrollTrigger.refresh();
}
