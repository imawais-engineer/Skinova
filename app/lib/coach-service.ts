import "server-only";
import { coachSafetyNotice } from "./coach-contract";
import { generateCoachAnswer } from "./coach-llm";
import { buildFallbackCoachAnswer } from "./coach-fallback";
import {
  alignScanAnchor,
  chatTurnsForModel,
  getCoachMemory,
  writeCoachTurn
} from "./coach-memory";
import { isSkincareQuestionInScope } from "./coach-scope";
import { buildValidatedFallback, validateCoachAnswer } from "./coach-validator";
import { isCoachLive } from "./ai-runtime";
import { retrieveKnowledgeContext } from "./rag";
import { limitSentences, stripMarkdown } from "./text-format";
import type { AnalysisResult } from "./skinova-data";

function finalizeAnswer(text: string) {
  return limitSentences(stripMarkdown(text), 3);
}

export async function runCoachConversation(input: {
  userId: string;
  message: string;
  analysis?: AnalysisResult | null;
  scanMode?: "demo" | "live";
  scannedAt?: string;
}) {
  const trimmed = input.message.trim();
  const scope = isSkincareQuestionInScope(trimmed);

  if (input.analysis) {
    await alignScanAnchor({
      userId: input.userId,
      analysis: input.analysis,
      mode: input.scanMode || "live",
      scannedAt: input.scannedAt || new Date().toISOString()
    });
  }

  const memory = await getCoachMemory(input.userId);
  const analysisForContext = input.analysis ?? memory.latestScan;
  const history = chatTurnsForModel(memory.messages);

  let answer: string;

  if (!scope.allowed) {
    answer = finalizeAnswer(scope.redirect);
  } else if (!isCoachLive()) {
    answer = finalizeAnswer(buildFallbackCoachAnswer(trimmed, analysisForContext).answer);
  } else {
    const knowledge = await retrieveKnowledgeContext(trimmed, { topics: scope.topics });

    if (!knowledge.sufficient && !analysisForContext) {
      answer = finalizeAnswer(buildValidatedFallback(false));
    } else {
      try {
        answer = await generateCoachAnswer({
          message: trimmed,
          knowledgeContext: knowledge.context,
          analysis: analysisForContext,
          history
        });

        answer = finalizeAnswer(answer);

        const validation = validateCoachAnswer(answer, knowledge.chunkCount > 0);

        if (!validation.valid && knowledge.context) {
          const retry = await generateCoachAnswer({
            message: `${trimmed}\nUse only Skinova Knowledge and scan context. Max 3 plain sentences.`,
            knowledgeContext: knowledge.context,
            analysis: analysisForContext,
            history
          });
          answer = finalizeAnswer(retry);
        } else if (!validation.valid) {
          answer = finalizeAnswer(buildValidatedFallback(knowledge.chunkCount > 0));
        }
      } catch {
        answer = finalizeAnswer(buildFallbackCoachAnswer(trimmed, analysisForContext).answer);
      }
    }
  }

  await writeCoachTurn({
    userId: input.userId,
    userMessage: trimmed,
    coachMessage: answer,
    analysis: analysisForContext
  });

  return {
    answer,
    safety: coachSafetyNotice,
    mode: isCoachLive() ? ("live" as const) : ("guided" as const)
  };
}

export async function loadCoachThread(userId: string) {
  const memory = await getCoachMemory(userId);
  return {
    messages: memory.messages,
    latestScan: memory.latestScan,
    mode: isCoachLive() ? ("live" as const) : ("guided" as const)
  };
}
