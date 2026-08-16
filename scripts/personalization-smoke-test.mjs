import { readFile, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const root = process.cwd();
const imagePath = process.env.YOUCAM_TEST_IMAGE_PATH || join(root, "public", "samples", "youcam-clear-baseline.jpg");
const apiKey = process.env.API_KEY;
const baseUrl = (process.env.BASE_URL || "https://yce-api-01.makeupar.com").replace(/\/s2s\/v2\.0.*$/i, "").replace(/\/+$/, "");

if (!apiKey) {
  console.log(JSON.stringify({ ok: false, reason: "API_KEY missing" }, null, 2));
  process.exit(1);
}

try {
  const stats = await stat(imagePath);
  if (!stats.isFile()) {
    throw new Error("Image not found");
  }
} catch {
  console.log(JSON.stringify({ ok: false, reason: `Image missing at ${imagePath}` }, null, 2));
  process.exit(1);
}

const buffer = await readFile(imagePath);
const contentType = extname(imagePath).toLowerCase() === ".png" ? "image/png" : "image/jpeg";
const fileName = basename(imagePath);

const metadata = await postJson(`/s2s/v2.0/file/skin-analysis`, {
  files: [{ content_type: contentType, file_name: fileName, file_size: buffer.byteLength }]
});
const file = metadata?.data?.files?.[0];
const uploadRequest = file?.requests?.[0];

if (!file?.file_id || !uploadRequest?.url) {
  console.log(JSON.stringify({ ok: false, stage: "metadata", reason: "Missing file_id or upload URL" }, null, 2));
  process.exit(1);
}

const upload = await fetch(uploadRequest.url, {
  method: uploadRequest.method || "PUT",
  headers: uploadRequest.headers,
  body: buffer
});

if (!upload.ok) {
  console.log(JSON.stringify({ ok: false, stage: "upload", httpStatus: upload.status }, null, 2));
  process.exit(1);
}

const fitzTask = await postJson(`/s2s/v2.0/task/fitzpatrick-scale-analyzer`, {
  src_file_id: file.file_id,
  version: "1.0",
  index: 0
});
const toneTask = await postJson(`/s2s/v2.0/task/skin-tone-analysis`, {
  src_file_id: file.file_id,
  face_angle_strictness_level: "high"
});

const fitzpatrick = await pollTask("fitzpatrick-scale-analyzer", fitzTask?.data?.task_id);
const skinTone = await pollTask("skin-tone-analysis", toneTask?.data?.task_id);

const analysisTask = await postJson(`/s2s/v2.0/task/skin-analysis`, {
  src_file_id: file.file_id,
  dst_actions: ["acne", "pore", "texture", "redness", "wrinkle", "oiliness", "moisture"],
  miniserver_args: { enable_mask_overlay: true },
  format: "json"
});
const analysis = await pollTask("skin-analysis", analysisTask?.data?.task_id);
const output = analysis?.data?.results?.output || analysis?.data?.output || [];
const maskCount = Array.isArray(output) ? output.filter((item) => Array.isArray(item?.mask_urls) && item.mask_urls.length).length : 0;

console.log(
  JSON.stringify(
    {
      ok: Boolean(fitzpatrick?.data?.results?.fitzpatrick_scale && skinTone?.data?.results?.color?.skin_color),
      fitzpatrickScale: fitzpatrick?.data?.results?.fitzpatrick_scale || null,
      skinColor: skinTone?.data?.results?.color?.skin_color || null,
      eyeColorName: skinTone?.data?.results?.color?.eye_color_name || null,
      maskConcernCount: maskCount,
      taskStatuses: {
        fitzpatrick: fitzpatrick?.data?.task_status || null,
        skinTone: skinTone?.data?.task_status || null,
        analysis: analysis?.data?.task_status || null
      }
    },
    null,
    2
  )
);

process.exit(fitzpatrick?.data?.results?.fitzpatrick_scale && skinTone?.data?.results?.color?.skin_color ? 0 : 1);

async function postJson(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return response.json();
}

async function pollTask(workflow, taskId) {
  if (!taskId) {
    return null;
  }

  let last = null;
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    await sleep(attempt === 1 ? 1500 : 2500);
    const response = await fetch(`${baseUrl}/s2s/v2.0/task/${workflow}/${encodeURIComponent(taskId)}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });
    last = await response.json();
    const status = last?.data?.task_status;
    if (status === "success" || status === "error") {
      break;
    }
  }

  return last;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
