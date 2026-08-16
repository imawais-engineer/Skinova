import { NextResponse } from "next/server";
import { getTaskStatus } from "../../../../lib/youcam";

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
  const result = await getTaskStatus("skin-analysis", taskId);
  const body = result.data as {
    task_status?: string;
    status?: string;
    analysis?: unknown;
    error?: unknown;
    data?: { task_status?: string; status?: string; error?: unknown };
  };
  const taskStatus = body.task_status || body.status || body.data?.task_status || body.data?.status || "processing";
  const youCamError = body.error || body.data?.error;

  if (result.status >= 400 || taskStatus === "error" || youCamError) {
    return NextResponse.json(
      { status: "error", error: mapYouCamError(youCamError) },
      { status: result.status >= 400 ? result.status : 502 }
    );
  }

  if (body.analysis) {
    return NextResponse.json({ status: "success", analysis: body.analysis }, { status: 200 });
  }

  if (taskStatus === "success") {
    return NextResponse.json(
      { status: "error", error: "Scan finished but no analysis was returned. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ status: taskStatus }, { status: result.status === 200 ? 202 : result.status });
}
