import "server-only";
import { randomUUID } from "node:crypto";
import type { AnalysisResult } from "./skinova-data";
import {
  deleteCoachMessagesForUser,
  getCoachThreadRows,
  saveCoachMessage
} from "./knowledge-db";

export type CoachMemoryRole = "user" | "coach" | "scan";

export type CoachMemoryMessage = {
  id: string;
  role: CoachMemoryRole;
  content: string;
  createdAt: string;
  scanSnapshot?: AnalysisResult | null;
};

export type CoachMemoryContext = {
  messages: CoachMemoryMessage[];
  latestScan: AnalysisResult | null;
  scanAnchors: CoachMemoryMessage[];
};

function scanFingerprint(analysis: AnalysisResult, scannedAt?: string) {
  const concernKey = analysis.concerns.map((c) => `${c.type}:${c.score}`).join("|");
  return `${analysis.overallScore}:${scannedAt || analysis.summary.slice(0, 32)}:${concernKey}`;
}

export async function getCoachMemory(userId: string): Promise<CoachMemoryContext> {
  const rows = await getCoachThreadRows(userId, 40);
  const messages: CoachMemoryMessage[] = rows.map((row) => ({
    id: row.id,
    role: row.role as CoachMemoryRole,
    content: row.content,
    createdAt: row.created_at,
    scanSnapshot: row.metadata?.analysis ?? null
  }));

  const scanAnchors = messages.filter((message) => message.role === "scan");
  const latestScan = scanAnchors.at(-1)?.scanSnapshot ?? null;

  return { messages, latestScan, scanAnchors };
}

export async function alignScanAnchor(input: {
  userId: string;
  analysis: AnalysisResult;
  mode: "demo" | "live";
  scannedAt: string;
}) {
  const memory = await getCoachMemory(input.userId);
  const fingerprint = scanFingerprint(input.analysis, input.scannedAt);
  const lastAnchor = memory.scanAnchors.at(-1);

  if (lastAnchor?.scanSnapshot) {
    const lastFingerprint = scanFingerprint(lastAnchor.scanSnapshot, lastAnchor.createdAt);
    if (lastFingerprint === fingerprint) {
      return null;
    }
  }

  const topConcerns = input.analysis.concerns
    .slice(0, 3)
    .map((c) => `${c.type} ${c.score}%`)
    .join(" · ");

  const content = `YouCam scan · ${input.analysis.overallScore}% overall · ${topConcerns}`;

  const id = randomUUID();
  await saveCoachMessage({
    id,
    userId: input.userId,
    role: "scan",
    content,
    metadata: {
      type: "scan_anchor",
      analysis: input.analysis,
      mode: input.mode,
      scannedAt: input.scannedAt,
      fingerprint
    }
  });

  return id;
}

export async function writeCoachTurn(input: {
  userId: string;
  userMessage: string;
  coachMessage: string;
  analysis?: AnalysisResult | null;
}) {
  const userMessageId = randomUUID();
  await saveCoachMessage({
    id: userMessageId,
    userId: input.userId,
    role: "user",
    content: input.userMessage,
    metadata: input.analysis ? { analysis: input.analysis } : null
  });

  const coachMessageId = randomUUID();
  await saveCoachMessage({
    id: coachMessageId,
    userId: input.userId,
    role: "coach",
    content: input.coachMessage,
    metadata: input.analysis ? { analysis: input.analysis } : null
  });
}

export async function clearCoachMemory(userId: string) {
  await deleteCoachMessagesForUser(userId);
}

export function chatTurnsForModel(messages: CoachMemoryMessage[]) {
  return messages
    .filter((message) => message.role === "user" || message.role === "coach")
    .map((message) => ({
      role: message.role as "user" | "coach",
      content: message.content
    }));
}
