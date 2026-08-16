import "server-only";
import { neon } from "@neondatabase/serverless";

const REQUIRED_TABLES = [
  "users",
  "knowledge_chunks",
  "coach_messages",
  "user_scans",
  "scan_task_context",
  "user_routine_plans"
] as const;

export type DatabaseHealth = {
  configured: boolean;
  ready: boolean;
  tables: Record<(typeof REQUIRED_TABLES)[number], boolean>;
};

export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    return {
      configured: false,
      ready: false,
      tables: Object.fromEntries(REQUIRED_TABLES.map((table) => [table, false])) as DatabaseHealth["tables"]
    };
  }

  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY(${REQUIRED_TABLES as unknown as string[]})
    `;

    const found = new Set(rows.map((row) => String(row.table_name)));
    const tables = Object.fromEntries(REQUIRED_TABLES.map((table) => [table, found.has(table)])) as DatabaseHealth["tables"];

    return {
      configured: true,
      ready: REQUIRED_TABLES.every((table) => found.has(table)),
      tables
    };
  } catch {
    return {
      configured: true,
      ready: false,
      tables: Object.fromEntries(REQUIRED_TABLES.map((table) => [table, false])) as DatabaseHealth["tables"]
    };
  }
}
