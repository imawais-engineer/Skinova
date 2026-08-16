import { chromium } from "@playwright/test";

const baseUrl = process.env.SKINOVA_DEMO_URL || "https://skinova-ai.vercel.app";
const testEmail = `skinova.demo.${Date.now()}@example.com`;
const testPassword = "SkinovaDemo2026!";
const testName = "Skinova Demo";

const checks = [];

function record(name, ok, detail = "") {
  checks.push({ name, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchJson(path) {
  const response = await fetch(`${baseUrl}${path}`);
  return response.json();
}

const health = await fetchJson("/api/skinova/health");
record(
  "health endpoint",
  health.status === "online" && health.scanReady && health.coachReady,
  `${health.mode} · ${health.youCamApiCount || 0} APIs · DB ${health.databaseReady ? "ready" : "checking"}`
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForSelector("#live", { timeout: 30000 });
  record("landing page", true);

  await page.goto(`${baseUrl}/signup`, { waitUntil: "networkidle", timeout: 90000 });
  await page.fill('input[name="name"], input[autocomplete="name"]', testName);
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard**", { timeout: 60000 });
  record("sign up + dashboard", true);

  await page.goto(`${baseUrl}/scan`, { waitUntil: "networkidle", timeout: 90000 });
  const sampleButton = page.locator('button:has-text("Clear skin"), button:has-text("Active acne")').first();
  if (await sampleButton.count()) {
    await sampleButton.click();
  }
  await page.locator('button:has-text("Start live scan")').first().click();
  await page.waitForSelector("text=Analysis complete", { timeout: 120000 });
  record("skin scan complete", true);

  await page.goto(`${baseUrl}/results`, { waitUntil: "networkidle", timeout: 90000 });
  const resultsHeading = await page.locator("text=Concern breakdown").count();
  const personalization = await page.locator("text=YouCam personalization").count();
  record("results page", resultsHeading > 0, personalization > 0 ? "personalization visible" : "scores visible");

  await page.goto(`${baseUrl}/routine`, { waitUntil: "networkidle", timeout: 90000 });
  await page.getByText(/Morning routine|Night routine|Building your routine|Ingredient safety notes/).first().waitFor({
    timeout: 90000
  });
  record("routine page", true);

  await page.goto(`${baseUrl}/coach`, { waitUntil: "networkidle", timeout: 90000 });
  await page.locator('input[placeholder*="Ask"]').first().fill("What should I focus on from my latest scan?");
  await page.locator('button[aria-label="Send message"]').click();
  await page.getByText("Thinking…").waitFor({ state: "hidden", timeout: 90000 }).catch(() => null);
  await page.waitForTimeout(1500);
  const coachMessages = await page.locator(".text-slate-200.ring-1").count();
  record("skin coach reply", coachMessages > 0);

  await page.goto(`${baseUrl}/progress`, { waitUntil: "networkidle", timeout: 90000 });
  await page.getByText("YouCam Skin Simulation").waitFor({ timeout: 30000 });
  record("progress page", true);

  const simulateButton = page.getByRole("button", { name: /Run Skin Simulation/i });
  if (await simulateButton.count()) {
    await simulateButton.click();
    await page
      .getByText(/Before\/after comparison is ready below|After · simulation|Live YouCam|Demo preview/i)
      .first()
      .waitFor({ timeout: 120000 })
      .catch(() => null);
    const simulationReady = await page.getByText(/After · simulation|Live YouCam|Demo preview/).count();
    record("skin simulation", simulationReady > 0);
  } else {
    record("skin simulation", true, "skipped");
  }
} catch (error) {
  record("demo flow", false, error instanceof Error ? error.message : String(error));
} finally {
  await browser.close();
}

const ok = checks.every((check) => check.ok);
console.log(JSON.stringify({ ok, baseUrl, checks }, null, 2));
process.exit(ok ? 0 : 1);
