import "server-only";
import { neon } from "@neondatabase/serverless";

export type SimulationResultRecord = {
  user_id: string;
  scan_key: string;
  result_url: string;
  mode: "demo" | "live";
  updated_at: string;
};

function getSql() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(url);
}

let simulationSchemaReady: Promise<void> | null = null;

export async function ensureSimulationSchema() {
  if (!simulationSchemaReady) {
    simulationSchemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS user_simulation_results (
          user_id TEXT NOT NULL,
          scan_key TEXT NOT NULL,
          result_url TEXT NOT NULL,
          mode TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (user_id, scan_key)
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS user_simulation_results_user_idx ON user_simulation_results (user_id, updated_at DESC)`;
    })();
  }

  await simulationSchemaReady;
}

export async function getUserSimulationResult(
  userId: string,
  scanKey: string
): Promise<SimulationResultRecord | null> {
  await ensureSimulationSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT user_id, scan_key, result_url, mode, updated_at::text AS updated_at
    FROM user_simulation_results
    WHERE user_id = ${userId} AND scan_key = ${scanKey}
    LIMIT 1
  `;

  return (rows[0] as SimulationResultRecord | undefined) || null;
}

export async function saveUserSimulationResult(input: {
  userId: string;
  scanKey: string;
  resultUrl: string;
  mode: "demo" | "live";
}) {
  await ensureSimulationSchema();
  const sql = getSql();

  const rows = await sql`
    INSERT INTO user_simulation_results (user_id, scan_key, result_url, mode, updated_at)
    VALUES (${input.userId}, ${input.scanKey}, ${input.resultUrl}, ${input.mode}, NOW())
    ON CONFLICT (user_id, scan_key) DO UPDATE SET
      result_url = EXCLUDED.result_url,
      mode = EXCLUDED.mode,
      updated_at = NOW()
    RETURNING user_id, scan_key, result_url, mode, updated_at::text AS updated_at
  `;

  return rows[0] as SimulationResultRecord;
}

export async function deleteUserSimulationResults(userId: string) {
  await ensureSimulationSchema();
  const sql = getSql();
  await sql`DELETE FROM user_simulation_results WHERE user_id = ${userId}`;
}
