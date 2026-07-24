import { NextRequest, NextResponse } from "next/server";

const coachContract = {
  version: "skinova-coach-local-v1",
  scope: "skincare education, routine guidance, and ingredient caution",
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
    match: ["ingredient", "retinol", "vitamin c", "niacinamide"],
    answer:
      "Introduce ingredients one at a time. Niacinamide is usually a good first support ingredient. Retinol and exfoliating acids should not be stacked in the same night routine."
  }
];

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { message?: string };
  const message = (body.message || "").toLowerCase();

  if (!message.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  if (message.length > 500) {
    return NextResponse.json({ error: "message must be 500 characters or fewer" }, { status: 400 });
  }

  const matched = responses.find((item) => item.match.some((keyword) => message.includes(keyword)));
  const asksForDiagnosis = ["diagnose", "disease", "infection", "prescription", "cancer", "melanoma"].some((keyword) =>
    message.includes(keyword)
  );
  const answer = asksForDiagnosis
    ? "Skinova cannot diagnose medical conditions or replace professional care. It can help with routine education and general skincare questions."
    : matched?.answer ||
      "Skinova can help interpret analysis trends and routine choices. For this demo, ask about acne, redness, routines, or ingredients. This is skincare education, not medical diagnosis.";

  return NextResponse.json({
    contract: coachContract.version,
    answer,
    safety: coachContract.safety,
    scope: coachContract.scope
  });
}
