import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import {
  deleteScanTaskContext,
  getScanTaskContext,
  saveUserScan
} from "../../../../lib/scan-db";
import type { AnalysisResult } from "../../../../lib/skinova-data";
import { getScanSample } from "../../../../lib/demo-samples";
import { enrichAnalysisPersonalization } from "../../../../lib/run-personalization";
import { getTaskStatus, normalizeYouCamTaskResult } from "../../../../lib/youcam";

function mapYouCamError(error: unknown) {
  const code = typeof error === "string" ? error : "";

  if (code === "error_src_face_too_small") {
    return "The face in your photo is too small. Move closer so your face fills most of the frame, then try again.";
  }

  if (code === "error_src_face_out_of_bound") {
    return "Your face is cut off or out of frame. Center your full face with even lighting and try again.";
  }

  if (code === "error_lighting_dark") {
    return "The photo is too dark for analysis. Retake it in brighter, even lighting.";
  }

  if (code === "error_below_min_image_size") {
    return "The image resolution is too small. Use a higher-quality photo (at least 480px on the short side).";
  }

  if (code === "error_exceed_max_image_size") {
    return "The image file is too large. Use a photo under 10MB.";
  }

  if (code === "error_no_face") {
    return "No face was detected. Use a clear front-facing selfie with your face centered.";
  }

  return "Skin scan could not finish. Use a clear front-facing selfie that fills the frame, then try again.";
}

export async function GET(_request: Request, context: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await context.params;
  const session = await getSession();
  const result = await getTaskStatus("skin-analysis", taskId);
  const body = result.data as {
    task_status?: string;
    status?: string;
    analysis?: AnalysisResult;
    error?: unknown;
    data?: { task_status?: string; status?: string; error?: unknown };
  };
  const taskStatus = body.task_status || body.status || body.data?.task_status || body.data?.status || "processing";
  const youCamError = body.error || body.data?.error;
  let analysis = body.analysis || normalizeYouCamTaskResult(result.data) || null;

  if (result.status >= 400 || taskStatus === "error" || youCamError) {
    if (session) {
      await deleteScanTaskContext(taskId).catch(() => undefined);
    }

    return NextResponse.json(
      { status: "error", error: mapYouCamError(youCamError) },
      { status: result.status >= 400 ? result.status : 502 }
    );
  }

  if (analysis) {
    const taskContext = session ? await getScanTaskContext(taskId) : null;
    let scanId: string | null = null;
    let fileId: string | null = taskContext?.file_id || null;
    const scanMode = taskContext?.mode || (taskId.startsWith("mock-skinova-") ? "demo" : "live");

    analysis = await enrichAnalysisPersonalization({
      analysis,
      fileId,
      mode: scanMode
    });

    if (session && taskContext) {
      const sampleId = taskContext.sample_id || null;
      const previewImageUrl = sampleId ? getScanSample(sampleId)?.previewPath ?? null : null;
      const scannedAt = new Date().toISOString();

      const saved = await saveUserScan({
        userId: session.id,
        mode: taskContext.mode,
        analysis,
        youcamFileId: taskContext.file_id,
        previewImageUrl,
        sampleId,
        scannedAt
      });
      scanId = saved.id;
      fileId = saved.youcam_file_id;
      await deleteScanTaskContext(taskId).catch(() => undefined);

      return NextResponse.json(
        {
          status: "success",
          analysis,
          scanId,
          fileId,
          mode: scanMode,
          previewImageUrl: saved.preview_image_url,
          sampleId: saved.sample_id,
          scannedAt
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        analysis,
        scanId,
        fileId,
        mode: scanMode
      },
      { status: 200 }
    );
  }

  if (taskStatus === "success") {
    return NextResponse.json(
      { status: "error", error: "Scan finished but no analysis was returned. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ status: taskStatus }, { status: result.status === 200 ? 202 : result.status });
}
