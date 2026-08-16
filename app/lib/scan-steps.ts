export type ScanFlowStep = {
  id: string;
  label: string;
  detail: string;
};

/** Ordered steps shown during a live scan — maps to upload → poll progress. */
export const liveScanSteps: ScanFlowStep[] = [
  {
    id: "select",
    label: "Select photo",
    detail: "Choose your selfie or a verified YouCam sample."
  },
  {
    id: "upload",
    label: "Secure upload",
    detail: "Sending your photo to YouCam Skin Analysis."
  },
  {
    id: "quality",
    label: "Face quality check",
    detail: "Checking framing, lighting, and face size."
  },
  {
    id: "analyze",
    label: "Skin signal analysis",
    detail: "Detecting acne, pores, texture, redness, and more."
  },
  {
    id: "insights",
    label: "Build insights",
    detail: "Turning scores into plain-language guidance."
  },
  {
    id: "complete",
    label: "Results ready",
    detail: "Your scan is saved to Results, Routine, and Progress."
  }
];

export function scanStepIndexForProgress({
  phase,
  pollStep,
  maxPollAttempts = 20
}: {
  phase: "pick" | "scanning" | "result" | "error";
  pollStep: number;
  maxPollAttempts?: number;
}): number {
  if (phase === "pick") return 0;
  if (phase === "result") return liveScanSteps.length - 1;
  if (phase === "error") return Math.max(1, Math.min(liveScanSteps.length - 2, 2 + pollStep));

  // scanning
  if (pollStep <= 0) return 1;
  if (pollStep === 1) return 2;
  if (pollStep <= 3) return 3;

  const analyzeSpan = maxPollAttempts - 3;
  const analyzeProgress = Math.min(1, (pollStep - 3) / Math.max(1, analyzeSpan));
  if (analyzeProgress < 0.85) return 3;

  return 4;
}
