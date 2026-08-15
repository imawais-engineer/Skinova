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
};

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
  const embeddings = await embedTexts(items.map((item) => `${item.title}\n${item.content}`));

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
