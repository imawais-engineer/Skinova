import { readFile, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const workflow = "skin-analysis";
const root = process.cwd();
const inputCandidates = [
  join(root, "Testing", "INPUT", "selfie.jpg"),
  join(root, "Testing", "INPUT", "selfie.jpeg"),
  join(root, "Testing", "INPUT", "selfie.png")
];

const baseUrl = normalizeBaseUrl(process.env.BASE_URL || "https://yce-api-01.makeupar.com");
const apiKey = process.env.API_KEY;
const mode = process.argv.includes("--full") ? "full" : "metadata";

if (!apiKey) {
  console.log(JSON.stringify({ ok: false, reason: "API_KEY missing" }, null, 2));
  process.exit(0);
}

const inputFile = (await findInputFile()) || (await fetchRemoteInput());
const metadata = await createMetadata({
  fileName: inputFile?.name || "skinova-smoke-test.jpg",
  contentType: inputFile?.contentType || "image/jpeg",
  fileSize: inputFile?.size || 50000
});

if (!metadata.ok || mode === "metadata") {
  printSafe({
    mode,
    stage: "metadata",
    ok: metadata.ok,
    httpStatus: metadata.httpStatus,
    responseStatus: metadata.responseStatus,
    error: metadata.error,
    errorCode: metadata.errorCode,
    hasFileId: Boolean(metadata.file?.file_id),
    hasUploadRequest: Boolean(metadata.file?.requests?.[0]?.url),
    hasUploadHeaders: Boolean(metadata.file?.requests?.[0]?.headers),
    fullModeAvailable: Boolean(inputFile)
  });
  process.exit(metadata.ok ? 0 : 1);
}

if (!inputFile) {
  printSafe({
    mode,
    ok: false,
    stage: "input",
    reason: "Add Testing/INPUT/selfie.jpg, .jpeg, or .png to run full upload/task/poll smoke test."
  });
  process.exit(1);
}

const uploadRequest = metadata.file?.requests?.[0];
if (!metadata.file?.file_id || !uploadRequest?.url) {
  printSafe({ mode, ok: false, stage: "metadata", reason: "Missing file_id or upload request in YouCam response." });
  process.exit(1);
}

const upload = await uploadFile(inputFile, uploadRequest);
if (!upload.ok) {
  printSafe({ mode, ok: false, stage: "upload", httpStatus: upload.httpStatus });
  process.exit(1);
}

const task = await createTask(metadata.file.file_id);
if (!task.ok || !task.taskId) {
  printSafe({
    mode,
    ok: false,
    stage: "task",
    httpStatus: task.httpStatus,
    responseStatus: task.responseStatus,
    error: task.error,
    errorCode: task.errorCode,
    hasTaskId: Boolean(task.taskId)
  });
  process.exit(1);
}

const finalStatus = await pollTask(task.taskId);
printSafe({
  mode,
  ok: finalStatus.ok,
  stage: "poll",
  httpStatus: finalStatus.httpStatus,
  responseStatus: finalStatus.responseStatus,
  taskStatus: finalStatus.taskStatus,
  error: finalStatus.error,
  errorCode: finalStatus.errorCode,
  hasAnalysisOutput: finalStatus.hasAnalysisOutput
});

process.exit(finalStatus.ok ? 0 : 1);

async function createMetadata({ fileName, contentType, fileSize }) {
  const response = await fetch(`${baseUrl}/s2s/v2.0/file/${workflow}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      files: [
        {
          content_type: contentType,
          file_name: fileName,
          file_size: fileSize
        }
      ]
    })
  });
  const body = await safeJson(response);
  const file = body?.data?.files?.[0];

  return {
    ok: response.ok,
    httpStatus: response.status,
    responseStatus: body?.status ?? null,
    error: body?.error ?? null,
    errorCode: body?.error_code ?? null,
    file
  };
}

async function uploadFile(inputFile, uploadRequest) {
  const data = inputFile.data || (await readFile(inputFile.path));
  const response = await fetch(uploadRequest.url, {
    method: uploadRequest.method || "PUT",
    headers: uploadRequest.headers || {
      "Content-Type": inputFile.contentType,
      "Content-Length": String(inputFile.size)
    },
    body: data
  });

  return { ok: response.ok, httpStatus: response.status };
}

async function createTask(fileId) {
  const response = await fetch(`${baseUrl}/s2s/v2.0/task/${workflow}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      src_file_id: fileId,
      dst_actions: ["acne", "pore", "texture", "redness", "wrinkle", "oiliness", "moisture"],
      miniserver_args: {
        enable_mask_overlay: true
      },
      format: "json"
    })
  });
  const body = await safeJson(response);

  return {
    ok: response.ok,
    httpStatus: response.status,
    responseStatus: body?.status ?? null,
    error: body?.error ?? null,
    errorCode: body?.error_code ?? null,
    taskId: body?.data?.task_id
  };
}

