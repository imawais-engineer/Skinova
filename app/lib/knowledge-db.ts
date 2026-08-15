import "server-only";
import { neon } from "@neondatabase/serverless";
import { getAiRuntime } from "./ai-runtime";

export type KnowledgeChunkRecord = {
  id: string;
  topic: string;
  title: string;
  content: string;
  score?: number;
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
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
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

export async function saveCoachMessage(input: { id: string; userId: string; role: "user" | "coach"; content: string }) {
  await ensureKnowledgeSchema();
  const sql = getSql();
  await sql`
    INSERT INTO coach_messages (id, user_id, role, content)
    VALUES (${input.id}, ${input.userId}, ${input.role}, ${input.content})
  `;
}

export function getEmbeddingDimensions() {
  return getAiRuntime().embeddingDimensions;
}
