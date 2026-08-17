import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "../../../lib/api-guard";
import { getSession } from "../../../lib/auth";
import { routineScanKey } from "../../../lib/routine-db";
import { getLatestUserScan, getUserScanById } from "../../../lib/scan-db";
import { getUserSimulationResult } from "../../../lib/simulation-db";
import { runSkinSimulation } from "../../../lib/run-skin-simulation";

type SimulationBody = {
  scanId?: string;
  fileId?: string;
  scanKey?: string;
};

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const scanKey = request.nextUrl.searchParams.get("scanKey");

  if (!scanKey) {
    return NextResponse.json({ error: "scanKey is required." }, { status: 400 });
  }

  const saved = await getUserSimulationResult(session.id, scanKey);

  if (!saved) {
    return NextResponse.json({ result: null });
  }

  return NextResponse.json({
    result: {
      resultUrl: saved.result_url,
      mode: saved.mode,
      updatedAt: saved.updated_at
    }
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const limited = enforceRateLimit(session.id, "simulation");
  if (limited instanceof NextResponse) {
    return limited;
  }

  const body = (await request.json().catch(() => ({}))) as SimulationBody;
  let fileId = body.fileId || null;
  let scanKey = body.scanKey || body.scanId || null;

  if (body.scanId) {
    const scan = await getUserScanById(session.id, body.scanId);
    if (!scan) {
      return NextResponse.json({ error: "Scan not found." }, { status: 404 });
    }
    fileId = scan.youcam_file_id;
    scanKey =
      scanKey ||
      routineScanKey({
        analysis: scan.analysis,
        scanId: scan.id,
        scannedAt: scan.scanned_at
      });
  }

  if (!fileId) {
    const latest = await getLatestUserScan(session.id);
    fileId = latest?.youcam_file_id || null;
    if (!scanKey && latest) {
      scanKey = routineScanKey({
        analysis: latest.analysis,
        scanId: latest.id,
        scannedAt: latest.scanned_at
      });
    }
  }

  try {
    const result = await runSkinSimulation({
      fileId,
      forceDemo: !fileId
    });

    const pollingUrl = scanKey ? `${result.pollingUrl}?scanKey=${encodeURIComponent(scanKey)}` : result.pollingUrl;

    return NextResponse.json({ ...result, pollingUrl, scanKey }, { status: 202, headers: limited.headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Simulation could not be started.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
