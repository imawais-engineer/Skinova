import { NextRequest, NextResponse } from "next/server";
import { getTaskStatus, isYouCamWorkflow } from "../../../../lib/youcam";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await context.params;
  const workflowParam = request.nextUrl.searchParams.get("workflow") || "skin-analysis";

  if (!isYouCamWorkflow(workflowParam)) {
    return NextResponse.json({ error: "Unsupported YouCam workflow" }, { status: 400 });
  }

  const workflow = workflowParam;
  const result = await getTaskStatus(workflow, taskId);

  return NextResponse.json(result.data, { status: result.status });
}
