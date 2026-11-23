// Full-page review shots (reduced motion so every section is visible): node tests/review.mjs [desk|tab|mob] [path...]
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';

const vps = {
  desk: { viewport: { width: 1440, height: 900 }, chunk: 1100, ctx: {} },
  tab: { viewport: { width: 820, height: 1180 }, chunk: 1400, ctx: { hasTouch: true } },
  mob: { viewport: { width: 390, height: 844 }, chunk: 1500, ctx: { hasTouch: true, isMobile: true } },
  tv: { viewport: { width: 1920, height: 1080 }, chunk: 1300, ctx: {} },
};
const [, , vpName = 'desk', ...rest] = process.argv;
const paths = rest.length ? rest : ['/', '/services/', '/services/cloud-devops/', '/industries/', '/industries/insurance/', '/about/', '/contact/', '/privacy/', '/404.html'];
const vp = vps[vpName];
const out = 'test-results/review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
const ctx = await browser.newContext({ viewport: vp.viewport, reducedMotion: 'reduce', ...vp.ctx });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
page.on('console', (m) => m.type() === 'error' && console.log('console', m.text()));
for (const p of paths) {
  const name = (p === '/' ? 'home' : p.replace(/\W+/g, '_').replace(/^_|_$/g, '')) + '-' + vpName;
  await page.goto('http://localhost:4321' + p + (p === '/' ? '?globe=force' : ''));
  await page.waitForTimeout(1500);
  const buf = await page.screenshot({ fullPage: true });
  const meta = await sharp(buf).metadata();
  const n = Math.ceil(meta.height / vp.chunk);
  for (let i = 0; i < n; i++) {
    const top = i * vp.chunk;
    await sharp(buf).extract({ left: 0, top, width: meta.width, height: Math.min(vp.chunk, meta.height - top) }).toFile(`${out}/${name}-${i}.png`);
  }
  console.log(name, meta.width + 'x' + meta.height, n + ' chunks');
}
await browser.close();
