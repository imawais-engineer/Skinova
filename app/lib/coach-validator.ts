import "server-only";
import { buildScopeRedirect } from "./coach-contract";

const forbiddenPhrases = [
  "i diagnose",
  "you have",
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
  "consult a professional for personalized advice",
  "it depends on your individual needs"
];

export function validateCoachAnswer(answer: string, hasKnowledgeContext: boolean) {
  const normalized = answer.toLowerCase();

  if (forbiddenPhrases.some((phrase) => normalized.includes(phrase))) {
    return {
      valid: false,
      reason: "forbidden-claim" as const
    };
  }

  if (!hasKnowledgeContext && genericPhrases.filter((phrase) => normalized.includes(phrase)).length >= 2) {
    return {
      valid: false,
      reason: "too-generic" as const
    };
  }

  if (answer.trim().length < 40) {
    return {
      valid: false,
      reason: "too-short" as const
    };
  }

  return { valid: true as const };
}

export function buildValidatedFallback(hasKnowledgeContext: boolean) {
  if (!hasKnowledgeContext) {
    return buildScopeRedirect(["acne", "redness", "routines", "ingredients"]);
  }

  return "I want to stay accurate to Skinova's guidance. Could you rephrase your question about acne, redness, pores, texture, hydration, routines, or ingredients?";
}
