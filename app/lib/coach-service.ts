import "server-only";
import { randomUUID } from "node:crypto";
import { coachSafetyNotice } from "./coach-contract";
import { generateCoachAnswer } from "./coach-llm";
import { buildFallbackCoachAnswer } from "./coach-fallback";
import { isSkincareQuestionInScope } from "./coach-scope";
import { buildValidatedFallback, validateCoachAnswer } from "./coach-validator";
import { isCoachLive } from "./ai-runtime";
import { getRecentCoachMessages, saveCoachMessage } from "./knowledge-db";
import { retrieveKnowledgeContext } from "./rag";
import type { AnalysisResult } from "./skinova-data";

export async function runCoachConversation(input: {
  userId: string;
  message: string;
  analysis?: AnalysisResult | null;
}) {
  const trimmed = input.message.trim();
  const scope = isSkincareQuestionInScope(trimmed);

  await saveCoachMessage({
    id: randomUUID(),
    userId: input.userId,
    role: "user",
    content: trimmed
  });

  let answer: string;

  if (!scope.allowed) {
    answer = scope.redirect;
  } else if (!isCoachLive()) {
    answer = buildFallbackCoachAnswer(trimmed, input.analysis).answer;
  } else {
    const knowledge = await retrieveKnowledgeContext(trimmed, { topics: scope.topics });
    const history = await getRecentCoachMessages(input.userId, 6);

    if (!knowledge.sufficient && !input.analysis) {
      answer = buildValidatedFallback(false);
    } else {
      try {
        answer = await generateCoachAnswer({
          message: trimmed,
          knowledgeContext: knowledge.context,
          analysis: input.analysis,
          history: history.slice(0, -1)
        });

        const validation = validateCoachAnswer(answer, knowledge.chunkCount > 0);

        if (!validation.valid) {
          if (knowledge.context) {
            answer = await generateCoachAnswer({
              message: `${trimmed}\n\nReminder: use only the Skinova Knowledge passages. Do not add general advice.`,
              knowledgeContext: knowledge.context,
              analysis: input.analysis,
              history: history.slice(0, -1)
            });
          } else {
            answer = buildValidatedFallback(knowledge.chunkCount > 0);
          }
        }
      } catch {
        answer = buildFallbackCoachAnswer(trimmed, input.analysis).answer;
      }
    }
  }

  await saveCoachMessage({
    id: randomUUID(),
    userId: input.userId,
    role: "coach",
    content: answer
  });

  return {
    answer,
    safety: coachSafetyNotice,
    mode: isCoachLive() ? ("live" as const) : ("guided" as const)
  };
}
