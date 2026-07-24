import { analysisResult, type AnalysisResult, type Concern } from "./skinova-data";

export type YouCamWorkflow =
  | "skin-analysis"
  | "skin-simulation"
  | "photo-enhance"
  | "fitzpatrick-scale-analyzer"
  | "skin-tone-analysis"
  | "face-analyzer";

export const youCamWorkflows: YouCamWorkflow[] = [
  "skin-analysis",
  "skin-simulation",
  "photo-enhance",
  "fitzpatrick-scale-analyzer",
  "skin-tone-analysis",
  "face-analyzer"
];

const workflowPaths: Record<YouCamWorkflow, { file: string; task: string }> = {
  "skin-analysis": {
    file: "skin-analysis",
    task: "skin-analysis"
  },
  "skin-simulation": {
    file: "skin-simulation",
    task: "skin-simulation"
  },
  "photo-enhance": {
    file: "enhance",
    task: "enhance"
  },
  "fitzpatrick-scale-analyzer": {
    file: "fitzpatrick-scale-analyzer",
    task: "fitzpatrick-scale-analyzer"
  },
  "skin-tone-analysis": {
    file: "skin-tone-analysis",
    task: "skin-tone-analysis"
  },
  "face-analyzer": {
    file: "face-attr-analysis",
    task: "face-attr-analysis"
  }
};

type UploadMetadataInput = {
  workflow: YouCamWorkflow;
  fileName: string;
  contentType: string;
  fileSize: number;
};

type TaskInput = {
  workflow: YouCamWorkflow;
  fileId?: string;
  imageUrl?: string;
};

export type YouCamUploadRequest = {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
};

export type YouCamFileRecord = {
  file_id?: string;
  requests?: YouCamUploadRequest[];
};

type YouCamOutputRecord = {
  type?: string;
  ui_score?: number;
  raw_score?: number;
  mask_urls?: string[];
};

type JsonRecord = Record<string, unknown>;

export function isYouCamWorkflow(value: string | null | undefined): value is YouCamWorkflow {
  return Boolean(value && youCamWorkflows.includes(value as YouCamWorkflow));
}

export function getYouCamRuntime() {
  const baseUrl = normalizeYouCamBaseUrl(process.env.BASE_URL || "https://yce-api-01.makeupar.com");
  const apiKey = process.env.API_KEY;
  const demoMode = process.env.SKINOVA_DEMO_MODE !== "false";

  return {
    baseUrl,
    apiKey,
    hasApiKey: Boolean(apiKey),
    demoMode,
    shouldMock: demoMode || !apiKey
  };
}

function normalizeYouCamBaseUrl(value: string) {
  const trimmed = value.trim();

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed
      .replace(/\/+$/, "")
      .replace(/\/s2s\/v2\.0.*$/i, "");
  }
}

export function mockTaskResult(taskId = "skinova-demo-task") {
  return {
    mode: "mock",
    task_id: taskId,
    task_status: "success",
    analysis: analysisResult,
    output: analysisResult.concerns.map((concern) => ({
      type: concern.type.toLowerCase().replaceAll(" ", "_"),
      ui_score: concern.score,
      raw_score: concern.score + 4.27,
      explanation: concern.explanation
    }))
  };
}

export async function createUploadMetadata(input: UploadMetadataInput) {
  const runtime = getYouCamRuntime();
  const workflow = workflowPaths[input.workflow];

  if (runtime.shouldMock) {
    return {
      mode: "mock",
      status: 200,
      data: {
        files: [
          {
            content_type: input.contentType,
            file_name: input.fileName,
            file_id: `mock-${input.workflow}-file`,
            requests: [
              {
                method: "PUT",
                url: "mock://skinova-presigned-upload",
                headers: {
                  "Content-Length": String(input.fileSize),
                  "Content-Type": input.contentType
                }
              }
            ]
          }
        ]
      }
    };
  }

  const response = await fetch(`${runtime.baseUrl}/s2s/v2.0/file/${workflow.file}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtime.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      files: [
        {
          content_type: input.contentType,
          file_name: input.fileName,
          file_size: input.fileSize
        }
      ]
    })
  });

  const body = await response.json();
  return { mode: "live", status: response.status, data: body };
}

export async function createTask(input: TaskInput) {
  const runtime = getYouCamRuntime();
  const workflow = workflowPaths[input.workflow];

  if (runtime.shouldMock) {
    return {
      mode: "mock",
      status: 200,
      data: {
        task_id: `mock-${input.workflow}-task`
      }
    };
  }

  const payload =
    input.fileId !== undefined
      ? defaultTaskPayload(input.workflow, input.fileId)
      : defaultTaskPayload(input.workflow, undefined, input.imageUrl);

  const response = await fetch(`${runtime.baseUrl}/s2s/v2.0/task/${workflow.task}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtime.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = await response.json();
  return { mode: "live", status: response.status, data: body };
}

export async function getTaskStatus(workflow: YouCamWorkflow, taskId: string) {
  const runtime = getYouCamRuntime();
  const workflowPath = workflowPaths[workflow];

  if (runtime.shouldMock) {
    return { status: 200, data: mockTaskResult(taskId) };
  }

  const response = await fetch(`${runtime.baseUrl}/s2s/v2.0/task/${workflowPath.task}/${taskId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${runtime.apiKey}`,
      "Content-Type": "application/json"
    }
  });

  const body = await response.json();
  const normalizedAnalysis = normalizeYouCamTaskResult(body);

  if (isRecord(body) && normalizedAnalysis) {
    return { status: response.status, data: { ...body, analysis: normalizedAnalysis } };
  }

  return { status: response.status, data: body };
}

