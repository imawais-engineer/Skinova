"use client";

import { LineChart, Sparkles } from "lucide-react";
import { buildProgressFromAnalysis } from "../lib/scan-session";
import { useScanSession } from "../hooks/use-scan-session";
import { EmptyScanState } from "./empty-scan-state";
import { PageHeader, Panel, StatusBadge } from "./ui";

export function ProgressExperience() {
  const { session, ready } = useScanSession();
  const entries = session ? buildProgressFromAnalysis(session.analysis) : null;
  const current = entries?.[0];
  const projected = entries?.[entries.length - 1];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Progress tracking"
        title="Skinova continues after the first scan."
        description="The progress view demonstrates long-term consumer value: trends, goals, and simulation-backed improvement expectations."
        action={{ href: "/health", label: "App health" }}
      />

      {ready && !session ? (
        <EmptyScanState message="No progress baseline yet. Run a scan to anchor trend cards and projected improvement to your actual concern scores." />
      ) : null}

      {session && entries && current && projected ? (
        <div className="flex flex-col gap-8">
          <Panel className="border-emerald-300/20 bg-emerald-300/[0.05]">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="mint">{session.mode === "demo" ? "Demo progress" : "Live progress"}</StatusBadge>
              <p className="text-sm text-emerald-50/90">Trend cards are based on your latest scan concerns.</p>
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <Panel>
              <div className="flex items-center gap-3">
                <LineChart className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white">Scan-based trend</h2>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {entries.map((entry) => (
                  <div key={entry.date} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{entry.date}</p>
                      <StatusBadge tone="mint">{entry.overall}%</StatusBadge>
                    </div>
                    <div className="mt-5 space-y-3">
                      <MiniBar label="Acne" value={entry.acne} />
                      <MiniBar label="Redness" value={entry.redness} />
                      <MiniBar label="Texture" value={entry.texture} />
                      <MiniBar label="Hydration" value={entry.hydration} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="gradient-border">
              <Sparkles className="h-6 w-6 text-violet-200" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold text-white">Simulation story</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Skinova uses the Skin Simulation concept to show realistic improvement direction, not a guaranteed result. This connects analysis to progress and motivation.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">Current</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{current.overall}%</p>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <p className="text-xs text-emerald-100/80">Projected</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{projected.overall}%</p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-xs text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
