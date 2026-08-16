import { analysisResult, type AnalysisResult, type Concern, type PersonalizationContext } from "./skinova-data";

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
      explanation: concern.explanation,
      mask_urls: concern.maskUrls
    }))
  };
}

export function mockFitzpatrickResult(taskId = "skinova-demo-fitzpatrick") {
  return {
    mode: "mock",
    task_id: taskId,
    data: {
      task_status: "success",
      results: {
        fitzpatrick_scale: "III"
      }
    }
  };
}

export function mockSkinToneResult(taskId = "skinova-demo-skin-tone") {
  return {
    mode: "mock",
    task_id: taskId,
    data: {
      task_status: "success",
      results: {
        color: {
          skin_color: "#b9947c",
          eye_color_name: "Brown",
          lip_color: "#d23245",
          hair_color_name: "Brown"
        }
      }
    }
  };
}

export function mockFaceAnalyzerResult(taskId = "skinova-demo-face-analyzer") {
  return {
    mode: "mock",
    task_id: taskId,
    data: {
      task_status: "success",
      results: {
        faceshape: "Oval",
        agegender: { age: 28, gender: "female" },
        eyelid: { left_shape: "Almond", right_shape: "Almond" },
        nose: { width: "Medium" },
        lipshape: ["Full"]
      }
    }
  };
}

export function mockSimulationResult(taskId = "skinova-demo-simulation") {
  return {
    mode: "mock",
    task_id: taskId,
    task_status: "success",
    url: "https://plugins-media.makeupar.com/v1/skin-analysis/skin_analysis_05_20240101.png"
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

function isMockTaskId(taskId: string) {
  return taskId.startsWith("mock-");
}

function mockTaskStatus(workflow: YouCamWorkflow, taskId: string) {
  if (workflow === "skin-simulation") {
    return { status: 200, data: mockSimulationResult(taskId) };
  }

  if (workflow === "fitzpatrick-scale-analyzer") {
    return { status: 200, data: mockFitzpatrickResult(taskId) };
  }

  if (workflow === "skin-tone-analysis") {
    return { status: 200, data: mockSkinToneResult(taskId) };
  }

  if (workflow === "face-analyzer") {
    return { status: 200, data: mockFaceAnalyzerResult(taskId) };
  }

  return { status: 200, data: mockTaskResult(taskId) };
}

export async function getTaskStatus(workflow: YouCamWorkflow, taskId: string) {
  const runtime = getYouCamRuntime();
  const workflowPath = workflowPaths[workflow];

  if (runtime.shouldMock || isMockTaskId(taskId)) {
    return mockTaskStatus(workflow, taskId);
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
      ...(fileId ? { src_file_id: fileId } : { src_file_url: imageUrl }),
      features: ["faceShape", "age", "eyeShape", "noseWidth", "lipShape"]
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
      explanation: `${toConcernLabel(item.type || "skin indicator")} returned a visible care score of ${clampScore(item.ui_score || 0)}. Skinova converts this into education and routine guidance, not diagnosis.`,
      maskUrls: Array.isArray(item.mask_urls) ? item.mask_urls.filter((url): url is string => typeof url === "string") : undefined
    }));

  if (!concerns.length) {
    return null;
  }

  const overallScore = Math.round(concerns.reduce((sum, concern) => sum + concern.score, 0) / concerns.length);

  return {
    overallScore,
    skinType: "Live scan result",
    tone: "Personalization context available after scan",
    summary:
      "Skinova received live skin signals and normalized them into a consumer guidance view for education, routine planning, and progress tracking.",
    concerns,
    readingSteps: analysisResult.readingSteps
  };
}

export function normalizeSimulationResult(payload: unknown): { resultUrl: string | null; taskStatus: string } {
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  const nestedData = asRecord(data?.data);
  const results = asRecord(data?.results) || asRecord(nestedData?.results);

  const url =
    (typeof root?.url === "string" ? root.url : null) ||
    (typeof data?.url === "string" ? data.url : null) ||
    (typeof nestedData?.url === "string" ? nestedData.url : null) ||
    (typeof results?.url === "string" ? results.url : null);

  const taskStatus =
    (typeof root?.task_status === "string" ? root.task_status : null) ||
    (typeof data?.task_status === "string" ? data.task_status : null) ||
    (typeof nestedData?.task_status === "string" ? nestedData.task_status : null) ||
    (url ? "success" : "processing");

  return { resultUrl: url, taskStatus };
}

export function getTaskStatusFromPayload(payload: unknown): string {
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  const nestedData = asRecord(data?.data);

  return (
    (typeof root?.task_status === "string" ? root.task_status : null) ||
    (typeof data?.task_status === "string" ? data.task_status : null) ||
    (typeof nestedData?.task_status === "string" ? nestedData.task_status : null) ||
    "processing"
  );
}

