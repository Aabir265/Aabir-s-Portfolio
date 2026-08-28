const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
  });

  console.log("→ navigating");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1500);

  // Desktop screenshots
  fs.mkdirSync("audit-screens", { recursive: true });
  for (let i = 0; i < 8; i++) {
    const y = i * 900;
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(800);
    const name = `audit-screens/desktop-${String(i).padStart(2, "0")}.png`;
    await page.screenshot({ path: name, fullPage: false });
    console.log("→ " + name);
  }

  // Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: "audit-screens/mobile-hero.png", fullPage: false });
  console.log("→ audit-screens/mobile-hero.png");

  // Content check (case-insensitive — mono labels render uppercase by design)
  const text = await page.evaluate(() => document.body.innerText);
  const textLower = text.toLowerCase();
  const checks = {
    "Aabir Sharma": textLower.includes("aabir sharma"),
    "I build AI systems": text.includes("I build AI systems"),
    "TIET": text.includes("TIET"),
    "Cafe Finder": text.includes("Cafe Finder"),
    "Martingale": text.includes("Martingale"),
    "IIT Madras": text.includes("IIT Madras"),
    "asharma32_be25@thapar.edu": text.includes("asharma32_be25@thapar.edu"),
    "Patiala": text.includes("Patiala"),
  };
  console.log("\n=== CONTENT CHECKS ===");
  Object.entries(checks).forEach(([k, v]) => {
    console.log(v ? "  PASS" : "  FAIL", k);
  });

  // em-dash check
  const emdashCount = (text.match(/—/g) || []).length;
  const endashCount = (text.match(/–/g) || []).length;
  console.log("\n=== TYPOGRAPHY CHECKS ===");
  console.log("  em-dashes:", emdashCount, emdashCount === 0 ? "PASS" : "FAIL");
  console.log("  en-dashes:", endashCount, endashCount === 0 ? "PASS" : "FAIL");

  // Section count
  const sections = await page.locator("section").count();
  console.log("\n=== STRUCTURE ===");
  console.log("  <section> count:", sections);

  await browser.close();
  console.log("\n→ done");
})();
