import { chromium } from "@playwright/test";

const baseUrl = process.env.SKINOVA_TEST_URL || "http://localhost:3000";
const cases = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 900 }
];

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height } });
    await page.goto(`${baseUrl}/scan`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.getByRole("button", { name: "Run demo scan" }).click();
    await page.waitForSelector("text=Skin health score", { timeout: 15000 });
    await page.screenshot({ path: `/tmp/skinova-scan-after-${item.name}.png`, fullPage: false });

    const metrics = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      viewportHeight: window.innerHeight,
      bodyHeight: document.body.scrollHeight
    }));
    const overflowX = metrics.scrollWidth > metrics.viewportWidth + 1 || metrics.bodyScrollWidth > metrics.viewportWidth + 1;
    results.push({ name: item.name, overflowX, metrics });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));

if (results.some((result) => result.overflowX)) {
  process.exit(1);
}
