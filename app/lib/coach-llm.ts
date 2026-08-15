import "server-only";
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
}) {
  const runtime = getAiRuntime();

  if (!runtime.llmApiKey) {
    throw new Error("Coach service is not configured.");
  }

  const systemPrompt = [
    "You are Skinova Skin Coach.",
    "Provide skincare education, routine guidance, and ingredient cautions only.",
    "Never diagnose medical conditions, prescribe medication, or claim guaranteed results.",
    "Use the user's latest scan context when available.",
    "Use retrieved knowledge when relevant.",
    "Keep answers concise (3-6 sentences), practical, and consumer-friendly.",
    "Do not mention models, providers, APIs, embeddings, databases, or internal systems.",
    "End with a brief educational tone; do not repeat a long disclaimer."
  ].join(" ");

  const userPrompt = [
    "User question:",
    input.message,
    "",
    "Latest scan context:",
    input.analysis
      ? [
          `Overall score: ${input.analysis.overallScore}%`,
          `Skin type: ${input.analysis.skinType}`,
          `Summary: ${input.analysis.summary}`,
          "Concerns:",
          ...input.analysis.concerns.map((concern) => `- ${concern.type}: ${concern.score}% — ${concern.explanation}`)
        ].join("\n")
      : "No scan context provided.",
    "",
    "Retrieved knowledge:",
    input.knowledgeContext || "No additional knowledge retrieved.",
    "",
    "Respond as Skinova Skin Coach."
  ].join("\n");

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  const response = await fetch(`${runtime.llmBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtime.llmApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: runtime.llmModel,
      temperature: 0.4,
      max_tokens: 500,
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
