import "server-only";
import { buildCoachSystemPrompt } from "./coach-contract";
import { getAiRuntime } from "./ai-runtime";
import type { AnalysisResult } from "./skinova-data";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
};

export async function generateCoachAnswer(input: {
  message: string;
  knowledgeContext: string;
  analysis?: AnalysisResult | null;
  history?: Array<{ role: "user" | "coach"; content: string }>;
}) {
  const runtime = getAiRuntime();

  if (!runtime.llmApiKey) {
    throw new Error("Coach service is not configured.");
  }

  const systemPrompt = buildCoachSystemPrompt();

  const scanBlock = input.analysis
    ? [
        `Overall score: ${input.analysis.overallScore}%`,
        `Skin type: ${input.analysis.skinType}`,
        `Tone: ${input.analysis.tone}`,
        `Summary: ${input.analysis.summary}`,
        "Concern scores (higher is generally better in Skinova):",
        ...input.analysis.concerns.map(
          (concern) => `- ${concern.type}: ${concern.score}% (${concern.direction}) — ${concern.explanation}`
        )
      ].join("\n")
    : "No scan context — answer from Skinova Knowledge only and suggest running a scan for personalization.";

  const userPrompt = [
    "=== Skinova Knowledge (authoritative — do not contradict) ===",
    input.knowledgeContext || "No matching knowledge passages. Decline to guess and redirect to supported topics.",
    "",
    "=== Latest scan context ===",
    scanBlock,
    "",
    "=== User question ===",
    input.message,
    "",
    "Respond as Skinova Skin Coach. Ground every claim in the knowledge or scan context above. Max 3 plain sentences."
  ].join("\n");

  const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }];

  for (const turn of input.history || []) {
    messages.push({
      role: turn.role === "coach" ? "assistant" : "user",
      content: turn.content
    });
  }

  messages.push({ role: "user", content: userPrompt });

  const response = await fetch(`${runtime.llmBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtime.llmApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: runtime.llmModel,
      temperature: 0.2,
      max_tokens: 180,
      messages
    })
  });

  const payload = (await response.json().catch(() => ({}))) as ChatCompletionResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message || "Coach generation failed.");
  }

  const answer = payload.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    throw new Error("Coach generation returned an empty response.");
  }

  return answer;
}
