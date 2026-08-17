import type { AnalysisResult } from "./skinova-data";
import { getScanSample } from "./demo-samples";
import type { StructuredRoutinePlan } from "./routine-types";

export type ScanSession = {
  analysis: AnalysisResult;
  mode: "demo" | "live";
  scannedAt: string;
  scanId?: string | null;
  fileId?: string | null;
  previewImageUrl?: string | null;
  sampleId?: string | null;
};

const STORAGE_KEY = "skinova:last-scan";
const ROUTINE_KEY = "skinova:routine-plan";
const SIMULATION_KEY = "skinova:simulation-result";

function routineCacheKey(session: ScanSession) {
  return `${session.scannedAt}:${session.analysis.overallScore}`;
}

export function saveScanSession(session: ScanSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("skinova:session-updated"));
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
  window.sessionStorage.removeItem(ROUTINE_KEY);
  window.sessionStorage.removeItem(SIMULATION_KEY);
}

export function saveRoutinePlan(session: ScanSession, plan: StructuredRoutinePlan) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    ROUTINE_KEY,
    JSON.stringify({ key: routineCacheKey(session), plan })
  );
}

export function getRoutinePlan(session: ScanSession): StructuredRoutinePlan | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(ROUTINE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as { key: string; plan: StructuredRoutinePlan };
    return parsed.key === routineCacheKey(session) ? parsed.plan : null;
  } catch {
    return null;
  }
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

export type ScanHistoryEntry = {
  id: string;
  scannedAt: string;
  mode: "demo" | "live";
  overall: number;
  acne: number;
  redness: number;
  texture: number;
  hydration: number;
};

function concernScore(analysis: AnalysisResult, keyword: string, fallback: number) {
  const match = analysis.concerns.find((concern) => concern.type.toLowerCase().includes(keyword));
  return match?.score ?? fallback;
}

export function buildScanHistoryEntries(
  scans: Array<{ id: string; scannedAt: string; mode: "demo" | "live"; analysis: AnalysisResult }>
): ScanHistoryEntry[] {
  return scans.map((scan) => ({
    id: scan.id,
    scannedAt: scan.scannedAt,
    mode: scan.mode,
    overall: scan.analysis.overallScore,
    acne: concernScore(scan.analysis, "acne", 64),
    redness: concernScore(scan.analysis, "redness", 58),
    texture: concernScore(scan.analysis, "texture", 76),
    hydration: concernScore(scan.analysis, "hydration", 84)
  }));
}

export function formatScanDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export function formatScanDateShort(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}

export type ScanHistoryTrend = {
  scanCount: number;
  latest: ScanHistoryEntry;
  previous: ScanHistoryEntry | null;
  delta: number;
  direction: "up" | "down" | "flat";
};

export function buildHistoryTrend(history: ScanHistoryEntry[]): ScanHistoryTrend | null {
  if (!history.length) {
    return null;
  }

  const latest = history[0];
  const previous = history[1] || null;
  const delta = previous ? latest.overall - previous.overall : 0;

  return {
    scanCount: history.length,
    latest,
    previous,
    delta,
    direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat"
  };
}

export function describeHistoryDelta(trend: ScanHistoryTrend) {
  if (!trend.previous) {
    return `${trend.scanCount} scan${trend.scanCount === 1 ? "" : "s"} saved to your account.`;
  }

  const verb = trend.direction === "up" ? "up" : trend.direction === "down" ? "down" : "flat";
  const points = Math.abs(trend.delta);

  if (trend.direction === "flat") {
    return `${trend.scanCount} scans · overall score steady since your last scan.`;
  }

  return `${trend.scanCount} scans · overall ${verb} ${points} point${points === 1 ? "" : "s"} since your last scan.`;
}

export function getOriginalScanImageUrl(session: ScanSession) {
  if (session.previewImageUrl) {
    return session.previewImageUrl;
  }

  if (session.sampleId) {
    return getScanSample(session.sampleId)?.previewPath ?? null;
  }

  return null;
}

export function toScanSessionFromApi(scan: {
  id: string;
  analysis: AnalysisResult;
  mode: "demo" | "live";
  scannedAt: string;
  fileId?: string | null;
  previewImageUrl?: string | null;
  sampleId?: string | null;
}): ScanSession {
  return {
    analysis: scan.analysis,
    mode: scan.mode,
    scannedAt: scan.scannedAt,
    scanId: scan.id,
    fileId: scan.fileId ?? null,
    previewImageUrl: scan.previewImageUrl ?? null,
    sampleId: scan.sampleId ?? null
  };
}

export function routineScanKeyFromSession(session: ScanSession) {
  if (session.scanId) {
    return session.scanId;
  }

  const concernKey = session.analysis.concerns.map((concern) => `${concern.type}:${concern.score}`).join("|");
  return `${session.analysis.overallScore}:${session.scannedAt}:${concernKey}`;
}

export function saveSimulationResult(
  session: ScanSession,
  result: { resultUrl: string; mode: "demo" | "live" }
) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    SIMULATION_KEY,
    JSON.stringify({ key: routineScanKeyFromSession(session), ...result })
  );
}

export function getSimulationResult(session: ScanSession) {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SIMULATION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as { key: string; resultUrl: string; mode: "demo" | "live" };
    return parsed.key === routineScanKeyFromSession(session) ? parsed : null;
  } catch {
    return null;
  }
}
