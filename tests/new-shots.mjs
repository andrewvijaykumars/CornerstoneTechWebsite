// Screenshot new sections: node tests/new-shots.mjs  (server on :4321)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.env.TEMP || '.', 'cs-new');
mkdirSync(dir, { recursive: true });
const shots = [
  ['/', '#purpose', 'purpose'],
  ['/', '#finder', 'finder'],
  ['/about/', '#purpose', 'about-purpose'],
  ['/contact/', '.steps', 'contact-steps'],
  ['/contact/', '.letter', 'contact-letter'],
  ['/services/cloud-devops/', '.steps', 'svc-steps'],
  ['/', '.footer', 'footer'],
  ['/', '.cta', 'cta'],
];
const browser = await chromium.launch({ channel: 'msedge' });
for (const [w, h, tag] of [[1440, 900, 'desk'], [390, 844, 'mob'], [320, 640, 'xs']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [p, sel, name] of shots) {
    await page.goto(`http://localhost:4321${p}`);
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await el.screenshot({ path: path.join(dir, `${tag}-${name}.png`) });
  }
  if (tag === 'mob') {
    await page.goto('http://localhost:4321/');
    await page.evaluate(() => scrollTo(0, innerHeight * 2.2));
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(dir, `mob-dock.png`) });
  }
  await ctx.close();
}
await browser.close();
console.log('shots in', dir);
