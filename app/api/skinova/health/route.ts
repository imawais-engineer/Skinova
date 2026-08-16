import { NextResponse } from "next/server";
import { isCoachLive } from "../../../lib/ai-runtime";
import { getAppMode } from "../../../lib/app-mode";
import { getDatabaseHealth } from "../../../lib/db-health";
import { getYouCamRuntime } from "../../../lib/youcam";

export async function GET() {
  const mode = getAppMode();
  const coachReady = isCoachLive();
  const youcam = getYouCamRuntime();
  const database = await getDatabaseHealth();

  const youCamApiCount = 5;
  const scanReady = youcam.hasApiKey || youcam.demoMode;
  const simulationReady = scanReady;
  const personalizationReady = scanReady;

  return NextResponse.json({
    status: "online",
    mode,
    scanReady,
    simulationReady,
    personalizationReady,
    coachReady,
    databaseReady: database.ready,
    databaseConfigured: database.configured,
    youCamApiCount,
    youCamApis: [
      "skin-analysis",
      "fitzpatrick-scale-analyzer",
      "skin-tone-analysis",
      "face-analyzer",
      "skin-simulation"
    ],
    message:
      mode === "live"
        ? `Skinova is online with ${youCamApiCount} YouCam APIs, Neon persistence, and live guidance flows.`
        : "Skinova is online in demo mode with representative scan, simulation, and guidance flows."
  });
}
