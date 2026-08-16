import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const urls = new Set();

  page.on("response", (response) => {
    const url = response.url();
    if (/skin_analysis_\d+_[a-f0-9]+\.(png|jpe?g)/i.test(url) && !url.includes("thumbnail_")) {
      urls.add(url);
    }
  });

  await page.goto("https://yce.perfectcorp.com/api-console/en/api-playground/ai-skin-analysis", {
    waitUntil: "networkidle",
    timeout: 90000
  });

  await page.waitForTimeout(3000);

  const sampleButtons = page.locator("img[src*='skin_analysis'], img[src*='thumbnail_skin_analysis']");
  const count = await sampleButtons.count();
  for (let i = 0; i < count; i += 1) {
    await sampleButtons.nth(i).click({ timeout: 5000 }).catch(() => undefined);
    await page.waitForTimeout(800);
  }

  const html = await page.content();
  const matches = html.match(/https:\/\/plugins-media\.makeupar\.com\/strapi\/assets\/(?:small_|)skin_analysis_\d+_[a-f0-9]+\.(?:png|jpe?g)/gi) || [];
  matches.forEach((url) => urls.add(url.replace("small_", "")));

  console.log(JSON.stringify([...urls].sort(), null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
