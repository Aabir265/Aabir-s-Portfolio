const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  // scroll to about
  await page.evaluate(() => document.getElementById('about')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'audit-screens/about-desktop.png', fullPage: false });
  // mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.getElementById('about')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'audit-screens/about-mobile.png', fullPage: false });
  await browser.close();
  console.log('done');
})();
