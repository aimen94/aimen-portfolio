import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const engine = process.env.BROWSER_ENGINE || 'chromium';
assert.ok(['chromium', 'webkit', 'firefox'].includes(engine), 'supported browser engine');
const base = process.argv[2] || 'http://localhost:3000';
const widths = [320, 360, 390, 430, 600, 768, 820, 980, 981, 1024, 1280, 1440, 1920, 2560];
const browser = await playwright[engine].launch({ headless: true });
const errors = [];
let layoutChecks = 0;
let menuChecks = 0;
try {
  const page = await browser.newPage({ hasTouch: true });
  page.on('pageerror', error => errors.push(error.message));
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const paths = [...sitemap.matchAll(/<loc>https:\/\/[^/]+([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.equal(paths.length, 14);
  for (const path of [...paths, '/admin']) {
    assert.equal((await page.goto(base + path, { waitUntil: 'networkidle' })).status(), 200, path);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const layout = await page.evaluate(() => {
        const brand = document.querySelector('.brand')?.getBoundingClientRect();
        const actions = document.querySelector('.headerActions')?.getBoundingClientRect();
        const nav = document.querySelector('.desktopNav')?.getBoundingClientRect();
        const rtl = document.documentElement.dir === 'rtl';
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          headerOverlap: brand && actions && nav?.width > 0 && (rtl
            ? actions.right > nav.left + 1 || nav.right > brand.left + 1
            : brand.right > nav.left + 1 || nav.right > actions.left + 1),
        };
      });
      assert.equal(layout.overflow, false, `${path}: overflow at ${width}px`);
      assert.ok(!layout.headerOverlap, `${path}: header overlap at ${width}px`);
      layoutChecks++;
    }
    await page.waitForLoadState('networkidle');
  }
  for (const locale of ['en', 'ar']) {
    for (const theme of ['light', 'dark']) {
      for (const [width, height] of [[320, 568], [390, 844], [600, 800], [768, 1024], [820, 1180], [980, 720], [844, 390]]) {
        await page.setViewportSize({ width, height });
        await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
        await page.evaluate(theme => {
          localStorage.setItem('theme', theme);
          document.documentElement.dataset.theme = theme;
        }, theme);
        const toggle = page.locator('.mobileMenuButton');
        await toggle.click();
        const menu = page.getByRole('dialog');
        await menu.waitFor();
        const geometry = await menu.evaluate(element => {
          const box = element.getBoundingClientRect();
          const header = document.querySelector('.siteHeader').getBoundingClientRect();
          return {
            bodyChild: element.parentElement === document.body,
            top: box.top,
            headerBottom: header.bottom,
            bottom: box.bottom,
            height: box.height,
            viewportHeight: innerHeight,
            background: getComputedStyle(element).backgroundColor,
            bodyLocked: document.body.style.overflow === 'hidden',
            focusInside: element.contains(document.activeElement),
          };
        });
        assert.ok(geometry.bodyChild, 'menu must escape the header containing block');
        assert.ok(Math.abs(geometry.top - geometry.headerBottom) < 2, 'menu follows the actual header height');
        assert.ok(Math.abs(geometry.bottom - geometry.viewportHeight) < 2, 'menu fills the remaining viewport');
        assert.ok(geometry.height > 200 && !geometry.background.includes('rgba'), 'opaque menu background');
        assert.ok(geometry.bodyLocked && geometry.focusInside, 'scroll lock and initial focus');
        for (const key of ['Shift+Tab', 'Tab', 'Tab', 'Tab']) {
          await page.keyboard.press(key);
          assert.ok(await page.evaluate(() => document.querySelector('.siteHeader').contains(document.activeElement)
            || document.querySelector('.mobileMenu').contains(document.activeElement)), 'keyboard focus stays in navigation');
        }
        // The final action must be reachable even in phone landscape.
        const booking = menu.locator('.mobileMenuActions a').first();
        await booking.scrollIntoViewIfNeeded();
        assert.ok(await booking.evaluate(element => {
          const box = element.getBoundingClientRect();
          return box.top >= document.querySelector('.siteHeader').getBoundingClientRect().bottom && box.bottom <= innerHeight;
        }), 'booking action is reachable');
        await page.keyboard.press('Escape');
        await menu.waitFor({ state: 'detached' });
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        assert.ok(await toggle.evaluate(element => element === document.activeElement));
        assert.equal(await page.evaluate(() => document.body.style.overflow), '');
        // Desktop resize must release the scroll lock and discard the open menu.
        await toggle.click();
        await page.setViewportSize({ width: 1280, height: 900 });
        await menu.waitFor({ state: 'detached' });
        assert.equal(await page.evaluate(() => document.body.style.overflow), '');
        await page.setViewportSize({ width, height });
        await toggle.click();
        await menu.locator('a[href$="#work"]').click();
        await menu.waitFor({ state: 'detached' });
        await page.waitForURL(`${base}/${locale}#work`);
        await page.waitForLoadState('networkidle');
        assert.equal(await page.evaluate(() => document.body.style.overflow), '');
        menuChecks++;
      }
    }
  }
  assert.deepEqual([...new Set(errors)], []);
  if (process.env.RESPONSIVE_SCREENSHOTS) {
    fs.mkdirSync(process.env.RESPONSIVE_SCREENSHOTS, { recursive: true });
    for (const locale of ['en', 'ar']) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${base}/${locale}`);
      await page.locator('.mobileMenuButton').click();
      await page.screenshot({ path: `${process.env.RESPONSIVE_SCREENSHOTS}/${locale}-mobile-menu.png` });
    }
  }
  console.log(`PASS (${engine}): ${layoutChecks} layout checks across ${widths.length} widths; ${menuChecks} menu checks in both languages/themes, portrait and landscape; no browser exceptions.`);
} finally {
  await browser.close();
}
