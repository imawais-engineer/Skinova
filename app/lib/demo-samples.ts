import type { AnalysisResult } from "./skinova-data";

export type ScanSample = {
  id: string;
  label: string;
  description: string;
  mode: "live" | "demo";
  fileName?: string;
  previewPath?: string;
  badge: string;
};

export const skinScanRequirements = {
  title: "Photo requirements for Skin Scan",
  summary:
    "YouCam Skin AI works best with a clear front-facing selfie. If a photo fails, it is usually due to framing or resolution — not a broken app.",
  items: [
    "Front-facing selfie with your face centered and looking at the camera",
    "Face should fill most of the frame (roughly 60% or more of image width)",
    "Short side at least 480px; higher resolution is better",
    "Even lighting, minimal blur, and no heavy filters",
    "JPG or PNG format, under 10MB",
    "Avoid group photos, side profiles, cropped faces, or very dark images"
  ],
  commonErrors: [
    {
      code: "error_below_min_image_size",
      message: "Image resolution is too small. Use a higher-quality photo."
    },
    {
      code: "error_src_face_too_small",
      message: "Face is too small in the frame. Move closer or crop tighter around your face."
    },
    {
      code: "error_src_face_out_of_bound",
      message: "Face is cut off or out of frame. Center your full face in the photo."
    },
    {
      code: "error_lighting_dark",
      message: "Photo is too dark. Retake it in brighter, even lighting."
    }
  ]
};

export const scanSamples: ScanSample[] = [
  {
    id: "live-tight-1",
    label: "Sample selfie A",
    description: "YouCam-verified demo photo with proper face framing.",
    mode: "live",
    fileName: "live-selfie-tight.jpg",
    previewPath: "/samples/live-selfie-tight.jpg",
    badge: "Live sample"
  },
  {
    id: "live-tight-2",
    label: "Sample selfie B",
    description: "Alternate YouCam-verified demo photo for testing.",
    mode: "live",
    fileName: "live-selfie-2.jpg",
    previewPath: "/samples/live-selfie-2.jpg",
    badge: "Live sample"
  },
  {
    id: "demo-guided",
    label: "Guided demo scan",
    description: "Representative Skinova results when you want a guaranteed walkthrough.",
    mode: "demo",
    badge: "Demo sample"
  }
];

export const coachSamplePrompts = [
  "Why is my skin red this week?",
  "What should my morning routine include?",
  "Can I use niacinamide with salicylic acid?",
  "How do I reduce breakout risk without harsh products?"
];

export function getScanSample(sampleId: string) {
  return scanSamples.find((sample) => sample.id === sampleId);
}

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
