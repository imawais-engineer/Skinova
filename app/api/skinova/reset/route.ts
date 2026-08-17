import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../lib/auth";
import { clearCoachMemory } from "../../../lib/coach-memory";
import { deleteUserRoutinePlans } from "../../../lib/routine-db";
import { deleteUserScans } from "../../../lib/scan-db";
import { deleteUserSimulationResults } from "../../../lib/simulation-db";

export type ResetTarget = "scan" | "routine" | "coach";

const validTargets = new Set<ResetTarget>(["scan", "routine", "coach"]);

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { targets?: string[] };
  const rawTargets = Array.isArray(body.targets) ? body.targets : [];
  const targets = [...new Set(rawTargets.filter((target): target is ResetTarget => validTargets.has(target as ResetTarget)))];

  if (!targets.length) {
    return NextResponse.json({ error: "Select at least one data type to reset." }, { status: 400 });
  }

  const cleared: ResetTarget[] = [];

  if (targets.includes("scan") || targets.includes("routine")) {
    await deleteUserScans(session.id);
    await deleteUserRoutinePlans(session.id);
    await deleteUserSimulationResults(session.id);
    cleared.push("scan", "routine");
  }

  if (targets.includes("coach")) {
    await clearCoachMemory(session.id);
    cleared.push("coach");
  }

  return NextResponse.json({
    ok: true,
    cleared: [...new Set(cleared)],
    message: buildResetMessage([...new Set(cleared)])
  });
}

function buildResetMessage(cleared: ResetTarget[]) {
  const parts: string[] = [];

  if (cleared.includes("scan")) {
    parts.push("scan results");
  }

  if (cleared.includes("routine")) {
    parts.push("routine, simulation previews, and progress views");
  }

  if (cleared.includes("coach")) {
    parts.push("Skin Coach history");
  }

  if (!parts.length) {
    return "Nothing was reset.";
  }

  return `Cleared ${parts.join(", ")}.`;
}
