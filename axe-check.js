const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").AxeBuilder;

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
  });

  console.log("→ navigating");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000); // wait for CSS custom properties to resolve

  const sections = ["#about", "#work", "#research", "#experiments", "#skills", "#achievements", "#writing", "#contact"];
  let totalViolations = 0;
  let totalPasses = 0;

  for (const sel of sections) {
    try {
      await page.evaluate((s) => document.querySelector(s)?.scrollIntoView(), sel);
      await page.waitForTimeout(1500); // let styles settle before axe analyzes
      const results = await new AxeBuilder({ page }).include(sel).analyze();
      const violations = results.violations || [];
      if (violations.length === 0) {
        console.log(`  PASS ${sel}: no violations`);
        totalPasses++;
      } else {
        console.log(`  FAIL ${sel}: ${violations.length} violation(s)`);
        violations.forEach((v) => {
          console.log("    -", v.id, v.description);
          v.nodes.forEach((n) => {
            console.log("      ", n.html.slice(0, 200));
            n.all.forEach((a) => {
              if (a.message) console.log("         ", a.message.slice(0, 200));
            });
          });
          totalViolations++;
        });
      }
    } catch (err) {
      console.log(`  ERROR ${sel}:`, err.message?.slice(0, 150));
    }
  }

  await browser.close();
  console.log(`\n→ sections passed: ${totalPasses}/${sections.length}, violations: ${totalViolations}`);
  process.exit(totalViolations > 0 ? 1 : 0);
})();