export async function uploadToPresignedUrl(file: File, request: { url: string; headers?: Record<string, string> }) {
  if (request.url.startsWith("mock://")) {
    return { mode: "mock", status: 200 };
  }

  const response = await fetch(request.url, {
    method: "PUT",
    headers: request.headers,
    body: await file.arrayBuffer()
  });

  return { mode: "live", status: response.status };
}

function defaultTaskPayload(workflow: YouCamWorkflow, fileId?: string, imageUrl?: string) {
  if (workflow === "skin-analysis") {
    return {
      ...(fileId ? { src_file_id: fileId } : { src_file_url: imageUrl }),
      dst_actions: ["acne", "pore", "texture", "redness", "wrinkle", "oiliness", "moisture"],
      miniserver_args: {
        enable_mask_overlay: true
      },
      format: "json"
    };
  }

  if (workflow === "skin-simulation") {
    return {
      ...(fileId ? { src_file_id: fileId } : { src_file_url: imageUrl }),
      acne: 0.35,
      pores: 0.3,
      texture: 0.35,
      redness: 0.4
    };
  }

  if (workflow === "photo-enhance") {
    return {
      ...(fileId ? { src_file_id: fileId } : { src_file_url: imageUrl }),
      scale: 1
    };
  }

  if (workflow === "face-analyzer") {
    return {
      request_id: `skinova-face-${Date.now()}`,
      payload: fileId ? { src_ids: [fileId] } : { src_urls: [imageUrl] },
      actions: [
        {
          id: 0,
          params: { face_angle_strictness_level: "high" },
          dst_actions: ["faceShape", "age", "eyeShape", "noseWidth", "lipShape"]
        }
      ]
    };
  }

  if (workflow === "fitzpatrick-scale-analyzer") {
    return {
      ...(fileId ? { src_file_id: fileId } : { src_file_url: imageUrl }),
      version: "1.0",
      index: 0
    };
  }

  if (workflow === "skin-tone-analysis") {
    return {
      ...(fileId ? { src_file_id: fileId } : { src_file_url: imageUrl }),
      face_angle_strictness_level: "high"
    };
  }

  return {
    ...(fileId ? { src_file_id: fileId } : { src_file_url: imageUrl }),
    format: "json"
  };
}

export function getFirstFileRecord(payload: unknown): YouCamFileRecord | null {
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  const nestedData = asRecord(data?.data);
  const files =
    asArray<YouCamFileRecord>(nestedData?.files) ||
    asArray<YouCamFileRecord>(data?.files) ||
    asArray<YouCamFileRecord>(root?.files);

  return files?.[0] || null;
}

export function getTaskId(payload: unknown): string | null {
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  const nestedData = asRecord(data?.data);
  const taskId = nestedData?.task_id || data?.task_id || root?.task_id;

  return typeof taskId === "string" ? taskId : null;
}

export function normalizeYouCamTaskResult(payload: unknown): AnalysisResult | null {
  const root = asRecord(payload);
  const output =
    asArray<YouCamOutputRecord>(root?.output) ||
    asArray<YouCamOutputRecord>(asRecord(root?.results)?.output) ||
    asArray<YouCamOutputRecord>(asRecord(root?.data)?.output) ||
    asArray<YouCamOutputRecord>(asRecord(asRecord(root?.data)?.results)?.output);

  if (!output?.length) {
    return null;
  }

  const concerns: Concern[] = output
    .filter((item) => typeof item.type === "string" && typeof item.ui_score === "number")
    .map((item) => ({
      type: toConcernLabel(item.type || "skin indicator"),
      score: clampScore(item.ui_score || 0),
      direction: item.ui_score && item.ui_score >= 75 ? "improving" : item.ui_score && item.ui_score >= 60 ? "stable" : "watch",
      explanation: `${toConcernLabel(item.type || "skin indicator")} returned a YouCam UI score of ${clampScore(item.ui_score || 0)}. Skinova converts this into education and routine guidance, not diagnosis.`
    }));

  if (!concerns.length) {
    return null;
  }

  const overallScore = Math.round(concerns.reduce((sum, concern) => sum + concern.score, 0) / concerns.length);

  return {
    overallScore,
    skinType: "Live YouCam result",
    tone: "Available when tone/Fitzpatrick workflow is enabled",
    summary:
      "Live YouCam Skin AI results were received and normalized into Skinova's consumer guidance view. Use the raw task response for masks and provider-specific fields.",
    concerns,
    workflow: analysisResult.workflow
  };
}

function asRecord(value: unknown): JsonRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : null;
}

function isRecord(value: unknown): value is JsonRecord {
  return asRecord(value) !== null;
}

function asArray<T>(value: unknown): T[] | null {
  return Array.isArray(value) ? (value as T[]) : null;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function toConcernLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
