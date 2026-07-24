import { NextResponse } from "next/server";
import { analysisResult } from "../../../lib/skinova-data";
import { getYouCamRuntime, mockTaskResult } from "../../../lib/youcam";

export async function POST() {
  const runtime = getYouCamRuntime();

  return NextResponse.json({
    mode: runtime.shouldMock ? "mock" : "live-ready",
    apiKeyConfigured: runtime.hasApiKey,
    demoMode: runtime.demoMode,
    message: runtime.shouldMock
      ? "Demo-safe analysis generated locally. Add API credentials and set SKINOVA_DEMO_MODE=false to use live YouCam workflows."
      : "Live YouCam credentials detected. Use the YouCam workflow routes for file upload, task creation, and polling.",
    task: mockTaskResult(),
    analysis: analysisResult
  });
}
