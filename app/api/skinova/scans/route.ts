import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../lib/auth";
import {
  getLatestUserScan,
  listUserScans,
  saveUserScan,
  serializeUserScan,
  updateUserScanPreview
} from "../../../lib/scan-db";
import type { AnalysisResult } from "../../../lib/skinova-data";

const MAX_PREVIEW_URL_LENGTH = 4_000_000;

type SaveScanBody = {
  analysis?: AnalysisResult;
  mode?: "demo" | "live";
  scannedAt?: string;
  youcamFileId?: string | null;
  previewImageUrl?: string | null;
  sampleId?: string | null;
};

type PatchScanBody = {
  scanId?: string;
  previewImageUrl?: string | null;
  sampleId?: string | null;
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

    return NextResponse.json({ scan: serializeUserScan(latest) });
  }

  const scans = await listUserScans(session.id);

  return NextResponse.json({
    scans: scans.map((scan) => ({
      ...serializeUserScan(scan),
      overallScore: scan.overall_score
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

  if (body.previewImageUrl && body.previewImageUrl.length > MAX_PREVIEW_URL_LENGTH) {
    return NextResponse.json({ error: "Preview image is too large to store." }, { status: 400 });
  }

  const saved = await saveUserScan({
    userId: session.id,
    mode: body.mode === "live" ? "live" : "demo",
    analysis: body.analysis,
    youcamFileId: body.youcamFileId || null,
    previewImageUrl: body.previewImageUrl || null,
    sampleId: body.sampleId || null,
    scannedAt: body.scannedAt || new Date().toISOString()
  });

  return NextResponse.json({
    ok: true,
    scan: serializeUserScan(saved)
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as PatchScanBody;

  if (!body.scanId) {
    return NextResponse.json({ error: "scanId is required." }, { status: 400 });
  }

  if (body.previewImageUrl && body.previewImageUrl.length > MAX_PREVIEW_URL_LENGTH) {
    return NextResponse.json({ error: "Preview image is too large to store." }, { status: 400 });
  }

  const updated = await updateUserScanPreview(session.id, body.scanId, {
    previewImageUrl: body.previewImageUrl,
    sampleId: body.sampleId
  });

  if (!updated) {
    return NextResponse.json({ error: "Scan not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    scan: serializeUserScan(updated)
  });
}
