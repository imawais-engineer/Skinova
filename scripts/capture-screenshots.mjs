import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.SKINOVA_CAPTURE_URL || "https://skinova-ai.vercel.app";
const outputDir = path.join(process.cwd(), "public", "screenshots");
const viewport = { width: 1440, height: 900 };
const testEmail = `skinova.capture.${Date.now()}@example.com`;
const testPassword = "SkinovaCapture2026!";
const testName = "Skinova Judge";

const targets = [
  { file: "project-cover.png", route: "/", selector: "main", fullPage: true },
  { file: "landing-live-status.png", route: "/#live", selector: "#live", fullPage: false },
  { file: "signup.png", route: "/signup", selector: "main", fullPage: false },
  { file: "dashboard.png", route: "/dashboard", selector: "main", auth: true, fullPage: false },
  { file: "scan-complete.png", route: "/scan", selector: "main", auth: true, fullPage: false, afterScan: true },
  { file: "results.png", route: "/results", selector: "main", auth: true, fullPage: false },
  { file: "routine.png", route: "/routine", selector: "main", auth: true, fullPage: false },
  { file: "coach.png", route: "/coach", selector: "main", auth: true, fullPage: false, coachQuestion: true },
  { file: "progress.png", route: "/progress", selector: "main", auth: true, fullPage: false }
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport });
const page = await context.newPage();
const results = [];

async function capture(target) {
  await page.goto(`${baseUrl}${target.route}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForSelector(target.selector, { timeout: 30000 });
  await page.waitForTimeout(800);
  const filePath = path.join(outputDir, target.file);
  await page.screenshot({
    path: filePath,
    fullPage: Boolean(target.fullPage)
  });
  results.push({ file: target.file, ok: true });
}

try {
  await capture(targets[0]);
  await capture(targets[1]);
  await capture(targets[2]);

  await page.goto(`${baseUrl}/signup`, { waitUntil: "networkidle", timeout: 90000 });
  await page.fill('input[name="name"], input[autocomplete="name"]', testName);
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard**", { timeout: 60000 });

  await capture(targets[3]);

  await page.goto(`${baseUrl}/scan`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForSelector("main", { timeout: 30000 });
  const sampleButton = page.locator('button:has-text("Clear skin"), button:has-text("Active acne")').first();
  if (await sampleButton.count()) {
    await sampleButton.click();
  }
  const startScan = page.locator('button:has-text("Start live scan")').first();
  await startScan.click();
  await page.waitForSelector('text=Analysis complete', { timeout: 120000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, "scan-complete.png"), fullPage: false });
  results.push({ file: "scan-complete.png", ok: true });

  for (const target of targets.slice(5)) {
    if (target.coachQuestion) {
      await page.goto(`${baseUrl}/coach`, { waitUntil: "networkidle", timeout: 90000 });
      await page.waitForSelector('input[placeholder*="Ask"]', { timeout: 30000 });
      await page.locator('input[placeholder*="Ask"]').first().fill("What should I focus on from my latest scan?");
      await page.locator('button[aria-label="Send message"]').click();
      await page.waitForTimeout(8000);
      await page.screenshot({ path: path.join(outputDir, target.file), fullPage: false });
      results.push({ file: target.file, ok: true });
      continue;
    }

    await capture(target);
  }
} catch (error) {
  results.push({ ok: false, error: error instanceof Error ? error.message : String(error) });
} finally {
  await browser.close();
}

console.log(JSON.stringify({ baseUrl, outputDir, results }, null, 2));

if (results.some((item) => item.ok === false)) {
  process.exit(1);
}
