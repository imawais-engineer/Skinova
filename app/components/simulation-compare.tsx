"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { StatusBadge } from "./ui";

export function SimulationCompare({
  currentLabel,
  currentImageUrl,
  currentScore,
  simulatedImageUrl,
  simulatedMode,
  placeholder = "Run Skin Simulation to preview improvement direction.",
  compact = false
}: {
  currentLabel: string;
  currentImageUrl: string;
  currentScore: number;
  simulatedImageUrl?: string | null;
  simulatedMode?: "demo" | "live" | null;
  placeholder?: string;
  compact?: boolean;
}) {
  return (
    <div className={["grid grid-cols-1 sm:grid-cols-2", compact ? "mt-3 gap-2" : "mt-5 gap-3"].join(" ")}>
      <CompareTile
        title="Before · current scan"
        badge={currentLabel}
        score={currentScore}
        imageUrl={currentImageUrl}
        imageAlt="Current scan analysis view"
        compact={compact}
      />
      <CompareTile
        title="After · simulation"
        badge={simulatedImageUrl ? (simulatedMode === "live" ? "Live YouCam" : "Demo preview") : "Pending"}
        imageUrl={simulatedImageUrl}
        imageAlt="YouCam skin simulation preview"
        placeholder={placeholder}
        highlight={Boolean(simulatedImageUrl)}
        compact={compact}
      />
    </div>
  );
}

function CompareTile({
  title,
  badge,
  score,
  imageUrl,
  imageAlt,
  placeholder,
  highlight = false,
  compact = false
}: {
  title: string;
  badge: string;
  score?: number;
  imageUrl?: string | null;
  imageAlt: string;
  placeholder?: string;
  highlight?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border",
        highlight ? "border-emerald-300/25 bg-emerald-300/[0.04]" : "border-white/10 bg-white/[0.03]"
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-1.5">
        <p className="text-xs font-medium text-slate-300">{title}</p>
        <StatusBadge tone={highlight ? "mint" : "slate"}>{badge}</StatusBadge>
      </div>
      <div
        className={[
          "relative w-full bg-slate-950/60",
          compact ? "aspect-[3/4] max-h-[200px]" : "aspect-[4/5]"
        ].join(" ")}
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={imageAlt} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <ImageIcon className="h-8 w-8 text-slate-500" aria-hidden="true" />
            <p className="text-xs leading-5 text-slate-400">{placeholder}</p>
          </div>
        )}
        {typeof score === "number" ? (
          <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {score}% overall
          </div>
        ) : null}
      </div>
    </div>
  );
}
