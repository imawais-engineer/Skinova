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

export function getAiRuntime(): AiRuntime {
  const llmApiKey = trim(process.env.COACH_LLM_API_KEY) || trim(process.env.OPENAI_API_KEY);
  const embeddingApiKey =
    trim(process.env.EMBEDDING_API_KEY) || trim(process.env.COACH_LLM_API_KEY) || trim(process.env.OPENAI_API_KEY);

  const llmBaseUrl = trim(process.env.COACH_LLM_BASE_URL) || trim(process.env.OPENAI_BASE_URL) || "https://api.openai.com/v1";
  const embeddingBaseUrl =
    trim(process.env.EMBEDDING_API_BASE_URL) || trim(process.env.COACH_LLM_BASE_URL) || llmBaseUrl;

  const llmModel = trim(process.env.COACH_LLM_MODEL) || "gpt-4o-mini";
  const embeddingModel = trim(process.env.EMBEDDING_MODEL) || "text-embedding-3-small";
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
