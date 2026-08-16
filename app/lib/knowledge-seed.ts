import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { embedTexts } from "./embeddings";
import { countKnowledgeChunks, upsertKnowledgeChunk } from "./knowledge-db";

type KnowledgeSeedItem = {
  id: string;
  topic: string;
  title: string;
  content: string;
  keywords?: string[];
};

export const KNOWLEDGE_CATALOG_VERSION = "2026-08-16-v2";

export function knowledgeEmbeddingText(item: KnowledgeSeedItem) {
  const keywords = item.keywords?.length ? `Keywords: ${item.keywords.join(", ")}\n` : "";
  return `${item.topic}\n${item.title}\n${keywords}${item.content}`;
}

export async function loadKnowledgeSeed(): Promise<KnowledgeSeedItem[]> {
  const filePath = path.join(process.cwd(), "content", "knowledge", "skincare.json");
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as KnowledgeSeedItem[];
}

export async function seedKnowledgeBase(force = false) {
  if (!force && (await countKnowledgeChunks()) > 0) {
    return { inserted: 0, skipped: true };
  }

  const items = await loadKnowledgeSeed();
  const embeddings = await embedTexts(items.map((item) => knowledgeEmbeddingText(item)));

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    await upsertKnowledgeChunk({
      id: item.id,
      topic: item.topic,
      title: item.title,
      content: item.content,
      embedding: embeddings[index]
    });
  }

  return { inserted: items.length, skipped: false };
}
