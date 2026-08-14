import { NextResponse } from "next/server";
import { getYouCamRuntime } from "../../../lib/youcam";

export async function GET() {
  const runtime = getYouCamRuntime();

  return NextResponse.json({
    status: "online",
    mode: runtime.shouldMock ? "demo" : "live",
    scanReady: true,
    hasApiKey: runtime.hasApiKey,
    demoMode: runtime.demoMode,
    message: runtime.shouldMock
      ? "Demo mode is active. Scans return representative Skinova guidance without calling YouCam."
      : "Live mode is active. Scans use the YouCam Skin Analysis workflow."
  });
}
