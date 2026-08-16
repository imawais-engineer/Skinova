"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { History, LineChart, Loader2, Sparkles } from "lucide-react";
import {
  buildProgressFromAnalysis,
  buildScanHistoryEntries,
  formatScanDate,
  type ScanHistoryEntry
} from "../lib/scan-session";
import { useScanSession } from "../hooks/use-scan-session";
import { EmptyScanState } from "./empty-scan-state";
import { PageHeader, Panel, StatusBadge } from "./ui";

import type { AnalysisResult } from "../lib/skinova-data";

type ScanListItem = {
  id: string;
  analysis: AnalysisResult;
  mode: "demo" | "live";
  overallScore: number;
  scannedAt: string;
  fileId?: string | null;
};

type SimulationResponse = {
  status?: string;
  resultUrl?: string;
  mode?: "demo" | "live";
  error?: string;
  pollingUrl?: string;
  message?: string;
};

export function ProgressExperience() {
  const { session, ready } = useScanSession();
  const entries = session ? buildProgressFromAnalysis(session.analysis) : null;
  const current = entries?.[0];
  const projected = entries?.[entries.length - 1];
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [simulationUrl, setSimulationUrl] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState<"demo" | "live" | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [simulationMessage, setSimulationMessage] = useState("");

  useEffect(() => {
    if (!ready || !session) {
      setHistory([]);
      return;
    }

    let cancelled = false;

    async function loadHistory() {
      try {
        const response = await fetch("/api/skinova/scans");
        if (!response.ok || cancelled) {
          return;
        }

        const data = (await response.json()) as { scans?: ScanListItem[] };
        if (!data.scans?.length || cancelled) {
          return;
        }

        setHistory(
          buildScanHistoryEntries(
            data.scans.map((scan) => ({
              id: scan.id,
              scannedAt: scan.scannedAt,
              mode: scan.mode,
              analysis: scan.analysis
            }))
          )
        );
      } catch {
        // History is optional; current session still works.
      }
    }

    void loadHistory();
    return () => {
      cancelled = true;
    };
  }, [ready, session?.scannedAt, session?.analysis.overallScore]);

  const historyTrend = useMemo(() => {
    if (history.length < 2) {
      return null;
    }

    const latest = history[0];
    const previous = history[1];
    const delta = latest.overall - previous.overall;

    return {
      latest,
      previous,
      delta,
      direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat"
    };
  }, [history]);

  async function pollSimulation(pollingUrl: string) {
    for (let attempt = 1; attempt <= 12; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 1200 : 2000));
      const response = await fetch(pollingUrl);
      const data = (await response.json()) as SimulationResponse;

      if (data.resultUrl) {
        return { ok: true, resultUrl: data.resultUrl, mode: data.mode || "live" };
      }

      if (!response.ok || data.status === "error" || data.error) {
        return { ok: false, message: data.error || "Simulation could not be completed." };
      }
    }

    return { ok: false, message: "Simulation is taking longer than expected. Please try again." };
  }

  async function runSimulation() {
    if (!session) {
      return;
    }

    setSimulationStatus("loading");
    setSimulationMessage("Starting YouCam Skin Simulation…");
    setSimulationUrl(null);

    try {
      const response = await fetch("/api/skinova/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId: session.scanId, fileId: session.fileId })
      });
      const data = (await response.json()) as SimulationResponse;

      if (!response.ok || data.error) {
        setSimulationStatus("error");
        setSimulationMessage(data.error || "Simulation could not be started.");
        return;
      }

      if (data.pollingUrl) {
        setSimulationMessage(data.message || "Rendering improvement preview…");
        const result = await pollSimulation(data.pollingUrl);

        if (result.ok && result.resultUrl) {
          setSimulationUrl(result.resultUrl);
          setSimulationMode(result.mode || "live");
          setSimulationStatus("ready");
          setSimulationMessage("YouCam Skin Simulation preview is ready.");
          return;
        }

        setSimulationStatus("error");
        setSimulationMessage(result.message || "Simulation failed.");
        return;
      }

      setSimulationStatus("error");
      setSimulationMessage("No simulation task was returned.");
    } catch {
      setSimulationStatus("error");
      setSimulationMessage("Network error while running simulation.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Progress tracking"
        title="Skinova continues after the first scan."
        description="Trend history, account-backed scan memory, and live YouCam Skin Simulation previews show long-term consumer value."
        action={{ href: "/scan", label: "Run scan" }}
      />

      {ready && !session ? (
        <EmptyScanState message="No progress baseline yet. Run a scan to anchor trend cards, scan history, and simulation previews to your account." />
      ) : null}

      {session && entries && current && projected ? (
        <div className="flex flex-col gap-8">
          <Panel className="border-emerald-300/20 bg-emerald-300/[0.05]">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="mint">{session.mode === "demo" ? "Demo progress" : "Live progress"}</StatusBadge>
              <p className="text-sm text-emerald-50/90">
                {history.length > 1
                  ? `${history.length} scans saved to your account. Trends compare your latest results.`
                  : "Trend cards are based on your latest scan concerns."}
              </p>
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
              <h2 className="mt-4 text-xl font-semibold text-white">YouCam Skin Simulation</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Run the second YouCam API in Skinova to preview realistic improvement direction from your latest scan file — education and motivation, not a guaranteed result.
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

              <button
                type="button"
                onClick={() => void runSimulation()}
                disabled={simulationStatus === "loading"}
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-violet-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-70"
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

              {simulationUrl && simulationStatus === "ready" ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
                    <p className="text-xs font-medium text-slate-300">Simulation preview</p>
                    <StatusBadge tone={simulationMode === "live" ? "mint" : "cyan"}>
                      {simulationMode === "live" ? "Live YouCam" : "Demo preview"}
                    </StatusBadge>
                  </div>
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={simulationUrl}
                      alt="YouCam skin simulation preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              ) : null}
            </Panel>
          </div>

          {history.length > 0 ? (
            <Panel>
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white">Scan history</h2>
              </div>
              {historyTrend ? (
                <p className="mt-2 text-sm text-slate-300">
                  Overall score moved {historyTrend.delta > 0 ? "up" : historyTrend.delta < 0 ? "down" : "flat"} by{" "}
                  {Math.abs(historyTrend.delta)} points since your previous scan.
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-300">Each scan is saved to your account for trend comparison.</p>
              )}
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {history.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{formatScanDate(entry.scannedAt)}</p>
                      <StatusBadge tone={entry.mode === "live" ? "mint" : "cyan"}>
                        {entry.mode === "live" ? "Live" : "Demo"}
                      </StatusBadge>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-white">{entry.overall}%</p>
                    <div className="mt-4 space-y-2">
                      <MiniBar label="Acne" value={entry.acne} />
                      <MiniBar label="Redness" value={entry.redness} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          ) : null}
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
