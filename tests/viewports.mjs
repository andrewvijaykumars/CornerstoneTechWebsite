// Viewport stress test for the home page and key pages: node tests/viewports.mjs  (server on :4321)
import { chromium } from '@playwright/test';

const sizes = [
  [3840, 2160], [2560, 1440], [1920, 1080], [1536, 864], [1440, 900], [1366, 768], [1280, 720], [1280, 600],
  [1024, 768], [1024, 600], [820, 1180], [768, 1024], [600, 900], [430, 932], [414, 896], [390, 844], [375, 667], [360, 640], [320, 568],
  [844, 390], [667, 375], [568, 320],
];
const browser = await chromium.launch({ channel: 'msedge' });
const out = [];
for (const [w, h] of sizes) {
  const touch = w < 1024 || h < 500;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch && w < 900 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => out.push(`${w}x${h} pageerror ${e.message}`));
  await page.goto('http://localhost:4321/?globe=force');
  await page.waitForTimeout(4800);
  const m = await page.evaluate(() => {
    const r = (s) => document.querySelector(s)?.getBoundingClientRect();
    const res = [];
    const vw = innerWidth, vh = innerHeight;
    const hero = r('.hero'), content = r('.hero__content'), cue = r('.scroll-cue'), title = r('.hero__title'), rot = r('.rotator'), nav = r('.nav');
    if (hero && hero.height > vh * 1.25 && vh >= 500) res.push(`hero ${Math.round(hero.height)} much taller than viewport ${vh}`);
    if (content && cue && cue.width > 0 && content.bottom > cue.top - 4 && hero.height <= vh + 2) res.push(`hero content (${Math.round(content.bottom)}) collides with scroll cue (${Math.round(cue.top)})`);
    if (title && nav && title.top < nav.bottom - 2) res.push(`hero title under nav (${Math.round(title.top)} < ${Math.round(nav.bottom)})`);
    if (rot && rot.height > parseFloat(getComputedStyle(document.querySelector('.rotator')).fontSize) * 2.6) res.push(`rotator wraps to ${Math.round(rot.height)}px`);
    const cs = [...document.querySelectorAll('.chapter')].filter((c) => getComputedStyle(c).position === 'sticky').map((c) => c.querySelector('.chapter__card').getBoundingClientRect().height);
    const top = nav ? nav.height : 72;
    cs.forEach((ch, i) => { if (ch > vh - top - 8) res.push(`chapter ${i + 1} card ${Math.round(ch)}px taller than usable viewport ${Math.round(vh - top)}`); });
    return res;
  });
  m.forEach((x) => out.push(`${w}x${h}: ${x}`));
  // Showcase pinned content must fit the viewport
  const sc = await page.evaluate(() => {
    const s = document.querySelector('[data-showcase]');
    if (!s) return null;
    const h = s.classList.contains('is-h');
    if (!h) return { pinned: false };
    const kids = [...s.children].map((c) => c.getBoundingClientRect());
    const bottom = Math.max(...kids.map((k) => k.bottom)) - s.getBoundingClientRect().top;
    return { pinned: true, content: Math.round(bottom), vh: innerHeight };
  });
  if (sc?.pinned && sc.content > sc.vh + 2) out.push(`${w}x${h}: pinned showcase content ${sc.content}px exceeds viewport ${sc.vh}px`);
  await ctx.close();
}
await browser.close();
console.log(out.length ? out.join('\n') : 'viewports: no problems');
