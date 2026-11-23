// Motion probe: scrolls every page with animations on and checks everything ends visible: node tests/motion-probe.mjs
import { chromium } from '@playwright/test';

const pages = ['/', '/services/', '/services/cloud-devops/', '/industries/', '/industries/insurance/', '/about/', '/contact/', '/privacy/'];
const sizes = [[1440, 900], [390, 844]];
const browser = await chromium.launch({ channel: 'msedge' });
const problems = [];
for (const [w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 800, isMobile: w < 800 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => problems.push(`${w} pageerror ${e.message}`));
  page.on('console', (m) => (m.type() === 'error' || /Refused|Content Security/.test(m.text())) && problems.push(`${w} console ${m.text()}`));
  for (const p of pages) {
    await page.goto('http://localhost:4321' + p);
    await page.waitForTimeout(p === '/' ? 4500 : 1500);
    // Scroll gradually so every scroll-triggered animation runs.
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= total; y += Math.round(h * 0.6)) {
      await page.mouse.wheel(0, Math.round(h * 0.6));
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(2200);
    const res = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('.reveal')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none') continue;
        if (Number(cs.opacity) < 0.98) out.push(`reveal not visible: ${el.tagName}.${String(el.className).slice(0, 40)} op=${cs.opacity}`);
      }
      for (const el of document.querySelectorAll('[data-split]')) {
        if (getComputedStyle(el).visibility === 'hidden') out.push(`split heading hidden: ${el.textContent.trim().slice(0, 40)}`);
      }
      if (document.documentElement.scrollWidth > innerWidth + 1) out.push(`h-scroll ${document.documentElement.scrollWidth}`);
      return out.slice(0, 8);
    });
    res.forEach((r) => problems.push(`${w} ${p} ${r}`));
  }
  // Hero chars after intro and rotator cycling
  await page.goto('http://localhost:4321/');
  await page.waitForTimeout(6000);
  const hero = await page.evaluate(() => {
    const chars = [...document.querySelectorAll('.hero__title .char, .hero__title .grad')];
    const hidden = chars.filter((c) => Number(getComputedStyle(c).opacity) < 0.98).length;
    return { chars: chars.length, hidden, rot: document.querySelector('.rotator__word')?.textContent };
  });
  await page.waitForTimeout(3500);
  const rot2 = await page.evaluate(() => document.querySelector('.rotator__word')?.textContent);
  console.log(`${w}: hero chars=${hero.chars} hidden=${hero.hidden} rotator "${hero.rot}" -> "${rot2}"`);
  if (hero.hidden) problems.push(`${w} hero chars hidden ${hero.hidden}`);
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join('\n') : 'motion probe: no problems');
