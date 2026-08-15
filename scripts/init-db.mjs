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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS knowledge_chunks_topic_idx ON knowledge_chunks (topic)`;

console.log(JSON.stringify({ ok: true, message: "Neon database schema is ready." }, null, 2));
