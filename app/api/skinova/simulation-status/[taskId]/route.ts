import { NextResponse } from "next/server";
import { getTaskStatus, normalizeSimulationResult } from "../../../../lib/youcam";

export async function GET(_request: Request, context: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await context.params;
  const result = await getTaskStatus("skin-simulation", taskId);
  const body = result.data as {
    task_status?: string;
    status?: string;
    error?: unknown;
    data?: { task_status?: string; status?: string; error?: unknown };
  };
  const normalized = normalizeSimulationResult(result.data);
  const taskStatus = normalized.taskStatus || body.task_status || body.status || body.data?.task_status || body.data?.status || "processing";
  const youCamError = body.error || body.data?.error;

  if (result.status >= 400 || taskStatus === "error" || youCamError) {
    return NextResponse.json(
      { status: "error", error: "Skin simulation could not finish. Try again after a fresh scan." },
      { status: result.status >= 400 ? result.status : 502 }
    );
  }

  if (normalized.resultUrl) {
    return NextResponse.json(
      {
        status: "success",
        resultUrl: normalized.resultUrl,
        mode: taskId.startsWith("mock-simulation-") ? "demo" : "live"
      },
      { status: 200 }
    );
  }

  if (taskStatus === "success") {
    return NextResponse.json(
      { status: "error", error: "Simulation finished but no preview image was returned." },
      { status: 502 }
    );
  }

  return NextResponse.json({ status: taskStatus }, { status: result.status === 200 ? 202 : result.status });
}
