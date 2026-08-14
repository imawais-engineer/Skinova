import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "skinova.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const globalForDb = globalThis as typeof globalThis & { skinovaDb?: Database.Database };

const db =
  globalForDb.skinovaDb ??
  new Database(dbPath, {
    verbose: process.env.NODE_ENV === "development" ? undefined : undefined
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.skinovaDb = db;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

export function findUserByEmail(email: string): UserRecord | undefined {
  return db.prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE").get(email.trim().toLowerCase()) as
    | UserRecord
    | undefined;
}

export function findUserById(id: string): UserRecord | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRecord | undefined;
}

export function createUser(input: { id: string; name: string; email: string; passwordHash: string }): UserRecord {
  const createdAt = new Date().toISOString();
  db.prepare("INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)").run(
    input.id,
    input.name.trim(),
    input.email.trim().toLowerCase(),
    input.passwordHash,
    createdAt
  );

  return findUserById(input.id)!;
}
