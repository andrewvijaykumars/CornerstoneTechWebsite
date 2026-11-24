// Automated layout/link audit: node tests/audit.mjs  (static server on :4321 must be running)
import { chromium } from '@playwright/test';

const base = 'http://localhost:4321';
const browser = await chromium.launch({ channel: 'msedge' });
const issues = [];
const add = (m) => issues.push(m);

// 1) Collect URLs from the sitemap
const sm = await (await fetch(base + '/sitemap-0.xml')).text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://cornerstonetech.co.in', base));
urls.push(base + '/404.html');

// 2) Link + asset crawl
const seen = new Set();
const ctx0 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const p0 = await ctx0.newPage();
for (const u of urls) {
  await p0.goto(u);
  const links = await p0.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  const ids = await p0.$$eval('[id]', (els) => els.map((e) => e.id));
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) add(`dup ids on ${u}: ${[...new Set(dup)].join(',')}`);
  const hs = await p0.$$eval('h1,h2,h3,h4,h5,h6', (h) => h.map((x) => +x.tagName[1]));
  if (hs.filter((x) => x === 1).length !== 1) add(`h1 count ${hs.filter((x) => x === 1).length} on ${u}`);
  for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) add(`heading jump h${hs[i - 1]}->h${hs[i]} on ${u}`);
  for (const l of links) {
    if (/^(mailto:|tel:|https?:)/.test(l)) continue;
    if (l.startsWith('#')) { if (!(await p0.$(l))) add(`missing anchor ${l} on ${u}`); continue; }
    const target = new URL(l, u).href.split('#')[0];
    if (seen.has(target)) continue;
    seen.add(target);
    const r = await fetch(target);
    if (!r.ok) add(`broken link ${l} (${r.status}) on ${u}`);
  }
}
await ctx0.close();

// 3) Per-viewport layout audit (reduced motion so everything is visible)
const sizes = [[320, 640], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];
for (const [w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', hasTouch: w < 1024 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => add(`pageerror ${w}: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && add(`console ${w}: ${m.text()}`));
  for (const u of urls) {
    await page.goto(u);
    await page.waitForTimeout(400);
    const res = await page.evaluate(() => {
      const out = [];
      const vw = innerWidth;
      if (document.documentElement.scrollWidth > vw + 1) out.push(`h-scroll (${document.documentElement.scrollWidth}>${vw})`);
      const skip = '.marquee, .kinetic, .letter__aura, .purpose__halo, .cta__rings, .chapter__glow, .footer__huge, .aurora, .grain, .loader, .cursor, .orbit, .hero__canvas, .ind__list, .ind__orb, .cards[data-track], .toast, .sr-only';
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest(skip)) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        // text clipped by its own box
        if (['hidden', 'clip'].includes(cs.overflowX) && el.scrollWidth > el.clientWidth + 2 && el.children.length === 0 && el.textContent.trim()) out.push(`text clipped: ${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 30)}"`);
        // element sticking out of the viewport horizontally
        if ((r.right > vw + 2 || r.left < -2) && !el.closest('.skip') && cs.position !== 'fixed') out.push(`outside viewport: ${el.tagName}.${String(el.className).slice(0, 40)} [${Math.round(r.left)},${Math.round(r.right)}]`);
        // tap target size on touch widths
        if (vw < 1024 && ['A', 'BUTTON'].includes(el.tagName) && !el.closest('.footer, .crumbs, .prose, .ticks, .hero__chips') ) {
          if (r.height < 24 || r.width < 24) out.push(`small target ${Math.round(r.width)}x${Math.round(r.height)}: ${el.tagName} "${el.textContent.trim().slice(0, 25)}"`);
        }
      }
      return [...new Set(out)].slice(0, 12);
    });
    for (const r of res) add(`${w}px ${u.replace(base, '') || '/'} :: ${r}`);
  }
  await ctx.close();
}
await browser.close();
console.log(issues.length ? issues.join('\n') : 'No issues found');
console.log(`checked ${urls.length} pages, ${seen.size} internal link targets`);
