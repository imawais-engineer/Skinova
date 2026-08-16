import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../lib/auth";
import { getLatestUserScan, getUserScanById } from "../../../lib/scan-db";
import { runSkinSimulation } from "../../../lib/run-skin-simulation";

type SimulationBody = {
  scanId?: string;
  fileId?: string;
};

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as SimulationBody;
  let fileId = body.fileId || null;

  if (body.scanId) {
    const scan = await getUserScanById(session.id, body.scanId);
    if (!scan) {
      return NextResponse.json({ error: "Scan not found." }, { status: 404 });
    }
    fileId = scan.youcam_file_id;
  }

  if (!fileId) {
    const latest = await getLatestUserScan(session.id);
    fileId = latest?.youcam_file_id || null;
  }

  try {
    const result = await runSkinSimulation({
      fileId,
      forceDemo: !fileId
    });

    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Simulation could not be started.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
