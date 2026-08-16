import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../lib/auth";
import { generateStructuredRoutine } from "../../../lib/routine-llm";
import type { AnalysisResult } from "../../../lib/skinova-data";

type RoutineRequestBody = {
  analysis?: AnalysisResult;
};

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as RoutineRequestBody;

  if (!body.analysis?.concerns?.length) {
    return NextResponse.json({ error: "analysis is required" }, { status: 400 });
  }

  const plan = await generateStructuredRoutine(body.analysis);

  return NextResponse.json({ plan });
}
