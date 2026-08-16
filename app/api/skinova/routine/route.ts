import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "../../../lib/api-guard";
import { getSession } from "../../../lib/auth";
import { getUserRoutinePlan, routineScanKey, saveUserRoutinePlan } from "../../../lib/routine-db";
import { generateStructuredRoutine } from "../../../lib/routine-llm";
import type { AnalysisResult } from "../../../lib/skinova-data";

type RoutineRequestBody = {
  analysis?: AnalysisResult;
  scanId?: string | null;
  scannedAt?: string | null;
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

  const saved = await getUserRoutinePlan(session.id, scanKey);

  if (!saved) {
    return NextResponse.json({ plan: null });
  }

  return NextResponse.json({
    plan: saved.plan,
    scanKey: saved.scan_key,
    updatedAt: saved.updated_at
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const limited = enforceRateLimit(session.id, "routine");
  if (limited instanceof NextResponse) {
    return limited;
  }

  const body = (await request.json().catch(() => ({}))) as RoutineRequestBody;

  if (!body.analysis?.concerns?.length) {
    return NextResponse.json({ error: "analysis is required" }, { status: 400 });
  }

  const scanKey = routineScanKey({
    analysis: body.analysis,
    scanId: body.scanId,
    scannedAt: body.scannedAt
  });

  const saved = await getUserRoutinePlan(session.id, scanKey);
  if (saved) {
    return NextResponse.json(
      { plan: saved.plan, scanKey, cached: true, updatedAt: saved.updated_at },
      { headers: limited.headers }
    );
  }

  const plan = await generateStructuredRoutine(body.analysis);
  const record = await saveUserRoutinePlan({
    userId: session.id,
    scanKey,
    plan
  });

  return NextResponse.json(
    { plan, scanKey, cached: false, updatedAt: record.updated_at },
    { headers: limited.headers }
  );
}
