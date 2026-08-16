import "server-only";
import { allowedCoachTopics, buildScopeRedirect } from "./coach-contract";

const diagnosisKeywords = [
  "diagnose",
  "diagnosis",
  "disease",
  "infection",
  "prescription",
  "prescribe",
  "antibiotic",
  "cancer",
  "melanoma",
  "eczema diagnosis",
  "psoriasis cure",
  "cure my",
  "guarantee",
  "guaranteed"
];

const offTopicKeywords = [
  "write code",
  "javascript",
  "python",
  "stock",
  "crypto",
  "politics",
  "election",
  "recipe for food",
  "homework",
  "essay",
  "legal advice",
  "lawsuit",
  "pregnancy test",
  "birth control pill"
];

const topicKeywordMap: Record<string, string[]> = {
  acne: ["acne", "breakout", "pimple", "blemish", "congestion", "blackhead", "whitehead"],
  redness: ["red", "redness", "irritat", "inflam", "rosacea", "sensitive", "sting", "burning"],
  routine: ["routine", "morning", "night", "evening", "regimen", "steps", "order"],
  ingredients: [
    "ingredient",
    "niacinamide",
    "retinol",
    "vitamin c",
    "salicylic",
    "aha",
    "bha",
    "glycolic",
    "ceramide",
    "hyaluronic",
    "benzoyl",
    "azelaic"
  ],
  pores: ["pore", "blackhead", "sebum", "t-zone", "t zone"],
  texture: ["texture", "rough", "bumpy", "smooth"],
  hydration: ["hydrat", "dry", "moisture", "dehydrat", "flaky", "tight skin"],
  oiliness: ["oily", "oiliness", "shine", "sebum"],
  sunscreen: ["spf", "sunscreen", "sun protection", "uv"],
  analysis: ["score", "scan", "analysis", "result", "youcam", "reading"],
  progress: ["progress", "improv", "trend", "weeks", "before and after"],
  safety: ["safe", "medical", "doctor", "dermatolog", "professional"]
};

export type ScopeResult =
  | { allowed: true; topics: string[] }
  | { allowed: false; reason: "medical" | "off-topic" | "empty"; redirect: string };

export function detectCoachTopics(message: string): string[] {
  const normalized = message.toLowerCase();
  const topics = new Set<string>();

  for (const [topic, keywords] of Object.entries(topicKeywordMap)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      topics.add(topic);
    }
  }

  return [...topics];
}

export function isSkincareQuestionInScope(message: string): ScopeResult {
  const normalized = message.trim().toLowerCase();

  if (!normalized) {
    return { allowed: false, reason: "empty", redirect: buildScopeRedirect() };
  }

  if (diagnosisKeywords.some((keyword) => normalized.includes(keyword))) {
    return {
      allowed: false,
      reason: "medical",
      redirect:
        "Skinova cannot diagnose medical conditions, prescribe treatments, or guarantee cures. I can help with educational skincare routines and interpreting your scan trends. For medical concerns, please consult a qualified professional."
    };
  }

  if (offTopicKeywords.some((keyword) => normalized.includes(keyword))) {
    return { allowed: false, reason: "off-topic", redirect: buildScopeRedirect() };
  }

  const topics = detectCoachTopics(normalized);

  if (topics.length === 0 && normalized.length < 12) {
    return { allowed: false, reason: "off-topic", redirect: buildScopeRedirect([...allowedCoachTopics]) };
  }

  return { allowed: true, topics };
}
