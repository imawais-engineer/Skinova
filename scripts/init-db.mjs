import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL?.trim();

if (!url) {
  console.error(JSON.stringify({ ok: false, error: "DATABASE_URL is not configured." }, null, 2));
  process.exit(1);
}

const sql = neon(url);

await sql`CREATE EXTENSION IF NOT EXISTS vector`;
await sql`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS coach_messages (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
await sql`ALTER TABLE coach_messages ADD COLUMN IF NOT EXISTS metadata JSONB`;
await sql`CREATE INDEX IF NOT EXISTS knowledge_chunks_topic_idx ON knowledge_chunks (topic)`;
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

console.log(JSON.stringify({ ok: true, message: "Neon database schema is ready." }, null, 2));
