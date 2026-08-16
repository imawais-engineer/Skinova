import "server-only";
import { embedText } from "./embeddings";
import { countKnowledgeChunks, getKnowledgeChunksByTopics, searchKnowledgeChunks } from "./knowledge-db";
import { KNOWLEDGE_CATALOG_VERSION, seedKnowledgeBase } from "./knowledge-seed";
import { detectCoachTopics } from "./coach-scope";

const MIN_VECTOR_SCORE = 0.28;
const MIN_CONTEXT_SCORE = 0.22;

export type RetrievedKnowledge = {
  context: string;
  chunkCount: number;
  topScore: number;
  sufficient: boolean;
};

function dedupeChunks<T extends { id: string }>(chunks: T[]) {
  const seen = new Set<string>();
  return chunks.filter((chunk) => {
    if (seen.has(chunk.id)) {
      return false;
    }
    seen.add(chunk.id);
    return true;
  });
}

function formatContext(chunks: Array<{ title: string; content: string; topic: string }>) {
  return chunks
    .map((chunk, index) => `[${index + 1}] (${chunk.topic}) ${chunk.title}\n${chunk.content}`)
    .join("\n\n");
}

export async function retrieveKnowledgeContext(query: string, options?: { topics?: string[]; limit?: number }) {
  if ((await countKnowledgeChunks()) === 0) {
    try {
      await seedKnowledgeBase();
    } catch {
      return emptyKnowledge();
    }
  }

  const detectedTopics = options?.topics?.length ? options.topics : detectCoachTopics(query);
  const limit = options?.limit ?? 6;

  try {
    const embedding = await embedText(query);
    const vectorChunks = await searchKnowledgeChunks(embedding, limit);
    const topicChunks = await getKnowledgeChunksByTopics(detectedTopics, 2);
    const merged = dedupeChunks([...vectorChunks, ...topicChunks]);

    const ranked = merged
      .map((chunk) => ({
        ...chunk,
        score: chunk.score ?? MIN_CONTEXT_SCORE
      }))
      .sort((left, right) => (right.score ?? 0) - (left.score ?? 0));

    const relevant = ranked.filter(
      (chunk) => (chunk.score ?? 0) >= MIN_CONTEXT_SCORE || detectedTopics.includes(chunk.topic)
    );

    if (!relevant.length) {
      return emptyKnowledge();
    }

    const topScore = Math.max(...relevant.map((chunk) => chunk.score ?? 0));
    const sufficient = topScore >= MIN_VECTOR_SCORE || (detectedTopics.length > 0 && relevant.some((c) => detectedTopics.includes(c.topic)));

    return {
      context: formatContext(relevant.slice(0, limit)),
      chunkCount: relevant.length,
      topScore,
      sufficient
    } satisfies RetrievedKnowledge;
  } catch {
    return emptyKnowledge();
  }
}

function emptyKnowledge(): RetrievedKnowledge {
  return {
    context: "",
    chunkCount: 0,
    topScore: 0,
    sufficient: false
  };
}

export function getKnowledgeCatalogVersion() {
  return KNOWLEDGE_CATALOG_VERSION;
}
