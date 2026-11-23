import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { $, $$, html, reducedMotion } from './util';

gsap.registerPlugin(ScrollTrigger, SplitText);

const nearTop = (el: Element) => el.closest('[data-hero]') !== null;
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

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
      .fromTo(word, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
      .to(fill, { opacity: 0.9, duration: 0.5 }, 1.1)
      .to(mark, { scale: 1.12, duration: 0.5, ease: 'power2.out' }, 1.2)
      .to([mark, word, barBox], { opacity: 0, y: -18, duration: 0.45, ease: 'power2.in', stagger: 0.05 }, 1.7)
      .to(loader, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 2.05);
  });
  return true;
}

function splitHeadings() {
  const heroTweens: gsap.core.Tween[] = [];
  const split = (el: HTMLElement, hero: boolean) =>
    SplitText.create(el, {
      type: 'lines',
      linesClass: 'line',
      autoSplit: true,
      onSplit(self) {
        el.style.visibility = 'visible';
        const tween = gsap.from(self.lines, {
          yPercent: 55,
          opacity: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.12,
          clearProps: 'transform,opacity',
          paused: hero,
        });
        if (hero) heroTweens.push(tween);
        return tween;
      },
    });
  const others: HTMLElement[] = [];
  $$<HTMLElement>('[data-split]').forEach((el) => (nearTop(el) ? split(el, true) : others.push(el)));
  // Split the remaining headings only as they approach the viewport.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        split(e.target as HTMLElement, false);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  others.forEach((el) => io.observe(el));
  return heroTweens;
}

function initReveals() {
  const items = $$<HTMLElement>('.reveal').filter((el) => !nearTop(el));
  let queue: HTMLElement[] = [];
  let timer = 0;
  const flush = () => {
    timer = 0;
    const batch = queue.sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return Math.round(ra.top / 40) - Math.round(rb.top / 40) || ra.left - rb.left;
    });
    queue = [];
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.09,
      overwrite: true,
      onComplete() {
        batch.forEach((b) => b.classList.add('is-in'));
        gsap.set(batch, { clearProps: 'opacity,transform' });
      },
    });
  };
  // IntersectionObserver is much cheaper than one ScrollTrigger per element.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        queue.push(e.target as HTMLElement);
        io.unobserve(e.target);
      }
      if (queue.length && !timer) timer = window.setTimeout(flush, 70);
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  items.forEach((el) => io.observe(el));
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
    gsap.to(words, {
      opacity: 1,
      ease: 'none',
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: true },
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
          duration: 2.2,
          ease: 'power3.out',
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
    const dist = () => Math.max(0, track.scrollWidth - innerWidth + 80);
    gsap.to(track, {
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
    return () => section.classList.remove('is-h');
  });
}

function initTimeline() {
  const tl = $('[data-timeline]');
  const line = tl && $<HTMLElement>('.timeline__line span', tl);
  if (!tl || !line) return;
  const steps = $$('.step', tl);
  const vertical = matchMedia('(max-width: 52rem)');
  ScrollTrigger.create({
    trigger: tl,
    start: 'top 75%',
    end: 'bottom 65%',
    scrub: 0.5,
    onUpdate: ({ progress: p }) => {
      if (vertical.matches) gsap.set(line, { scaleY: p, scaleX: 1 });
      else gsap.set(line, { scaleX: p, scaleY: 1 });
      steps.forEach((s, i) => s.classList.toggle('is-on', p >= i / steps.length + 0.02 || (i === 0 && p > 0)));
    },
  });
}

function initIndustriesMotion() {
  const root = $('[data-ind]');
  if (!root) return;
  const parts = ['[data-ind-title]', '[data-ind-desc]', '[data-ind-link]'].map((s) => $(s, root)).filter(Boolean) as HTMLElement[];
  const num = $('.ind__num', root);
  root.addEventListener('ind-change', () => {
    gsap.fromTo(parts, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07, overwrite: true });
    if (num) gsap.fromTo(num, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', overwrite: true });
  });
}

function initRotator() {
  const root = $('[data-rotator]');
  if (!root) return;
  const words = $$<HTMLElement>('.rotator__word', root);
  if (words.length < 2) return;
  gsap.set(words, { autoAlpha: 0, yPercent: 100 });
  gsap.set(words[0], { autoAlpha: 1, yPercent: 0 });
  let i = 0;
  const swap = () => {
    const out = words[i];
    i = (i + 1) % words.length;
    const next = words[i];
    out.setAttribute('aria-hidden', 'true');
    next.removeAttribute('aria-hidden');
    gsap.to(out, { yPercent: -100, autoAlpha: 0, duration: 0.7, ease: 'power3.inOut' });
    gsap.fromTo(next, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.inOut' });
  };
  gsap.delayedCall(2.4, function tick() {
    if (!document.hidden) swap();
    gsap.delayedCall(2.6, tick);
  });
}

function initParallax() {
  const hero = $('[data-hero]');
  const content = hero && $('.hero__content', hero);
  if (hero && content) {
    gsap.to(content, {
      yPercent: -12,
      opacity: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 20%', scrub: true },
    });
  }
  const huge = $('.footer__huge');
  if (huge) {
    gsap.from(huge, {
      yPercent: 45,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.footer', start: 'top 95%', end: 'bottom bottom', scrub: true },
    });
  }
}

function initSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -72 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // Pause smooth scrolling while the mobile menu is open.
  new MutationObserver(() => (html.classList.contains('menu-open') ? lenis.stop() : lenis.start())).observe(html, { attributes: true, attributeFilter: ['class'] });
  return lenis;
}

function staticState() {
  // Motion disabled: show every end state immediately.
  $$('.timeline .step').forEach((s) => s.classList.add('is-on'));
  const line = $<HTMLElement>('.timeline__line span');
  if (line) line.style.transform = 'none';
  $$<HTMLElement>('.rotator__word').forEach((w, i) => (w.style.visibility = i === 0 ? 'visible' : 'hidden'));
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
  initTimeline();
  initIndustriesMotion();
  initParallax();

  const showLoader = await runLoader();

  // Hero intro (home page only)
  const heroEls = $$('.hero .reveal');
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTweens.forEach((t, i) => tl.add(t.play(0), i * 0.1));
  if (heroEls.length) {
    tl.fromTo(
      heroEls,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        onComplete() {
          heroEls.forEach((e) => e.classList.add('is-in'));
          gsap.set(heroEls, { clearProps: 'opacity,transform' });
        },
      },
      0.35,
    );
  }
  if (showLoader) tl.fromTo('.nav', { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, clearProps: 'transform,opacity' }, 0.2);
  initRotator();
  onHeroReady();
  ScrollTrigger.refresh();
}
