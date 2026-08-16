import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../lib/auth";
import { getLatestUserScan, listUserScans, saveUserScan } from "../../../lib/scan-db";
import type { AnalysisResult } from "../../../lib/skinova-data";

type SaveScanBody = {
  analysis?: AnalysisResult;
  mode?: "demo" | "live";
  scannedAt?: string;
  youcamFileId?: string | null;
};

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const latestOnly = request.nextUrl.searchParams.get("latest") === "1";

  if (latestOnly) {
    const latest = await getLatestUserScan(session.id);

    if (!latest) {
      return NextResponse.json({ scan: null });
    }

    return NextResponse.json({
      scan: {
        id: latest.id,
        analysis: latest.analysis,
        mode: latest.mode,
        scannedAt: latest.scanned_at,
        fileId: latest.youcam_file_id
      }
    });
  }

  const scans = await listUserScans(session.id);

  return NextResponse.json({
    scans: scans.map((scan) => ({
      id: scan.id,
      analysis: scan.analysis,
      mode: scan.mode,
      overallScore: scan.overall_score,
      scannedAt: scan.scanned_at,
      fileId: scan.youcam_file_id
    }))
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as SaveScanBody;

  if (!body.analysis || typeof body.analysis.overallScore !== "number") {
    return NextResponse.json({ error: "analysis is required." }, { status: 400 });
  }

  const saved = await saveUserScan({
    userId: session.id,
    mode: body.mode === "live" ? "live" : "demo",
    analysis: body.analysis,
    youcamFileId: body.youcamFileId || null,
    scannedAt: body.scannedAt || new Date().toISOString()
  });

  return NextResponse.json({
    ok: true,
    scan: {
      id: saved.id,
      analysis: saved.analysis,
      mode: saved.mode,
      scannedAt: saved.scanned_at,
      fileId: saved.youcam_file_id
    }
  });
}
