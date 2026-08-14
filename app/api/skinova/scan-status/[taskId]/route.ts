import { NextResponse } from "next/server";
import { getTaskStatus } from "../../../../lib/youcam";

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

  if (result.status >= 400 || taskStatus === "error" || body.error || body.data?.error) {
    return NextResponse.json(
      { status: "error", error: "Skin scan processing failed. Use a clear, front-facing image and try again." },
      { status: result.status >= 400 ? result.status : 502 }
    );
  }

  if (body.analysis) {
    return NextResponse.json({ status: "success", analysis: body.analysis }, { status: 200 });
  }

  return NextResponse.json({ status: taskStatus }, { status: result.status === 200 ? 202 : result.status });
}
