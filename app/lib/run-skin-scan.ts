import {
  createTask,
  createUploadMetadata,
  getFirstFileRecord,
  getTaskId,
  getYouCamRuntime
} from "./youcam";

type ScanInput = {
  fileName: string;
  contentType: string;
  buffer: ArrayBuffer;
  forceDemo?: boolean;
};

export async function runSkinScan(input: ScanInput) {
  const runtime = getYouCamRuntime();

  if (runtime.shouldMock || input.forceDemo) {
    const taskId = `mock-skinova-${Date.now()}`;
    return {
      mode: "demo" as const,
      status: "processing" as const,
      message: input.forceDemo
        ? "Guided demo scan started. Results use representative Skinova guidance."
        : "Demo scan started. Results use representative Skinova guidance.",
      pollingUrl: `/api/skinova/scan-status/${encodeURIComponent(taskId)}`,
      fileId: null as string | null
    };
  }

  const metadata = await createUploadMetadata({
    workflow: "skin-analysis",
    fileName: input.fileName,
    contentType: input.contentType,
    fileSize: input.buffer.byteLength
  });

  const fileRecord = getFirstFileRecord(metadata);
  const uploadRequest = fileRecord?.requests?.[0];

  if (!fileRecord?.file_id || !uploadRequest?.url) {
    throw new Error("Skin scan service could not prepare the upload.");
  }

  const upload = await fetch(uploadRequest.url, {
    method: uploadRequest.method || "PUT",
    headers: uploadRequest.headers,
    body: input.buffer
  });

  if (!upload.ok) {
    throw new Error("Skin scan upload failed. Please try again.");
  }

  const task = await createTask({
    workflow: "skin-analysis",
    fileId: fileRecord.file_id
  });
  const taskId = getTaskId(task);

  if (!taskId) {
    throw new Error("Skin scan could not be started. Please try again.");
  }

  return {
    mode: "live" as const,
    status: "processing" as const,
    message: "Live scan started. Waiting for YouCam Skin Analysis results.",
    pollingUrl: `/api/skinova/scan-status/${encodeURIComponent(taskId)}`,
    fileId: fileRecord.file_id
  };
}
