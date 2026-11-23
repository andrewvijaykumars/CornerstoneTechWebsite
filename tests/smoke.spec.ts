import { test, expect, type Page } from '@playwright/test';

function collect(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' || /Content Security Policy|Refused to/.test(m.text())) errors.push(`console: ${m.text()}`);
  });
  return errors;
}

test('home renders without errors and reveals content', async ({ page }) => {
  const errors = collect(page);
  await page.goto('/?globe=force');
  await expect(page.locator('html')).toHaveClass(/ready/);
  await expect(page.locator('h1')).toBeVisible();
  await page.waitForTimeout(4500); // preloader + hero intro
  await expect(page.locator('html')).not.toHaveClass(/preload/);
  await expect(page.locator('.hero__canvas')).toHaveClass(/is-ready/, { timeout: 10_000 });
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'test-results/home-hero.png' });
});

test('every page loads', async ({ page, request }) => {
  const errors = collect(page);
  for (const url of ['/services/', '/industries/', '/about/', '/contact/', '/privacy/', '/terms/', '/services/cloud-devops/', '/industries/insurance/']) {
    await page.goto(url);
    await expect(page.locator('h1')).toBeVisible();
  }
  expect((await request.get('/sitemap-index.xml')).ok()).toBeTruthy();
  expect(errors).toEqual([]);
  const missing = await request.get('/nope/');
  expect(missing.status()).toBe(404);
});

test('industries tabs work with keyboard', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-ind] [role=tab]').first().scrollIntoViewIfNeeded();
  await page.locator('[data-ind] [role=tab]').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-ind-title]')).toHaveText('Insurance');
  await page.keyboard.press('End');
  await expect(page.locator('[data-ind-title]')).toHaveText('Automotive & Mobility');
});

test('faq accordion toggles', async ({ page }) => {
  await page.goto('/');
  const q = page.locator('.faq__q').first();
  await q.scrollIntoViewIfNeeded();
  await q.click();
  await expect(q).toHaveAttribute('aria-expanded', 'true');
  await q.click();
  await expect(q).toHaveAttribute('aria-expanded', 'false');
});

test('contact page offers direct email only', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const errors = collect(page);
  await page.goto('/contact/');
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:letsconnect@cornerstonetech.co.in"]').first()).toBeVisible();
  await expect(page.locator('a[href^="mailto:wecare@cornerstonetech.co.in"]').first()).toBeVisible();
  const copy = page.locator('[data-copy]').first();
  await copy.scrollIntoViewIfNeeded();
  await copy.click();
  await expect(copy).toContainText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('letsconnect@cornerstonetech.co.in');
  expect(errors).toEqual([]);
});

test('mobile menu opens and closes', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = collect(page);
  await page.goto('/about/');
  await page.waitForTimeout(800);
  await page.locator('.nav__toggle').tap();
  await expect(page.locator('html')).toHaveClass(/menu-open/);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'test-results/mobile-menu.png' });
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveClass(/menu-open/);
  expect(errors).toEqual([]);
  await ctx.close();
});

test('service worker caches pages for offline use', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForTimeout(1500);
  await context.setOffline(true);
  await page.goto('/services/');
  await expect(page.locator('h1')).toBeVisible();
  await page.goto('/never-visited-page/').catch(() => {});
  await expect(page.locator('h1')).toContainText(/offline|wrong turn/i);
  const styled = await page.evaluate(() => getComputedStyle(document.body).backgroundImage !== 'none' || getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)');
  expect(styled).toBe(true);
  await context.setOffline(false);
});

test('reduced motion shows content immediately', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = collect(page);
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/rm/);
  await expect(page.locator('html')).not.toHaveClass(/preload/);
  await expect(page.locator('.stat strong').first()).toHaveText('12');
  const opacity = await page.locator('.hero__lead').evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe('1');
  expect(errors).toEqual([]);
  await ctx.close();
});
