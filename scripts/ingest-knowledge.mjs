import fs from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL?.trim();
const embeddingApiKey =
  process.env.EMBEDDING_API_KEY?.trim() ||
  process.env.COACH_LLM_API_KEY?.trim() ||
  process.env.OPENAI_API_KEY?.trim();
const embeddingBaseUrl = (
  process.env.EMBEDDING_API_BASE_URL?.trim() ||
  process.env.COACH_LLM_BASE_URL?.trim() ||
  process.env.OPENAI_BASE_URL?.trim() ||
  "https://api.openai.com/v1"
).replace(/\/$/, "");
const embeddingModel = process.env.EMBEDDING_MODEL?.trim() || "text-embedding-3-small";
const embeddingDimensions = Number(process.env.EMBEDDING_DIMENSIONS || 1536);

if (!url) {
  console.error(JSON.stringify({ ok: false, error: "DATABASE_URL is not configured." }, null, 2));
  process.exit(1);
}

if (!embeddingApiKey) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: "Set EMBEDDING_API_KEY, COACH_LLM_API_KEY, or OPENAI_API_KEY before ingesting knowledge."
      },
      null,
      2
    )
  );
  process.exit(1);
}

const sql = neon(url);
const force = process.argv.includes("--force");

async function embedTexts(texts) {
  const response = await fetch(`${embeddingBaseUrl}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${embeddingApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: embeddingModel,
      input: texts,
      dimensions: embeddingDimensions
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error?.message || "Embedding request failed.");
  }

  return payload.data.map((item) => item.embedding);
}

async function main() {
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

  const countRows = await sql`SELECT COUNT(*)::int AS count FROM knowledge_chunks`;
  const existing = Number(countRows[0]?.count || 0);

  if (!force && existing > 0) {
    console.log(JSON.stringify({ ok: true, inserted: 0, skipped: true, existing }, null, 2));
    return;
  }

  const filePath = path.join(process.cwd(), "content", "knowledge", "skincare.json");
  const items = JSON.parse(await fs.readFile(filePath, "utf8"));
  const embeddings = await embedTexts(items.map((item) => `${item.title}\n${item.content}`));

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const vectorLiteral = `[${embeddings[index].join(",")}]`;

    await sql`
      INSERT INTO knowledge_chunks (id, topic, title, content, embedding, updated_at)
      VALUES (
        ${item.id},
        ${item.topic},
        ${item.title},
        ${item.content},
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

  console.log(JSON.stringify({ ok: true, inserted: items.length, skipped: false }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
