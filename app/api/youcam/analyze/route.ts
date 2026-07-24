import { NextRequest, NextResponse } from "next/server";
import {
  createTask,
  createUploadMetadata,
  getFirstFileRecord,
  getTaskId,
  getYouCamRuntime,
  mockTaskResult,
  uploadToPresignedUrl
} from "../../../lib/youcam";

export async function POST(request: NextRequest) {
  const runtime = getYouCamRuntime();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file field is required" }, { status: 400 });
  }

  if (runtime.shouldMock) {
    return NextResponse.json({
      mode: "mock",
      upload: { status: 200 },
      task: mockTaskResult("mock-skin-analysis-task")
    });
  }

  const metadata = await createUploadMetadata({
    workflow: "skin-analysis",
    fileName: file.name,
    contentType: file.type || "image/png",
    fileSize: file.size
  });

  const fileRecord = getFirstFileRecord(metadata);
  const uploadRequest = fileRecord?.requests?.[0];

  if (!fileRecord?.file_id || !uploadRequest?.url) {
    return NextResponse.json({ error: "YouCam upload metadata response did not include upload request data" }, { status: 502 });
  }

  const upload = await uploadToPresignedUrl(file, {
    url: uploadRequest.url,
    headers: uploadRequest.headers
  });

  if (upload.status < 200 || upload.status >= 300) {
    return NextResponse.json({ error: "Presigned upload failed", upload }, { status: 502 });
  }

  const task = await createTask({
    workflow: "skin-analysis",
    fileId: fileRecord.file_id
  });
  const taskId = getTaskId(task);

  return NextResponse.json(
    {
      mode: "live",
      metadata,
      upload,
      task,
      taskId,
      pollingUrl: taskId ? `/api/youcam/task-status/${encodeURIComponent(taskId)}?workflow=skin-analysis` : null
    },
    { status: task.status }
  );
}
