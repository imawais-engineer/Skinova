import { Activity, Camera, ClipboardList, LineChart, ShieldCheck, Sparkles } from "lucide-react";

export type Concern = {
  type: string;
  score: number;
  direction: "improving" | "watch" | "stable";
  explanation: string;
};

export type AnalysisResult = {
  overallScore: number;
  skinType: string;
  tone: string;
  summary: string;
  concerns: Concern[];
  workflow: string[];
};

export const analysisResult: AnalysisResult = {
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
  workflow: [
    "AI Photo Enhance prepares the image for more reliable analysis.",
    "AI Skin Analysis produces concern scores and mask-ready result data.",
    "Fitzpatrick Skin Type Analysis adds personalization context.",
    "Skin Simulation visualizes an improvement path for the demo."
  ]
};

export const dashboardMetrics = [
  {
    label: "Skin health score",
    value: "82%",
    detail: "Demo-safe YouCam-style analysis result.",
    icon: Activity,
    tone: "mint" as const
  },
  {
    label: "API workflows",
    value: "4",
    detail: "Enhance, analyze, classify, simulate.",
    icon: Sparkles,
    tone: "cyan" as const
  },
  {
    label: "Routine steps",
    value: "8",
    detail: "Morning and night plan generated from the analysis.",
    icon: ClipboardList,
    tone: "violet" as const
  },
  {
    label: "Demo safety",
    value: "On",
    detail: "Mock fallback protects API units and judge demos.",
    icon: ShieldCheck,
    tone: "rose" as const
  }
];

export const demoTimeline = [
  { label: "Upload", value: "Selfie quality and consent check" },
  { label: "Analyze", value: "YouCam Skin AI workflow with task states" },
  { label: "Explain", value: "Plain-language insights from technical scores" },
  { label: "Guide", value: "Routine, ingredient, and progress actions" }
];

export const routinePlan = {
  morning: [
    "Low-foam gentle cleanser",
    "Niacinamide serum for oil balance and redness support",
    "Barrier-focused lightweight moisturizer",
    "Broad-spectrum SPF 30+ sunscreen"
  ],
  night: [
    "Gentle cleanser",
    "Hydrating toner or essence",
    "Salicylic acid treatment two nights per week",
    "Ceramide moisturizer"
  ],
  avoid: [
    "Do not stack retinol and exfoliating acids on the same night.",
    "Avoid harsh scrubs while redness is active.",
    "Patch test new actives before applying across the face."
  ]
};

export const progressEntries = [
  { date: "Week 1", acne: 60, redness: 52, texture: 70, hydration: 76, overall: 74 },
  { date: "Week 2", acne: 62, redness: 55, texture: 72, hydration: 79, overall: 77 },
  { date: "Week 3", acne: 64, redness: 58, texture: 76, hydration: 84, overall: 82 }
];

export const apiHighlights = [
  { label: "AI Photo Enhance", value: "Prepares selfie quality before analysis", icon: Camera },
  { label: "AI Skin Analysis", value: "Scores skin concerns and supports masks", icon: Activity },
  { label: "Skin Simulation", value: "Shows realistic improvement visualization", icon: Sparkles },
  { label: "Progress Tracking", value: "Turns scans into trend intelligence", icon: LineChart }
];
