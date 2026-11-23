// Visual review helper: node tests/shots.mjs  (requires dist build + node scripts/serve.mjs running)
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('test-results/shots', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });

async function run(name, viewport, steps, extra = {}) {
  const ctx = await browser.newContext({ viewport, ...extra });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(name, 'pageerror', e.message));
  page.on('console', (m) => m.type() === 'error' && console.log(name, 'console', m.text()));
  await page.goto('http://localhost:4321/?globe=force');
  await page.waitForTimeout(5000);
  let i = 0;
  for (const sel of steps) {
    if (sel) {
      await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel);
      await page.waitForTimeout(1800);
    }
    await page.screenshot({ path: `test-results/shots/${name}-${String(i++).padStart(2, '0')}.png` });
  }
  await ctx.close();
}

const sections = [null, '#marquee', '.manifesto', '.kinetic', '#journey', '.chapter:nth-child(2)', '.chapter:nth-child(4)', '#services', '.stats', '#industries', '#together', '#promises', '#faq', '.cta', '.footer'];
await run('desk', { width: 1440, height: 900 }, sections);
await run('mob', { width: 390, height: 844 }, [null, '.kinetic', '#journey', '.chapter:nth-child(3)', '#services', '#industries', '.cta', '.footer'], { isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await run('tv', { width: 1920, height: 1080 }, [null, '#services']);
await browser.close();
console.log('done');