export function normalizeFitzpatrickResult(payload: unknown): PersonalizationContext | null {
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  const results = asRecord(data?.results) || asRecord(root?.results);

  const scale = results?.fitzpatrick_scale;
  if (typeof scale !== "string" || !scale.trim()) {
    return null;
  }

  const roman = scale.trim().toUpperCase();
  return {
    fitzpatrickScale: roman,
    fitzpatrickLabel: `Fitzpatrick Type ${roman}`,
    source: "live"
  };
}

export function normalizeSkinToneResult(payload: unknown): PersonalizationContext | null {
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  const results = asRecord(data?.results) || asRecord(root?.results);
  const color = asRecord(results?.color);

  if (!color) {
    return null;
  }

  const skinColorHex = typeof color.skin_color === "string" ? color.skin_color : undefined;
  const eyeColorName = typeof color.eye_color_name === "string" ? color.eye_color_name : undefined;
  const lipColorHex = typeof color.lip_color === "string" ? color.lip_color : undefined;
  const hairColorName = typeof color.hair_color_name === "string" ? color.hair_color_name : undefined;

  if (!skinColorHex && !eyeColorName) {
    return null;
  }

  return {
    skinColorHex,
    eyeColorName,
    lipColorHex,
    hairColorName,
    source: "live"
  };
}

function readStringField(record: JsonRecord | null, keys: string[]) {
  if (!record) {
    return undefined;
  }

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

export function normalizeFaceAnalyzerResult(payload: unknown): PersonalizationContext | null {
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  const results = asRecord(data?.results) || asRecord(root?.results) || data;

  if (!results) {
    return null;
  }

  const faceShape = readStringField(results, ["faceShape", "faceshape", "face_shape"]);
  const eyeShape =
    readStringField(asRecord(results.eyelid), ["left_shape", "right_shape", "leftShape", "rightShape"]) ||
    readStringField(results, ["eyeShape", "eyeshape", "eye_shape"]);
  const noseWidth =
    readStringField(asRecord(results.nose), ["width", "noseWidth", "nose_width"]) ||
    readStringField(results, ["noseWidth", "nosewidth", "nose_width"]);
  const lipShapeCandidate = Array.isArray(results.lipshape) ? results.lipshape[0] : results.lipshape;
  const lipShape =
    typeof lipShapeCandidate === "string" && lipShapeCandidate.trim()
      ? lipShapeCandidate.trim()
      : readStringField(results, ["lipShape", "lipshape", "lip_shape"]);
  const ageGender = asRecord(results.agegender) || asRecord(results.ageGender) || asRecord(results.age_gender);
  const estimatedAge =
    typeof ageGender?.age === "number"
      ? Math.round(ageGender.age)
      : typeof results.age === "number"
        ? Math.round(results.age)
        : undefined;

  if (!faceShape && !eyeShape && !noseWidth && !lipShape && estimatedAge === undefined) {
    return null;
  }

  return {
    faceShape,
    estimatedAge,
    eyeShape,
    noseWidth,
    lipShape,
    source: "live"
  };
}

export function mergePersonalization(
  ...contexts: (PersonalizationContext | null)[]
): PersonalizationContext | null {
  const merged = contexts.filter(Boolean) as PersonalizationContext[];

  if (!merged.length) {
    return null;
  }

  return merged.reduce<PersonalizationContext>(
    (acc, context) => ({
      ...acc,
      ...context,
      fitzpatrickScale: context.fitzpatrickScale || acc.fitzpatrickScale,
      fitzpatrickLabel: context.fitzpatrickLabel || acc.fitzpatrickLabel,
      skinColorHex: context.skinColorHex || acc.skinColorHex,
      eyeColorName: context.eyeColorName || acc.eyeColorName,
      lipColorHex: context.lipColorHex || acc.lipColorHex,
      hairColorName: context.hairColorName || acc.hairColorName,
      faceShape: context.faceShape || acc.faceShape,
      estimatedAge: context.estimatedAge ?? acc.estimatedAge,
      eyeShape: context.eyeShape || acc.eyeShape,
      noseWidth: context.noseWidth || acc.noseWidth,
      lipShape: context.lipShape || acc.lipShape,
      source: "live"
    }),
    {}
  );
}

export function applyPersonalizationToAnalysis(
  analysis: AnalysisResult,
  personalization: PersonalizationContext | null
): AnalysisResult {
  if (!personalization) {
    return analysis;
  }

  const skinTypeParts = [analysis.skinType !== "Live scan result" ? analysis.skinType : null, personalization.fitzpatrickLabel]
    .filter(Boolean)
    .join(", ");

  const toneParts = [
    personalization.skinColorHex ? `Skin sample ${personalization.skinColorHex}` : null,
    personalization.eyeColorName ? `${personalization.eyeColorName} eyes` : null,
    personalization.hairColorName ? `${personalization.hairColorName} hair` : null
  ].filter(Boolean);

  return {
    ...analysis,
    skinType: skinTypeParts || analysis.skinType,
    tone: toneParts.length ? toneParts.join(" · ") : analysis.tone,
    personalization,
    readingSteps: analysis.readingSteps
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
