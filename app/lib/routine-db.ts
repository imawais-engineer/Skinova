import "server-only";
import { neon } from "@neondatabase/serverless";
import type { AnalysisResult } from "./skinova-data";
import type { StructuredRoutinePlan } from "./routine-types";

export type RoutinePlanRecord = {
  user_id: string;
  scan_key: string;
  plan: StructuredRoutinePlan;
  source: string;
  updated_at: string;
};

function getSql() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(url);
}

let routineSchemaReady: Promise<void> | null = null;

export async function ensureRoutineSchema() {
  if (!routineSchemaReady) {
    routineSchemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS user_routine_plans (
          user_id TEXT NOT NULL,
          scan_key TEXT NOT NULL,
          plan JSONB NOT NULL,
          source TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (user_id, scan_key)
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS user_routine_plans_user_idx ON user_routine_plans (user_id, updated_at DESC)`;
    })();
  }

  await routineSchemaReady;
}

export function routineScanKey(input: {
  analysis: AnalysisResult;
  scanId?: string | null;
  scannedAt?: string | null;
}) {
  if (input.scanId) {
    return input.scanId;
  }

  const concernKey = input.analysis.concerns.map((concern) => `${concern.type}:${concern.score}`).join("|");
  return `${input.analysis.overallScore}:${input.scannedAt || "session"}:${concernKey}`;
}

export async function getUserRoutinePlan(userId: string, scanKey: string): Promise<RoutinePlanRecord | null> {
  await ensureRoutineSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT user_id, scan_key, plan, source, updated_at::text AS updated_at
    FROM user_routine_plans
    WHERE user_id = ${userId} AND scan_key = ${scanKey}
    LIMIT 1
  `;

  return (rows[0] as RoutinePlanRecord | undefined) || null;
}

export async function saveUserRoutinePlan(input: {
  userId: string;
  scanKey: string;
  plan: StructuredRoutinePlan;
}) {
  await ensureRoutineSchema();
  const sql = getSql();

  const rows = await sql`
    INSERT INTO user_routine_plans (user_id, scan_key, plan, source, updated_at)
    VALUES (
      ${input.userId},
      ${input.scanKey},
      ${JSON.stringify(input.plan)}::jsonb,
      ${input.plan.source},
      NOW()
    )
    ON CONFLICT (user_id, scan_key) DO UPDATE SET
      plan = EXCLUDED.plan,
      source = EXCLUDED.source,
      updated_at = NOW()
    RETURNING user_id, scan_key, plan, source, updated_at::text AS updated_at
  `;

  return rows[0] as RoutinePlanRecord;
}

export async function deleteUserRoutinePlans(userId: string) {
  await ensureRoutineSchema();
  const sql = getSql();
  await sql`DELETE FROM user_routine_plans WHERE user_id = ${userId}`;
}
