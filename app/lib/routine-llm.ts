import "server-only";
import { getAiRuntime } from "./ai-runtime";
import { limitSentences, stripMarkdown } from "./text-format";
import type { AnalysisResult } from "./skinova-data";
import type { StructuredRoutinePlan } from "./routine-types";
import { generateRoutineFromAnalysis } from "./scan-session";

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
};

function templatePlan(analysis: AnalysisResult): StructuredRoutinePlan {
  const legacy = generateRoutineFromAnalysis(analysis);
  return {
    focus: limitSentences(analysis.summary, 2),
    morning: legacy.morning.map((detail) => ({ title: "Step", detail })),
    night: legacy.night.map((detail) => ({ title: "Step", detail })),
    cautions: legacy.avoid.map((detail) => ({ title: "Caution", detail })),
    source: "template"
  };
}

function parseRoutineJson(raw: string, analysis: AnalysisResult): StructuredRoutinePlan | null {
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) {
      return null;
    }

    const parsed = JSON.parse(raw.slice(start, end + 1)) as StructuredRoutinePlan;

    if (!parsed.morning?.length || !parsed.night?.length) {
      return null;
    }

    return {
      focus: stripMarkdown(parsed.focus || analysis.summary).slice(0, 220),
      morning: parsed.morning.map((step) => ({
        title: stripMarkdown(step.title || "Morning step"),
        detail: stripMarkdown(step.detail)
      })),
      night: parsed.night.map((step) => ({
        title: stripMarkdown(step.title || "Night step"),
        detail: stripMarkdown(step.detail)
      })),
      cautions: (parsed.cautions || []).map((item) => ({
        title: stripMarkdown(item.title || "Caution"),
        detail: stripMarkdown(item.detail)
      })),
      source: "ai"
    };
  } catch {
    return null;
  }
}

export async function generateStructuredRoutine(analysis: AnalysisResult): Promise<StructuredRoutinePlan> {
  const runtime = getAiRuntime();

  if (!runtime.llmApiKey) {
    return templatePlan(analysis);
  }

  const concernLines = analysis.concerns
    .map((c) => `${c.type}: ${c.score}% (${c.direction}) — ${c.explanation}`)
    .join("\n");

  const system = [
    "You build Skinova face-care routines from YouCam scan results.",
    "Return ONLY valid JSON. No markdown. Plain text inside string values.",
    "Schema:",
    '{"focus":"one sentence","morning":[{"title":"short label","detail":"plain instruction"}],"night":[{"title":"short label","detail":"plain instruction"}],"cautions":[{"title":"short label","detail":"plain warning"}]}',
    "3-4 morning steps, 3-4 night steps, 2-3 cautions. Educational only, not medical diagnosis."
  ].join(" ");

  const user = [
    `Overall: ${analysis.overallScore}%`,
    `Skin type: ${analysis.skinType}`,
    `Summary: ${analysis.summary}`,
    "Concerns:",
    concernLines
  ].join("\n");

  const response = await fetch(`${runtime.llmBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtime.llmApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: runtime.llmModel,
      temperature: 0.2,
      max_tokens: 700,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });

  const payload = (await response.json().catch(() => ({}))) as ChatCompletionResponse;

  if (!response.ok) {
    return templatePlan(analysis);
  }

  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return templatePlan(analysis);
  }

  return parseRoutineJson(content, analysis) ?? templatePlan(analysis);
}
