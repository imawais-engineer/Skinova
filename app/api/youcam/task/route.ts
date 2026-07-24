import { NextRequest, NextResponse } from "next/server";
import { createTask, isYouCamWorkflow } from "../../../lib/youcam";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    workflow?: string;
    fileId?: string;
    imageUrl?: string;
  };

  if (!isYouCamWorkflow(body.workflow) || (!body.fileId && !body.imageUrl)) {
    return NextResponse.json({ error: "workflow and either fileId or imageUrl are required" }, { status: 400 });
  }

  const result = await createTask({
    workflow: body.workflow,
    fileId: body.fileId,
    imageUrl: body.imageUrl
  });

  return NextResponse.json(result, { status: result.status });
}
