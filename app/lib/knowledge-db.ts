import "server-only";
import { neon } from "@neondatabase/serverless";
import { getAiRuntime } from "./ai-runtime";
import type { AnalysisResult } from "./skinova-data";

export type KnowledgeChunkRecord = {
  id: string;
  topic: string;
  title: string;
  content: string;
  score?: number;
};

export type CoachMessageMetadata = {
  type?: "scan_anchor" | "chat";
  analysis?: AnalysisResult;
  mode?: "demo" | "live";
  scannedAt?: string;
  fingerprint?: string;
};

export type CoachThreadRow = {
  id: string;
  role: string;
  content: string;
  created_at: string;
  metadata: CoachMessageMetadata | null;
};

function getSql() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(url);
}

let knowledgeSchemaReady: Promise<void> | null = null;

export async function ensureKnowledgeSchema() {
  if (!knowledgeSchemaReady) {
    knowledgeSchemaReady = (async () => {
      const sql = getSql();
      await sql`CREATE EXTENSION IF NOT EXISTS vector`;
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
    })();
  }

  await knowledgeSchemaReady;
}

export async function countKnowledgeChunks() {
  await ensureKnowledgeSchema();
  const sql = getSql();
  const rows = await sql`SELECT COUNT(*)::int AS count FROM knowledge_chunks`;
  return Number(rows[0]?.count || 0);
}

export async function upsertKnowledgeChunk(input: {
  id: string;
  topic: string;
  title: string;
  content: string;
  embedding: number[];
}) {
  await ensureKnowledgeSchema();
  const sql = getSql();
  const vectorLiteral = `[${input.embedding.join(",")}]`;

  await sql`
    INSERT INTO knowledge_chunks (id, topic, title, content, embedding, updated_at)
    VALUES (
      ${input.id},
      ${input.topic},
      ${input.title},
      ${input.content},
      ${vectorLiteral}::vector,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      topic = EXCLUDED.topic,
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      embedding = EXCLUDED.embedding,
      updated_at = NOW()
  `;
}

export async function searchKnowledgeChunks(embedding: number[], limit = 5): Promise<KnowledgeChunkRecord[]> {
  await ensureKnowledgeSchema();
  const sql = getSql();
  const vectorLiteral = `[${embedding.join(",")}]`;

  const rows = await sql`
    SELECT
      id,
      topic,
      title,
      content,
      1 - (embedding <=> ${vectorLiteral}::vector) AS score
    FROM knowledge_chunks
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${vectorLiteral}::vector
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: String(row.id),
    topic: String(row.topic),
    title: String(row.title),
    content: String(row.content),
    score: Number(row.score)
  }));
}

export async function saveCoachMessage(input: {
  id: string;
  userId: string;
  role: "user" | "coach" | "scan";
  content: string;
  metadata?: CoachMessageMetadata | null;
}) {
  await ensureKnowledgeSchema();
  const sql = getSql();
  const metadataJson = input.metadata ? JSON.stringify(input.metadata) : null;

  await sql`
    INSERT INTO coach_messages (id, user_id, role, content, metadata)
    VALUES (
      ${input.id},
      ${input.userId},
      ${input.role},
      ${input.content},
      ${metadataJson}::jsonb
    )
  `;
}

export async function deleteCoachMessagesForUser(userId: string) {
  await ensureKnowledgeSchema();
  const sql = getSql();
  await sql`DELETE FROM coach_messages WHERE user_id = ${userId}`;
}

export async function getCoachThreadRows(userId: string, limit = 40): Promise<CoachThreadRow[]> {
  await ensureKnowledgeSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, role, content, created_at, metadata
    FROM coach_messages
    WHERE user_id = ${userId}
    ORDER BY created_at ASC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: String(row.id),
    role: String(row.role),
    content: String(row.content),
    created_at: String(row.created_at),
    metadata: (row.metadata as CoachMessageMetadata | null) ?? null
  }));
}

export async function getRecentCoachMessages(userId: string, limit = 8) {
  const rows = await getCoachThreadRows(userId, limit);
  return rows
    .filter((row) => row.role === "user" || row.role === "coach")
    .map((row) => ({
      role: row.role as "user" | "coach",
      content: row.content
    }));
}

export async function getKnowledgeChunksByTopics(topics: string[], limitPerTopic = 2): Promise<KnowledgeChunkRecord[]> {
  if (!topics.length) {
    return [];
  }

  await ensureKnowledgeSchema();
  const sql = getSql();
  const results: KnowledgeChunkRecord[] = [];

  for (const topic of topics.slice(0, 4)) {
    const rows = await sql`
      SELECT id, topic, title, content
      FROM knowledge_chunks
      WHERE topic = ${topic}
      ORDER BY updated_at DESC
      LIMIT ${limitPerTopic}
    `;

    for (const row of rows) {
      results.push({
        id: String(row.id),
        topic: String(row.topic),
        title: String(row.title),
        content: String(row.content)
      });
    }
  }

  return results;
}

export function getEmbeddingDimensions() {
  return getAiRuntime().embeddingDimensions;
}
