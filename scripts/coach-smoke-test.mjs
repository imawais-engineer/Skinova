/**
 * Smoke test for Skin Coach Qwen + RAG pipeline (no auth required).
 * Usage: node --env-file=.env scripts/coach-smoke-test.mjs "Why is my skin red this week?"
 */
import fs from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const question = process.argv[2] || "Why is my skin red this week?";
const url = process.env.DATABASE_URL?.trim();
const apiKey = process.env.QWEN_API_KEY?.trim();
const baseUrl = (process.env.QWEN_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1").replace(/\/$/, "");
const llmModel = process.env.COACH_LLM_MODEL || "qwen3-max";
const embeddingModel = process.env.EMBEDDING_MODEL || "text-embedding-v4";
const dimensions = Number(process.env.EMBEDDING_DIMENSIONS || 1536);

if (!url || !apiKey) {
  console.error(JSON.stringify({ ok: false, error: "DATABASE_URL and QWEN_API_KEY required" }, null, 2));
  process.exit(1);
}

const sql = neon(url);

async function embed(text) {
  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: embeddingModel, input: [text], dimensions })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || "embed failed");
  return payload.data[0].embedding;
}

async function chat(system, user) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: llmModel,
      temperature: 0.2,
      max_tokens: 450,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || "chat failed");
  return payload.choices[0].message.content.trim();
}

async function main() {
  const embedding = await embed(question);
  const vectorLiteral = `[${embedding.join(",")}]`;
  const rows = await sql`
    SELECT title, topic, content, 1 - (embedding <=> ${vectorLiteral}::vector) AS score
    FROM knowledge_chunks
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${vectorLiteral}::vector
    LIMIT 5
  `;

  const context = rows.map((row, i) => `[${i + 1}] (${row.topic}) ${row.title}\n${row.content}`).join("\n\n");
  const topScore = Number(rows[0]?.score || 0);

  const system = [
    "You are Skinova Skin Coach.",
    "Answer ONLY using retrieved Skinova Knowledge. Do not invent facts.",
    "3-5 sentences. Educational only, not medical diagnosis."
  ].join(" ");

  const user = `Knowledge:\n${context}\n\nQuestion: ${question}`;

  const answer = await chat(system, user);

  console.log(
    JSON.stringify(
      {
        ok: true,
        question,
        topScore: Number(topScore.toFixed(3)),
        chunks: rows.length,
        answerPreview: answer.slice(0, 280)
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