async function pollTask(taskId) {
  let lastResult = null;

  for (let attempt = 1; attempt <= 8; attempt += 1) {
    await sleep(attempt === 1 ? 1500 : 3000);
    const response = await fetch(`${baseUrl}/s2s/v2.0/task/${workflow}/${encodeURIComponent(taskId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });
    const body = await safeJson(response);
    const taskStatus = body?.data?.task_status || body?.task_status || null;
    lastResult = { response, body, taskStatus };

    if (taskStatus === "success" || taskStatus === "error" || !response.ok) {
      break;
    }
  }

  const body = lastResult?.body || {};
  const output = body?.data?.results?.output || body?.data?.output || body?.output;

  return {
    ok: lastResult?.response?.ok && lastResult.taskStatus === "success",
    httpStatus: lastResult?.response?.status ?? null,
    responseStatus: body?.status ?? null,
    taskStatus: lastResult?.taskStatus,
    error: body?.data?.error || body?.error || null,
    errorCode: body?.error_code ?? null,
    hasAnalysisOutput: Array.isArray(output) && output.length > 0
  };
}

async function findInputFile() {
  if (process.env.YOUCAM_TEST_IMAGE_PATH) {
    try {
      const stats = await stat(process.env.YOUCAM_TEST_IMAGE_PATH);
      if (stats.isFile()) {
        return {
          path: process.env.YOUCAM_TEST_IMAGE_PATH,
          name: basename(process.env.YOUCAM_TEST_IMAGE_PATH),
          size: stats.size,
          contentType: contentTypeFor(process.env.YOUCAM_TEST_IMAGE_PATH)
        };
      }
    } catch {
      return null;
    }
  }

  for (const path of inputCandidates) {
    try {
      const stats = await stat(path);
      if (!stats.isFile()) {
        continue;
      }

      return {
        path,
        name: basename(path),
        size: stats.size,
        contentType: contentTypeFor(path)
      };
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

async function fetchRemoteInput() {
  if (!process.env.YOUCAM_TEST_IMAGE_URL) {
    return null;
  }

  const response = await fetch(process.env.YOUCAM_TEST_IMAGE_URL);
  if (!response.ok) {
    return null;
  }

  const contentType = response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());
  const extension = contentType === "image/png" ? "png" : "jpg";

  return {
    path: null,
    name: `skinova-remote-test.${extension}`,
    size: buffer.byteLength,
    contentType,
    data: buffer
  };
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function normalizeBaseUrl(value) {
  const trimmed = value.trim();

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed
      .replace(/\/+$/, "")
      .replace(/\/s2s\/v2\.0.*$/i, "");
  }
}

function contentTypeFor(path) {
  const ext = extname(path).toLowerCase();
  return ext === ".png" ? "image/png" : "image/jpeg";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printSafe(value) {
  console.log(JSON.stringify(value, null, 2));
}
