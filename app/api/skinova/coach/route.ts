import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../lib/auth";
import { runCoachConversation } from "../../../lib/coach-service";
import type { AnalysisResult } from "../../../lib/skinova-data";

type CoachRequestBody = {
  message?: string;
  analysis?: AnalysisResult | null;
};

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
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
    analysis: body.analysis || null
  });

  return NextResponse.json(result);
}
