import "server-only";
import { getAiRuntime } from "./ai-runtime";

type EmbeddingResponse = {
  data?: Array<{ embedding?: number[]; index?: number }>;
  error?: { message?: string };
};

const EMBEDDING_BATCH_SIZE = 10;

async function embedBatch(texts: string[], runtime: ReturnType<typeof getAiRuntime>) {
  const response = await fetch(`${runtime.embeddingBaseUrl}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtime.embeddingApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: runtime.embeddingModel,
      input: texts,
      dimensions: runtime.embeddingDimensions
    })
  });

  const payload = (await response.json().catch(() => ({}))) as EmbeddingResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message || "Embedding request failed.");
  }

  const embeddings = payload.data
    ?.slice()
    .sort((left, right) => (left.index ?? 0) - (right.index ?? 0))
    .map((item) => item.embedding)
    .filter((value): value is number[] => Boolean(value));

  if (!embeddings || embeddings.length !== texts.length) {
    throw new Error("Embedding response was incomplete.");
  }

  return embeddings;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const runtime = getAiRuntime();

  if (!runtime.embeddingApiKey) {
    throw new Error("Embedding service is not configured.");
  }

  const results: number[][] = [];

  for (let index = 0; index < texts.length; index += EMBEDDING_BATCH_SIZE) {
    const batch = texts.slice(index, index + EMBEDDING_BATCH_SIZE);
    const embeddings = await embedBatch(batch, runtime);
    results.push(...embeddings);
  }

  return results;
}

export async function embedText(text: string) {
  const [embedding] = await embedTexts([text]);
  return embedding;
}
