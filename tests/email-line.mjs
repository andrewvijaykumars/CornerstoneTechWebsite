// Every visible email address must render on a single line and fit its box: node tests/email-line.mjs  (server on :4321)
import { chromium } from '@playwright/test';

const widths = [3840, 1920, 1366, 1024, 960, 900, 820, 768, 600, 480, 430, 390, 375, 360, 320];
const pages = ['/', '/contact/', '/about/', '/privacy/', '/terms/', '/services/cloud-devops/'];
const browser = await chromium.launch({ channel: 'msedge' });
const out = [];
let checked = 0;
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(`http://localhost:4321${p}`);
    await page.evaluate(() => document.querySelectorAll('[data-faq] .faq__q').forEach((b) => b.click()));
    await page.waitForTimeout(250);
    const res = await page.evaluate(() => {
      const bad = [];
      let n = 0;
      const nodes = [...document.querySelectorAll('.email-line')];
      for (const el of nodes) {
        const rects = el.getClientRects();
        if (!rects.length || !el.offsetParent) continue;
        n++;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6;
        const inner = r.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        const box = el.parentElement.getBoundingClientRect();
        if (rects.length > 1 || inner > lh * 1.5) bad.push(`wraps (${rects.length} rects, h ${Math.round(inner)})`);
        if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) bad.push(`clipped (${el.scrollWidth} > ${el.clientWidth})`);
        if (r.right > innerWidth + 0.5 || r.left < -0.5) bad.push(`outside viewport (${Math.round(r.left)}..${Math.round(r.right)} of ${innerWidth})`);
        if (r.width > box.width + 1) bad.push(`wider than parent (${Math.round(r.width)} > ${Math.round(box.width)})`);
      }
      return { n, bad, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    checked += res.n;
    res.bad.forEach((b) => out.push(`${w}px ${p}: ${b}`));
    if (res.overflow) out.push(`${w}px ${p}: page scrolls horizontally`);
  }
  await ctx.close();
}
await browser.close();
console.log(out.length ? out.join('\n') : `email-line: ${checked} addresses checked, all on one line`);
