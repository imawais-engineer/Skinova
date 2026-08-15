import "server-only";
import { getAiRuntime } from "./ai-runtime";

type EmbeddingResponse = {
  data?: Array<{ embedding?: number[] }>;
  error?: { message?: string };
};

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const runtime = getAiRuntime();

  if (!runtime.embeddingApiKey) {
    throw new Error("Embedding service is not configured.");
  }

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

  const embeddings = payload.data?.map((item) => item.embedding).filter((value): value is number[] => Boolean(value));

  if (!embeddings || embeddings.length !== texts.length) {
    throw new Error("Embedding response was incomplete.");
  }

  return embeddings;
}

export async function embedText(text: string) {
  const [embedding] = await embedTexts([text]);
  return embedding;
}
