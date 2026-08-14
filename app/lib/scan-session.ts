import type { AnalysisResult } from "./skinova-data";

export type ScanSession = {
  analysis: AnalysisResult;
  mode: "demo" | "live";
  scannedAt: string;
};

const STORAGE_KEY = "skinova:last-scan";

export function saveScanSession(session: ScanSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getScanSession(): ScanSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ScanSession;
  } catch {
    return null;
  }
}

export function clearScanSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function generateRoutineFromAnalysis(analysis: AnalysisResult) {
  const lowHydration = analysis.concerns.some((concern) => concern.type.toLowerCase().includes("hydration") && concern.score < 70);
  const rednessWatch = analysis.concerns.some((concern) => concern.type.toLowerCase().includes("redness") && concern.score < 65);
  const acneWatch = analysis.concerns.some((concern) => concern.type.toLowerCase().includes("acne") && concern.score < 70);

  const morning = [
    "Low-foam gentle cleanser",
    rednessWatch ? "Niacinamide serum for redness and barrier support" : "Lightweight hydrating serum",
    lowHydration ? "Barrier-focused moisturizer with ceramides" : "Lightweight moisturizer",
    "Broad-spectrum SPF 30+ sunscreen"
  ];

  const night = [
    "Gentle cleanser",
    "Hydrating toner or essence",
    acneWatch ? "Salicylic acid treatment two nights per week" : "Gentle exfoliating treatment one night per week",
    "Ceramide moisturizer"
  ];

  const avoid = [
    "Do not stack retinol and exfoliating acids on the same night.",
    rednessWatch ? "Avoid harsh scrubs while redness signals are active." : "Avoid over-exfoliating when texture is improving.",
    "Patch test new actives before applying across the face."
  ];

  return { morning, night, avoid };
}

export function buildProgressFromAnalysis(analysis: AnalysisResult) {
  const byType = (keyword: string, fallback: number) => {
    const match = analysis.concerns.find((concern) => concern.type.toLowerCase().includes(keyword));
    return match?.score ?? fallback;
  };

  const current = {
    date: "Current scan",
    acne: byType("acne", 64),
    redness: byType("redness", 58),
    texture: byType("texture", 76),
    hydration: byType("hydration", 84),
    overall: analysis.overallScore
  };

  const projected = {
    date: "Projected (4 weeks)",
    acne: Math.min(100, current.acne + 6),
    redness: Math.min(100, current.redness + 8),
    texture: Math.min(100, current.texture + 4),
    hydration: Math.min(100, current.hydration + 3),
    overall: Math.min(100, analysis.overallScore + 6)
  };

  return [current, projected];
}
