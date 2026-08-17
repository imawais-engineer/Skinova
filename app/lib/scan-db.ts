import "server-only";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import type { AnalysisResult } from "./skinova-data";

export type UserScanRecord = {
  id: string;
  user_id: string;
  mode: "demo" | "live";
  overall_score: number;
  analysis: AnalysisResult;
  youcam_file_id: string | null;
  preview_image_url: string | null;
  sample_id: string | null;
  scanned_at: string;
  created_at: string;
};

export type ScanTaskContext = {
  task_id: string;
  user_id: string;
  file_id: string | null;
  mode: "demo" | "live";
  sample_id?: string | null;
};

function getSql() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(url);
}

let scanSchemaReady: Promise<void> | null = null;

export async function ensureScanSchema() {
  if (!scanSchemaReady) {
    scanSchemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS user_scans (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          mode TEXT NOT NULL,
          overall_score INTEGER NOT NULL,
          analysis JSONB NOT NULL,
          youcam_file_id TEXT,
          scanned_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS scan_task_context (
          task_id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          file_id TEXT,
          mode TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS user_scans_user_id_idx ON user_scans (user_id, scanned_at DESC)`;
      await sql`ALTER TABLE scan_task_context ADD COLUMN IF NOT EXISTS sample_id TEXT`;
      await sql`ALTER TABLE user_scans ADD COLUMN IF NOT EXISTS preview_image_url TEXT`;
      await sql`ALTER TABLE user_scans ADD COLUMN IF NOT EXISTS sample_id TEXT`;
    })();
  }

  await scanSchemaReady;
}

export async function saveScanTaskContext(input: ScanTaskContext) {
  await ensureScanSchema();
  const sql = getSql();

  await sql`
    INSERT INTO scan_task_context (task_id, user_id, file_id, mode, sample_id)
    VALUES (${input.task_id}, ${input.user_id}, ${input.file_id}, ${input.mode}, ${input.sample_id || null})
    ON CONFLICT (task_id) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      file_id = EXCLUDED.file_id,
      mode = EXCLUDED.mode,
      sample_id = EXCLUDED.sample_id
  `;
}

export async function getScanTaskContext(taskId: string): Promise<ScanTaskContext | null> {
  await ensureScanSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT task_id, user_id, file_id, mode, sample_id
    FROM scan_task_context
    WHERE task_id = ${taskId}
    LIMIT 1
  `;

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    task_id: String(row.task_id),
    user_id: String(row.user_id),
    file_id: row.file_id ? String(row.file_id) : null,
    mode: row.mode === "live" ? "live" : "demo",
    sample_id: row.sample_id ? String(row.sample_id) : null
  };
}

export async function deleteScanTaskContext(taskId: string) {
  await ensureScanSchema();
  const sql = getSql();
  await sql`DELETE FROM scan_task_context WHERE task_id = ${taskId}`;
}

export async function saveUserScan(input: {
  userId: string;
  mode: "demo" | "live";
  analysis: AnalysisResult;
  youcamFileId?: string | null;
  previewImageUrl?: string | null;
  sampleId?: string | null;
  scannedAt: string;
  id?: string;
}) {
  await ensureScanSchema();
  const sql = getSql();
  const id = input.id || randomUUID();

  const rows = await sql`
    INSERT INTO user_scans (
      id,
      user_id,
      mode,
      overall_score,
      analysis,
      youcam_file_id,
      preview_image_url,
      sample_id,
      scanned_at
    )
    VALUES (
      ${id},
      ${input.userId},
      ${input.mode},
      ${input.analysis.overallScore},
      ${JSON.stringify(input.analysis)}::jsonb,
      ${input.youcamFileId || null},
      ${input.previewImageUrl || null},
      ${input.sampleId || null},
      ${input.scannedAt}
    )
    RETURNING
      id,
      user_id,
      mode,
      overall_score,
      analysis,
      youcam_file_id,
      preview_image_url,
      sample_id,
      scanned_at::text AS scanned_at,
      created_at::text AS created_at
  `;

  return rows[0] as UserScanRecord;
}

export async function listUserScans(userId: string, limit = 12): Promise<UserScanRecord[]> {
  await ensureScanSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT
      id,
      user_id,
      mode,
      overall_score,
      analysis,
      youcam_file_id,
      preview_image_url,
      sample_id,
      scanned_at::text AS scanned_at,
      created_at::text AS created_at
    FROM user_scans
    WHERE user_id = ${userId}
    ORDER BY scanned_at DESC
    LIMIT ${limit}
  `;

  return rows as UserScanRecord[];
}

export async function getLatestUserScan(userId: string): Promise<UserScanRecord | null> {
  const scans = await listUserScans(userId, 1);
  return scans[0] || null;
}

export async function getUserScanById(userId: string, scanId: string): Promise<UserScanRecord | null> {
  await ensureScanSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT
      id,
      user_id,
      mode,
      overall_score,
      analysis,
      youcam_file_id,
      preview_image_url,
      sample_id,
      scanned_at::text AS scanned_at,
      created_at::text AS created_at
    FROM user_scans
    WHERE user_id = ${userId} AND id = ${scanId}
    LIMIT 1
  `;

  return (rows[0] as UserScanRecord | undefined) || null;
}

export async function deleteUserScans(userId: string) {
  await ensureScanSchema();
  const sql = getSql();
  await sql`DELETE FROM user_scans WHERE user_id = ${userId}`;
  await sql`DELETE FROM scan_task_context WHERE user_id = ${userId}`;
}

export function serializeUserScan(scan: UserScanRecord) {
  return {
    id: scan.id,
    analysis: scan.analysis,
    mode: scan.mode,
    scannedAt: scan.scanned_at,
    fileId: scan.youcam_file_id,
    previewImageUrl: scan.preview_image_url,
    sampleId: scan.sample_id
  };
}

export async function updateUserScanPreview(
  userId: string,
  scanId: string,
  input: { previewImageUrl?: string | null; sampleId?: string | null }
) {
  await ensureScanSchema();
  const sql = getSql();

  const rows = await sql`
    UPDATE user_scans
    SET
      preview_image_url = COALESCE(${input.previewImageUrl ?? null}, preview_image_url),
      sample_id = COALESCE(${input.sampleId ?? null}, sample_id)
    WHERE user_id = ${userId} AND id = ${scanId}
    RETURNING
      id,
      user_id,
      mode,
      overall_score,
      analysis,
      youcam_file_id,
      preview_image_url,
      sample_id,
      scanned_at::text AS scanned_at,
      created_at::text AS created_at
  `;

  return (rows[0] as UserScanRecord | undefined) || null;
}
