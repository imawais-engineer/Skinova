import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL?.trim();

if (!url) {
  console.error(JSON.stringify({ ok: false, error: "DATABASE_URL is not configured." }, null, 2));
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

console.log(JSON.stringify({ ok: true, message: "Neon database schema is ready." }, null, 2));
