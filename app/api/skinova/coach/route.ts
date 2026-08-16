import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "../../../lib/api-guard";
import { getSession } from "../../../lib/auth";
import { loadCoachThread, runCoachConversation } from "../../../lib/coach-service";
import type { AnalysisResult } from "../../../lib/skinova-data";

type CoachRequestBody = {
  message?: string;
  analysis?: AnalysisResult | null;
  scanMode?: "demo" | "live";
  scannedAt?: string;
};

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const thread = await loadCoachThread(session.id);

  return NextResponse.json({
    messages: thread.messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content
    })),
    latestScan: thread.latestScan,
    mode: thread.mode
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const limited = enforceRateLimit(session.id, "coach");
  if (limited instanceof NextResponse) {
    return limited;
  }

  const body = (await request.json().catch(() => ({}))) as CoachRequestBody;
  const message = (body.message || "").trim();

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  if (message.length > 500) {
    return NextResponse.json({ error: "message must be 500 characters or fewer" }, { status: 400 });
  }

  const result = await runCoachConversation({
    userId: session.id,
    message,
    analysis: body.analysis || null,
    scanMode: body.scanMode,
    scannedAt: body.scannedAt
  });

  return NextResponse.json(result, { headers: limited.headers });
}
