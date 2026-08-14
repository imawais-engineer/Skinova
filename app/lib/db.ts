import { neon } from "@neondatabase/serverless";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

let schemaReady: Promise<void> | null = null;

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return url;
}

function getSql() {
  return neon(getDatabaseUrl());
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })();
  }

  await schemaReady;
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, name, email, password_hash, created_at::text AS created_at
    FROM users
    WHERE LOWER(email) = LOWER(${email.trim()})
    LIMIT 1
  `;

  return rows[0] as UserRecord | undefined;
}

export async function findUserById(id: string): Promise<UserRecord | undefined> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, name, email, password_hash, created_at::text AS created_at
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] as UserRecord | undefined;
}

export async function createUser(input: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}): Promise<UserRecord> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO users (id, name, email, password_hash)
    VALUES (
      ${input.id},
      ${input.name.trim()},
      ${input.email.trim().toLowerCase()},
      ${input.passwordHash}
    )
    RETURNING id, name, email, password_hash, created_at::text AS created_at
  `;

  return rows[0] as UserRecord;
}

export async function initializeDatabase() {
  await ensureSchema();
}
