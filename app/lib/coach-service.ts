import "server-only";
import { randomUUID } from "node:crypto";
import { isCoachLive } from "./ai-runtime";
import { buildFallbackCoachAnswer } from "./coach-fallback";
import { generateCoachAnswer } from "./coach-llm";
import { saveCoachMessage } from "./knowledge-db";
import { retrieveKnowledgeContext } from "./rag";
import type { AnalysisResult } from "./skinova-data";

const coachContract = {
  safety: "Educational guidance only. Consult a qualified professional for medical concerns."
};

export async function runCoachConversation(input: {
  userId: string;
  message: string;
  analysis?: AnalysisResult | null;
}) {
  const trimmed = input.message.trim();

  await saveCoachMessage({
    id: randomUUID(),
    userId: input.userId,
    role: "user",
    content: trimmed
  });

  let answer: string;

  if (isCoachLive()) {
    try {
      const knowledgeContext = await retrieveKnowledgeContext(trimmed);
      answer = await generateCoachAnswer({
        message: trimmed,
        knowledgeContext,
        analysis: input.analysis
      });
    } catch {
      answer = buildFallbackCoachAnswer(trimmed).answer;
    }
  } else {
    answer = buildFallbackCoachAnswer(trimmed).answer;
  }

  await saveCoachMessage({
    id: randomUUID(),
    userId: input.userId,
    role: "coach",
    content: answer
  });

  return {
    answer,
    safety: coachContract.safety
  };
}
