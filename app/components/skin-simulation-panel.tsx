"use client";

import { Loader2, Sparkles } from "lucide-react";
import type { ScanSession } from "../lib/scan-session";
import { getOriginalScanImageUrl } from "../lib/scan-session";
import { useSkinSimulation } from "../hooks/use-skin-simulation";
import { SimulationCompare } from "./simulation-compare";
import { Panel, StatusBadge } from "./ui";

export function SkinSimulationPanel({
  session,
  compact = false
}: {
  session: ScanSession;
  compact?: boolean;
}) {
  const { simulationUrl, simulationMode, simulationStatus, simulationMessage, runSimulation, hydrated } =
    useSkinSimulation(session);
  const currentPreviewUrl = getOriginalScanImageUrl(session);

  return (
    <Panel className={compact ? "" : "gradient-border"}>
      <div className="flex flex-wrap items-center gap-3">
        <Sparkles className="h-5 w-5 text-violet-200" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-white">YouCam Skin Simulation</h2>
        <StatusBadge tone="violet">5th YouCam API</StatusBadge>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Preview an improvement direction from your current scan — education and motivation, not a guaranteed clinical result.
      </p>

      <button
        type="button"
        onClick={() => void runSimulation()}
        disabled={simulationStatus === "loading" || !hydrated}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-violet-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {simulationStatus === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        )}
        {simulationStatus === "loading" ? "Running simulation…" : "Run Skin Simulation"}
      </button>

      {simulationMessage ? (
        <p className={`mt-3 text-xs leading-5 ${simulationStatus === "error" ? "text-rose-200" : "text-slate-400"}`}>
          {simulationMessage}
        </p>
      ) : null}

      <SimulationCompare
        currentLabel={session.mode === "live" ? "Live scan" : "Demo scan"}
        currentImageUrl={currentPreviewUrl}
        currentScore={session.analysis.overallScore}
        simulatedImageUrl={simulationUrl}
        simulatedMode={simulationMode}
        compact={compact}
      />
    </Panel>
  );
}
