import { NextResponse } from "next/server";
import { isCoachLive } from "../../../lib/ai-runtime";
import { getAppMode } from "../../../lib/app-mode";

export async function GET() {
  const mode = getAppMode();
  const coachReady = isCoachLive();

  return NextResponse.json({
    status: "online",
    mode,
    scanReady: true,
    coachReady,
    message:
      mode === "live"
        ? "Skinova is online with live scan and guidance flows."
        : "Skinova is online in demo mode with representative scan guidance."
  });
}
