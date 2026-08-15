import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getScanSample } from "../../../lib/demo-samples";
import { runSkinScan } from "../../../lib/run-skin-scan";

export async function POST(request: NextRequest) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "A photo is required." }, { status: 400 });
  }

  const sampleId = formData.get("sampleId");
  const file = formData.get("file");

  try {
    if (typeof sampleId === "string" && sampleId.trim()) {
      const sample = getScanSample(sampleId.trim());

      if (!sample) {
        return NextResponse.json({ error: "That sample is not available." }, { status: 400 });
      }

      if (sample.mode === "demo") {
        const result = await runSkinScan({
          fileName: "skinova-guided-demo.jpg",
          contentType: "image/jpeg",
          buffer: new ArrayBuffer(0),
          forceDemo: true
        });

        return NextResponse.json(result, { status: 202 });
      }

      if (!sample.fileName) {
        return NextResponse.json({ error: "That sample is not available." }, { status: 400 });
      }

      const samplePath = path.join(process.cwd(), "public", "samples", sample.fileName);
      const buffer = await readFile(samplePath);
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
      const result = await runSkinScan({
        fileName: sample.fileName,
        contentType: "image/jpeg",
        buffer: arrayBuffer
      });

      return NextResponse.json(result, { status: 202 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose a photo or try one of the demo samples." }, { status: 400 });
    }

    const result = await runSkinScan({
      fileName: file.name,
      contentType: file.type || "image/png",
      buffer: await file.arrayBuffer()
    });

    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The scan could not be completed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
