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
    simulationReady: true,
    coachReady,
    message:
      mode === "live"
        ? "Skinova is online with live scan, simulation, and guidance flows."
        : "Skinova is online in demo mode with representative scan and simulation guidance."
  });
}
