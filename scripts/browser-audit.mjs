import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Browser tooling is optional and kept out of the production dependency graph.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.argv[2] || 'http://127.0.0.1:3102';
const browser = await chromium.launch({ headless: true });
const errors = [];
const reports = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const paths = [...sitemap.matchAll(/<loc>https:\/\/[^/]+([^<]+)<\/loc>/g)].map(match => match[1]);
  for (const path of paths) {
    const locale = path.split('/')[1];
    assert.equal((await page.goto(base + path)).status(), 200);
    await page.locator('h1').waitFor();
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('html').getAttribute('lang'), locale);
    assert.equal(await page.locator('html').getAttribute('dir'), locale === 'ar' ? 'rtl' : 'ltr');
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path}: overflow at ${width}px`);
    }
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(async element => { try { await element.decode(); } catch {} });
      assert.ok(await image.evaluate(element => element.naturalWidth > 0), `${path}: ${await image.getAttribute('src')}`);
      assert.notEqual(await image.getAttribute('alt'), null);
    }
    const other = locale === 'ar' ? 'en' : 'ar';
    const target = path.replace(`/${locale}`, `/${other}`);
    const switcher = page.locator('.languageButton');
    assert.equal(await switcher.getAttribute('href'), target);
    await switcher.click();
    await page.waitForURL(base + target);
    assert.equal(await page.locator('html').getAttribute('lang'), other);
    reports.push({ path, viewports: [390, 1440], images: 'decoded', languageSwitch: 'passed' });
  }
  for (const locale of ['ar', 'en']) {
    await page.goto(`${base}/${locale}`);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.mobileMenuButton').click();
    await page.getByRole('dialog').waitFor();
    await page.locator('.mobileMenuButton').click();
    assert.equal(await page.getByRole('dialog').count(), 0);
    const thumbs = page.locator('.projectCard').first().locator('.thumb');
    await thumbs.nth(1).click();
    assert.equal(await thumbs.nth(1).getAttribute('aria-pressed'), 'true');
    await page.locator('.phoneButton').first().click();
    await page.locator('.lightbox').waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.lightbox').count(), 0);
    await page.evaluate(() => {
      window.__contactEvents = [];
      window.addEventListener('portfolio:contact-intent', event => window.__contactEvents.push(event.detail));
      // Prevent the test from opening the native mail client.
      document.addEventListener('click', event => { if (event.target.closest?.('a[href^="mailto:"]')) event.preventDefault(); });
    });
    await page.locator('a[href^="mailto:"]').first().click();
    assert.equal(await page.evaluate(() => window.__contactEvents[0].contact_method), 'email');
    assert.equal(await page.evaluate(() => Object.keys(window.__contactEvents[0]).sort().join(',')), 'contact_method,event,page_language,page_path');
    await page.locator('.formSubmit').click();
    assert.ok((await page.locator('.formStatus').textContent()).length > 10);
    await page.locator('input[autocomplete=name]').fill('SEO test');
    await page.locator('input[type=email]').fill('bad-email');
    await page.locator('textarea').fill('Local validation test');
    await page.locator('.formSubmit').click();
    assert.match(await page.locator('.formStatus').textContent(), locale === 'ar' ? /صحيح/ : /valid/);
    await page.locator('.themeWrap > button').click();
    await page.locator('.themeMenu button').filter({ hasText: locale === 'ar' ? 'داكن' : 'Dark' }).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.goto(`${base}/${locale}/expertise/flutter-mobile-development`);
    await page.screenshot({ path: `docs/seo/${locale}-expertise-mobile.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: `docs/seo/${locale}-expertise-desktop.png`, fullPage: true });
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync('docs/seo/browser-results.json', JSON.stringify({ pages: reports, errors, interactions: ['EN/AR switching on 14 pages', 'Mobile menus', 'Screenshot selector', 'Lightbox/Escape', 'Empty/invalid-email form validation', 'Dark theme'], dataSource: 'Repository defaults; no live CMS credentials' }, null, 2));
  console.log(`PASS: ${reports.length} pages, 2 widths, all images decoded, language switching and interactive checks; no browser exceptions.`);
} finally { await browser.close(); }
