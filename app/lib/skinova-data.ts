import { Activity, Camera, ClipboardList, HeartPulse, LineChart, Sparkles } from "lucide-react";

export type Concern = {
  type: string;
  score: number;
  direction: "improving" | "watch" | "stable";
  explanation: string;
  maskUrls?: string[];
};

export type PersonalizationContext = {
  fitzpatrickScale?: string;
  fitzpatrickLabel?: string;
  skinColorHex?: string;
  eyeColorName?: string;
  lipColorHex?: string;
  hairColorName?: string;
  source?: "live" | "demo";
};

export type AnalysisResult = {
  overallScore: number;
  skinType: string;
  tone: string;
  summary: string;
  concerns: Concern[];
  readingSteps: string[];
  personalization?: PersonalizationContext;
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
      explanation: "Mild breakout risk appears around oil-prone areas. Keep cleansing gentle and avoid stacking harsh actives.",
      maskUrls: ["/samples/youcam-acne-female-light.jpg"]
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
    "Fitzpatrick and skin tone APIs add personalization context.",
    "Concern masks show where YouCam detected each signal."
  ],
  personalization: {
    fitzpatrickScale: "III",
    fitzpatrickLabel: "Fitzpatrick Type III",
    skinColorHex: "#b9947c",
    eyeColorName: "Brown",
    lipColorHex: "#d23245",
    hairColorName: "Brown",
    source: "demo"
  }
};

export const dashboardMetrics = [
  {
    label: "Skin health score",
    value: "82%",
    detail: "Latest skin intelligence result.",
    icon: Activity,
    tone: "mint" as const
  },
  {
    label: "Care signals",
    value: "4",
    detail: "Texture, pores, redness, and hydration.",
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
    label: "App health",
    value: "Live",
    detail: "Scan, guide, and progress flows are online.",
    icon: HeartPulse,
    tone: "mint" as const
  }
];

export const careTimeline = [
  { label: "Upload", value: "Selfie quality and consent check" },
  { label: "Analyze", value: "Skin intelligence engine evaluates the image" },
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

export const experienceHighlights = [
  { label: "Image Quality", value: "Checks that the selfie is clear before analysis", icon: Camera },
  { label: "Skin Analysis", value: "Scores visible concerns and care signals", icon: Activity },
  { label: "Routine Guidance", value: "Turns results into practical skincare steps", icon: ClipboardList },
  { label: "Progress Tracking", value: "Turns scans into trend intelligence", icon: LineChart }
];
