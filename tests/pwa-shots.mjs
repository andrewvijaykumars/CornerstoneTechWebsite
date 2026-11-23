// Captures install-dialog screenshots for the web manifest: node tests/pwa-shots.mjs (server on :4321 must be running)
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('public/screenshots', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
for (const [name, viewport, extra] of [
  ['home-wide', { width: 1280, height: 720 }, {}],
  ['home-narrow', { width: 540, height: 960 }, { isMobile: true, hasTouch: true }],
]) {
  const ctx = await browser.newContext({ viewport, ...extra });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/?globe=force');
  await page.waitForTimeout(6500);
  const png = await page.screenshot();
  await sharp(png).webp({ quality: 80 }).toFile(`public/screenshots/${name}.webp`);
  await ctx.close();
}
await browser.close();
console.log('done');
