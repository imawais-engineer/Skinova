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
  placeholder = "Run Skin Simulation to preview improvement direction."
}: {
  currentLabel: string;
  currentImageUrl?: string | null;
  currentScore: number;
  simulatedImageUrl?: string | null;
  simulatedMode?: "demo" | "live" | null;
  placeholder?: string;
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <CompareTile
        title="Before · current scan"
        badge={currentLabel}
        score={currentScore}
        imageUrl={currentImageUrl}
        imageAlt="Current scan analysis view"
      />
      <CompareTile
        title="After · simulation"
        badge={simulatedImageUrl ? (simulatedMode === "live" ? "Live YouCam" : "Demo preview") : "Pending"}
        imageUrl={simulatedImageUrl}
        imageAlt="YouCam skin simulation preview"
        placeholder={placeholder}
        highlight={Boolean(simulatedImageUrl)}
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
  highlight = false
}: {
  title: string;
  badge: string;
  score?: number;
  imageUrl?: string | null;
  imageAlt: string;
  placeholder?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border",
        highlight ? "border-emerald-300/25 bg-emerald-300/[0.04]" : "border-white/10 bg-white/[0.03]"
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <p className="text-xs font-medium text-slate-300">{title}</p>
        <StatusBadge tone={highlight ? "mint" : "slate"}>{badge}</StatusBadge>
      </div>
      <div className="relative aspect-[4/5] w-full bg-slate-950/60">
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
