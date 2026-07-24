import { NextRequest, NextResponse } from "next/server";
import { createUploadMetadata, isYouCamWorkflow } from "../../../lib/youcam";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    workflow?: string;
    fileName?: string;
    contentType?: string;
    fileSize?: number;
  };

  if (!isYouCamWorkflow(body.workflow) || !body.fileName || !body.contentType || !body.fileSize) {
    return NextResponse.json({ error: "workflow, fileName, contentType, and fileSize are required" }, { status: 400 });
  }

  const result = await createUploadMetadata({
    workflow: body.workflow,
    fileName: body.fileName,
    contentType: body.contentType,
    fileSize: body.fileSize
  });

  return NextResponse.json(result, { status: result.status });
}
