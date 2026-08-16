import type { AnalysisResult } from "./skinova-data";

export type ScanSample = {
  id: string;
  label: string;
  description: string;
  fileName: string;
  previewPath: string;
  trait: string;
};

export const skinScanRequirements = {
  title: "Photo requirements",
  summary: "YouCam Skin AI needs a clear front-facing selfie. Most failures are framing or lighting — not a broken app.",
  items: [
    "Front-facing selfie, face centered, eyes toward the camera",
    "Face fills most of the frame (about 60% or more of the width)",
    "Short side at least 480px; higher resolution is better",
    "Even lighting, minimal blur, no heavy filters",
    "JPG or PNG under 10MB"
  ]
};

/** YouCam-verified face selfies bundled in /public/samples */
export const scanSamples: ScanSample[] = [
  {
    id: "clear-baseline",
    label: "Clear skin",
    trait: "Even tone",
    description: "Healthy-looking complexion with balanced scores.",
    fileName: "live-selfie-clear.jpg",
    previewPath: "/samples/live-selfie-clear.jpg"
  },
  {
    id: "acne-case",
    label: "Active acne",
    trait: "Breakouts",
    description: "Visible acne and redness for concern detection.",
    fileName: "live-selfie-acne.jpg",
    previewPath: "/samples/live-selfie-acne.jpg"
  },
  {
    id: "close-face",
    label: "Close-up face",
    trait: "Tight framing",
    description: "Face fills the frame — ideal upload framing.",
    fileName: "live-selfie-tight.jpg",
    previewPath: "/samples/live-selfie-tight.jpg"
  },
  {
    id: "texture-case",
    label: "Texture & pores",
    trait: "Detail visible",
    description: "Shows pore and texture scoring on a live scan.",
    fileName: "live-selfie-2.jpg",
    previewPath: "/samples/live-selfie-2.jpg"
  }
];

export function getScanSample(sampleId: string) {
  return scanSamples.find((sample) => sample.id === sampleId);
}

export const coachSamplePrompts = [
  "Why is my skin red this week?",
  "What should my morning routine include?",
  "Can I use niacinamide with salicylic acid?",
  "How do I reduce breakout risk without harsh products?"
];

export const demoSessionAnalysis: AnalysisResult = {
  overallScore: 82,
  skinType: "Combination, Fitzpatrick Type III",
  tone: "Neutral warm undertone",
  summary:
    "Skinova found a generally balanced complexion with mild congestion around the T-zone, visible pore activity, and early redness patterns. The recommendation is a gentle barrier-friendly routine focused on calming, hydration, and controlled exfoliation.",
  concerns: [
    {
      type: "Acne risk",
      score: 64,
      direction: "watch",
      explanation: "Mild breakout risk appears around oil-prone areas. Keep cleansing gentle and avoid stacking harsh actives."
    },
    {
      type: "Pores",
      score: 71,
      direction: "stable",
      explanation: "Pore visibility is moderate and benefits from consistent hydration plus occasional salicylic acid."
    },
    {
      type: "Redness",
      score: 58,
      direction: "watch",
      explanation: "Redness signals suggest the skin barrier needs calming ingredients and sunscreen consistency."
    },
    {
      type: "Texture",
      score: 76,
      direction: "improving",
      explanation: "Texture is trending positive. Maintain a steady routine rather than changing products too often."
    },
    {
      type: "Hydration",
      score: 84,
      direction: "improving",
      explanation: "Hydration appears strong. Keep humectants and moisturizer in both morning and night routines."
    }
  ],
  readingSteps: [
    "Image quality is checked before analysis.",
    "Skin signals are converted into clear concern scores.",
    "Personalization context helps tune routine guidance.",
    "Progress views turn scans into a clear improvement story."
  ]
};
