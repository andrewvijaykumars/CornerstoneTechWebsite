// Layout audit: node tests/overflow.mjs  (static server on :4321 must be running)
import { chromium } from '@playwright/test';

const urls = ['/', '/services/', '/services/cloud-devops/', '/industries/', '/industries/insurance/', '/about/', '/contact/', '/privacy/', '/404.html'];
const sizes = [[320, 640], [768, 1024], [1280, 720], [2560, 1440]];
const browser = await chromium.launch({ channel: 'msedge' });
let problems = 0;
for (const [width, height] of sizes) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(width, 'pageerror', e.message));
  page.on('console', (m) => m.type() === 'error' && console.log(width, 'console', m.text()));
  let first = true;
  for (const u of urls) {
    await page.goto('http://localhost:4321' + u);
    await page.waitForTimeout(first ? 5000 : 1500);
    first = false;
    const r = await page.evaluate(() => {
      const over = document.documentElement.scrollWidth > innerWidth + 1;
      let el = null;
      if (over) {
        for (const e of document.querySelectorAll('body *')) {
          if (e.closest('.marquee, .footer, .ind__list, .aurora, .loader, .cursor')) continue;
          const b = e.getBoundingClientRect();
          if (b.width && b.right > innerWidth + 1) { el = `${e.tagName}.${e.className}`; break; }
        }
      }
      return { over, el, sw: document.documentElement.scrollWidth };
    });
    if (r.over) { problems++; console.log(`OVERFLOW ${width}px ${u} scrollWidth=${r.sw} el=${r.el}`); }
  }
  await ctx.close();
}
await browser.close();
console.log(`audit done, ${problems} overflow problem(s)`);
