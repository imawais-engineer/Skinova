import "server-only";

export type AiRuntime = {
  configured: boolean;
  llmApiKey?: string;
  llmBaseUrl: string;
  llmModel: string;
  embeddingApiKey?: string;
  embeddingBaseUrl: string;
  embeddingModel: string;
  embeddingDimensions: number;
};

function trim(value: string | undefined) {
  return value?.trim() || "";
}

function firstDefined(...values: Array<string | undefined>) {
  for (const value of values) {
    const trimmed = trim(value);
    if (trimmed) {
      return trimmed;
    }
  }

  return "";
}

export function getAiRuntime(): AiRuntime {
  const llmApiKey = firstDefined(
    process.env.COACH_LLM_API_KEY,
    process.env.QWEN_API_KEY,
    process.env.OPENAI_API_KEY
  );
  const embeddingApiKey = firstDefined(
    process.env.EMBEDDING_API_KEY,
    process.env.COACH_LLM_API_KEY,
    process.env.QWEN_API_KEY,
    process.env.OPENAI_API_KEY
  );

  const llmBaseUrl = firstDefined(
    process.env.COACH_LLM_BASE_URL,
    process.env.QWEN_BASE_URL,
    process.env.OPENAI_BASE_URL,
    "https://api.openai.com/v1"
  );
  const embeddingBaseUrl = firstDefined(
    process.env.EMBEDDING_API_BASE_URL,
    process.env.COACH_LLM_BASE_URL,
    process.env.QWEN_BASE_URL,
    llmBaseUrl
  );

  const llmModel = firstDefined(process.env.COACH_LLM_MODEL, "qwen3-max");
  const embeddingModel = firstDefined(process.env.EMBEDDING_MODEL, "text-embedding-v4");
  const embeddingDimensions = Number(process.env.EMBEDDING_DIMENSIONS || 1536);

  return {
    configured: Boolean(llmApiKey && embeddingApiKey),
    llmApiKey: llmApiKey || undefined,
    llmBaseUrl: llmBaseUrl.replace(/\/$/, ""),
    llmModel,
    embeddingApiKey: embeddingApiKey || undefined,
    embeddingBaseUrl: embeddingBaseUrl.replace(/\/$/, ""),
    embeddingModel,
    embeddingDimensions
  };
}

export function isCoachLive() {
  return getAiRuntime().configured;
}
