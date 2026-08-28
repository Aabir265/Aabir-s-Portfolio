const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Screenshot 1: About section on desktop
  await page.evaluate(() => document.getElementById('about')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'audit-screens/about-desktop-new.png', fullPage: false });

  // Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.getElementById('about')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'audit-screens/about-mobile-new.png', fullPage: false });

  // Scroll to contact
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit-screens/contact-desktop-new.png', fullPage: false });

  await browser.close();
  console.log('done');
})();
