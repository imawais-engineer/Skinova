import "server-only";
import { analysisResult } from "./skinova-data";
import type { AnalysisResult, PersonalizationContext } from "./skinova-data";
import {
  applyPersonalizationToAnalysis,
  createTask,
  getTaskId,
  getTaskStatus,
  getTaskStatusFromPayload,
  getYouCamRuntime,
  mergePersonalization,
  normalizeFaceAnalyzerResult,
  normalizeFitzpatrickResult,
  normalizeSkinToneResult,
  type YouCamWorkflow
} from "./youcam";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollWorkflowTask(workflow: YouCamWorkflow, taskId: string) {
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    await sleep(attempt === 1 ? 1200 : 2000);
    const result = await getTaskStatus(workflow, taskId);
    const status = getTaskStatusFromPayload(result.data);

    if (status === "success") {
      return { ok: true as const, data: result.data };
    }

    if (status === "error") {
      return { ok: false as const, data: result.data };
    }
  }

  return { ok: false as const, data: null };
}

async function runWorkflowTask(workflow: YouCamWorkflow, fileId: string) {
  const created = await createTask({ workflow, fileId });
  const taskId = getTaskId(created);

  if (!taskId) {
    return null;
  }

  const polled = await pollWorkflowTask(workflow, taskId);
  return polled.ok ? polled.data : null;
}

function demoPersonalization(): PersonalizationContext {
  return analysisResult.personalization || {
    fitzpatrickScale: "III",
    fitzpatrickLabel: "Fitzpatrick Type III",
    skinColorHex: "#b9947c",
    eyeColorName: "Brown",
    source: "demo"
  };
}

export async function enrichAnalysisPersonalization(input: {
  analysis: AnalysisResult;
  fileId?: string | null;
  mode: "demo" | "live";
}) {
  const runtime = getYouCamRuntime();

  if (runtime.shouldMock || input.mode === "demo" || !input.fileId) {
    return applyPersonalizationToAnalysis(input.analysis, {
      ...demoPersonalization(),
      source: "demo"
    });
  }

  const [fitzpatrickPayload, skinTonePayload, faceAnalyzerPayload] = await Promise.all([
    runWorkflowTask("fitzpatrick-scale-analyzer", input.fileId),
    runWorkflowTask("skin-tone-analysis", input.fileId),
    runWorkflowTask("face-analyzer", input.fileId)
  ]);

  const personalization = mergePersonalization(
    fitzpatrickPayload ? normalizeFitzpatrickResult(fitzpatrickPayload) : null,
    skinTonePayload ? normalizeSkinToneResult(skinTonePayload) : null,
    faceAnalyzerPayload ? normalizeFaceAnalyzerResult(faceAnalyzerPayload) : null
  );

  if (!personalization) {
    return input.analysis;
  }

  return applyPersonalizationToAnalysis(input.analysis, personalization);
}
