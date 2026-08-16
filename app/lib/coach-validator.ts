import "server-only";
import { limitSentences, stripMarkdown } from "./text-format";
import { buildScopeRedirect } from "./coach-contract";

const forbiddenPhrases = [
  "i diagnose",
  "definitely have",
  "prescribe",
  "guaranteed cure",
  "100% effective",
  "medical condition confirmed",
  "as a doctor",
  "as a dermatologist"
];

const genericPhrases = [
  "maintain a healthy lifestyle",
  "drink plenty of water",
  "everyone's skin is different",
  "it depends on your individual needs"
];

export function validateCoachAnswer(answer: string, hasKnowledgeContext: boolean) {
  const normalized = stripMarkdown(answer).toLowerCase();

  if (forbiddenPhrases.some((phrase) => normalized.includes(phrase))) {
    return { valid: false, reason: "forbidden-claim" as const };
  }

  if (!hasKnowledgeContext && genericPhrases.filter((phrase) => normalized.includes(phrase)).length >= 2) {
    return { valid: false, reason: "too-generic" as const };
  }

  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length > 3) {
    return { valid: false, reason: "too-long" as const };
  }

  if (answer.trim().length < 24) {
    return { valid: false, reason: "too-short" as const };
  }

  return { valid: true as const };
}

export function buildValidatedFallback(hasKnowledgeContext: boolean) {
  if (!hasKnowledgeContext) {
    return limitSentences(buildScopeRedirect(["acne", "redness", "routines", "ingredients"]), 3);
  }

  return "Please ask about your scan scores, acne, redness, pores, texture, hydration, routines, or ingredients.";
}
