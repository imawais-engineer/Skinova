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
  summary: "Clear front-facing selfie. Most failures are framing or lighting — not a broken app.",
  items: [
    "Face centered, eyes toward the camera",
    "Face fills ~60% or more of the frame",
    "Short side at least 480px",
    "Even lighting, minimal blur, no heavy filters",
    "JPG or PNG under 10MB"
  ]
};

/** YouCam API Playground sample faces bundled in /public/samples */
export const scanSamples: ScanSample[] = [
  {
    id: "clear-baseline",
    label: "Clear skin",
    trait: "Even tone",
    description: "Healthy-looking baseline from the YouCam playground.",
    fileName: "youcam-clear-baseline.jpg",
    previewPath: "/samples/youcam-clear-baseline.jpg"
  },
  {
    id: "acne-male",
    label: "Active acne (male)",
    trait: "Breakouts",
    description: "Young man with visible cheek and jawline acne.",
    fileName: "youcam-acne-male.jpg",
    previewPath: "/samples/youcam-acne-male.jpg"
  },
  {
    id: "acne-female-light",
    label: "Active acne",
    trait: "Redness",
    description: "Fair complexion with inflamed cheek breakouts.",
    fileName: "youcam-acne-female-light.jpg",
    previewPath: "/samples/youcam-acne-female-light.jpg"
  },
  {
    id: "acne-female-severe",
    label: "Severe acne",
    trait: "Spots",
    description: "Widespread acne and post-inflammatory marks.",
    fileName: "youcam-acne-female-severe.jpg",
    previewPath: "/samples/youcam-acne-female-severe.jpg"
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
