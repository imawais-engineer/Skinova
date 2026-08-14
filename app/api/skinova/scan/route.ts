import { NextRequest, NextResponse } from "next/server";
import {
  createTask,
  createUploadMetadata,
  getFirstFileRecord,
  getTaskId,
  getYouCamRuntime,
  uploadToPresignedUrl
} from "../../../lib/youcam";

export async function POST(request: NextRequest) {
  const runtime = getYouCamRuntime();
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "A photo is required." }, { status: 400 });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A photo is required." }, { status: 400 });
  }

  if (runtime.shouldMock) {
    return NextResponse.json({ error: "Skin scan service is unavailable. Please try again later." }, { status: 503 });
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
    return NextResponse.json({ error: "Skin scan service could not prepare the upload." }, { status: 502 });
  }

  const upload = await uploadToPresignedUrl(file, {
    url: uploadRequest.url,
    headers: uploadRequest.headers
  });

  if (upload.status < 200 || upload.status >= 300) {
    return NextResponse.json({ error: "Skin scan upload failed. Please try again." }, { status: 502 });
  }

  const task = await createTask({
    workflow: "skin-analysis",
    fileId: fileRecord.file_id
  });
  const taskId = getTaskId(task);

  if (!taskId) {
    return NextResponse.json({ error: "Skin scan could not be started. Please try again." }, { status: 502 });
  }

  return NextResponse.json(
    {
      status: "processing",
      pollingUrl: `/api/skinova/scan-status/${encodeURIComponent(taskId)}`
    },
    { status: 202 }
  );
}
