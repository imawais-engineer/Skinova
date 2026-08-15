import "server-only";
import { embedText } from "./embeddings";
import { countKnowledgeChunks, searchKnowledgeChunks } from "./knowledge-db";
import { seedKnowledgeBase } from "./knowledge-seed";

const MIN_SCORE = 0.2;

export async function retrieveKnowledgeContext(query: string, limit = 5) {
  if ((await countKnowledgeChunks()) === 0) {
    try {
      await seedKnowledgeBase();
    } catch {
      return "";
    }
  }

  try {
    const embedding = await embedText(query);
    const chunks = await searchKnowledgeChunks(embedding, limit);
    const relevant = chunks.filter((chunk) => (chunk.score ?? 0) >= MIN_SCORE);

    if (!relevant.length) {
      return "";
    }

    return relevant
      .map((chunk, index) => `[${index + 1}] ${chunk.title}\n${chunk.content}`)
      .join("\n\n");
  } catch {
    return "";
  }
}
