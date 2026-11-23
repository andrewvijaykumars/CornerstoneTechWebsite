// Live header check via a real browser (uses the machine's proxy/trust settings): node tests/live-check.mjs
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'msedge' });
const ctx = await browser.newContext();
const page = await ctx.newPage();
const errs = [];
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
page.on('pageerror', (e) => errs.push(e.message));
const show = ['strict-transport-security', 'content-security-policy', 'x-frame-options', 'x-content-type-options', 'referrer-policy', 'permissions-policy', 'cross-origin-opener-policy', 'cross-origin-resource-policy', 'x-robots-tag'];
for (const u of ['https://cornerstonetech.co.in/', 'https://www.cornerstonetech.co.in/services/', 'http://cornerstonetech.co.in/contact/', 'https://cornerstonetech.co.in/.well-known/security.txt', 'https://cornerstonetech.co.in/nope-404/']) {
  try {
    const r = await page.goto(u, { waitUntil: 'load', timeout: 30000 });
    console.log(r.status(), u, '->', page.url());
    if (u === 'https://cornerstonetech.co.in/') {
      const h = r.headers();
      for (const k of show) console.log('   ' + k + ': ' + (h[k] || 'MISSING').slice(0, 110));
      await page.waitForTimeout(5000);
      console.log('   title:', await page.title(), '| html class:', await page.evaluate(() => document.documentElement.className));
    }
  } catch (e) {
    console.log('ERR', u, e.message.split('\n')[0]);
  }
}
console.log('console errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
