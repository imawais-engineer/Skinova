import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = process.argv[2] || "/opt/cursor/artifacts/assets/skinova-logo-master.png";
const brandDir = path.join(process.cwd(), "public", "brand");

async function writeCirclePng(input, size, outputPath) {
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`
  );

  await sharp(input)
    .resize(size, size, { fit: "cover", position: "centre" })
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toFile(outputPath);
}

async function main() {
  await fs.mkdir(brandDir, { recursive: true });
  const input = await fs.readFile(source);

  await fs.copyFile(source, path.join(brandDir, "logo-source.png"));
  await writeCirclePng(input, 512, path.join(brandDir, "logo-circle.png"));

  for (const size of [16, 32, 48, 192, 512]) {
    await writeCirclePng(input, size, path.join(brandDir, `icon-${size}.png`));
  }

  await sharp(path.join(brandDir, "icon-32.png")).toFile(path.join(process.cwd(), "public", "favicon.ico"));

  console.log(JSON.stringify({ ok: true, brandDir }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
