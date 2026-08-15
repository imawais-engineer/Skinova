import type { AnalysisResult } from "./skinova-data";

const coachContract = {
  safety: "Educational guidance only. Consult a qualified professional for medical concerns."
};

const responses = [
  {
    match: ["acne", "breakout", "pimple"],
    answer:
      "For breakout-prone areas, keep the routine steady: gentle cleanser, light moisturizer, sunscreen, and salicylic acid only a few nights per week. Avoid adding several new actives at once."
  },
  {
    match: ["red", "redness", "irritation"],
    answer:
      "For redness, prioritize barrier support: niacinamide, ceramides, fragrance-free moisturizer, and daily SPF. Pause strong exfoliants if the skin feels hot or stinging."
  },
  {
    match: ["routine", "morning", "night"],
    answer:
      "A stable routine is best: morning cleanser, niacinamide, moisturizer, SPF; night cleanser, hydration, targeted treatment two nights weekly, then moisturizer."
  },
  {
    match: ["ingredient", "retinol", "vitamin c", "niacinamide", "salicylic"],
    answer:
      "Introduce ingredients one at a time. Niacinamide is usually a good first support ingredient. Retinol and exfoliating acids should not be stacked in the same night routine."
  }
];

const diagnosisKeywords = ["diagnose", "disease", "infection", "prescription", "cancer", "melanoma"];

export function asksForDiagnosis(message: string) {
  const normalized = message.toLowerCase();
  return diagnosisKeywords.some((keyword) => normalized.includes(keyword));
}

export function buildFallbackCoachAnswer(message: string) {
  if (asksForDiagnosis(message)) {
    return {
      answer:
        "Skinova cannot diagnose medical conditions or replace professional care. It can help with routine education and general skincare questions.",
      safety: coachContract.safety
    };
  }

  const normalized = message.toLowerCase();
  const matched = responses.find((item) => item.match.some((keyword) => normalized.includes(keyword)));

  return {
    answer:
      matched?.answer ||
      "Skinova can help interpret analysis trends and routine choices. Ask about acne, redness, routines, or ingredients. This is skincare education, not medical diagnosis.",
    safety: coachContract.safety
  };
}

export function formatAnalysisContext(analysis?: AnalysisResult | null) {
  if (!analysis) {
    return "No recent scan context is available.";
  }

  const concerns = analysis.concerns
    .slice(0, 5)
    .map((concern) => `- ${concern.type}: ${concern.score}% (${concern.direction}) — ${concern.explanation}`)
    .join("\n");

  return [
    `Overall score: ${analysis.overallScore}%`,
    `Skin type: ${analysis.skinType}`,
    `Tone: ${analysis.tone}`,
    `Summary: ${analysis.summary}`,
    "Top concerns:",
    concerns
  ].join("\n");
}
