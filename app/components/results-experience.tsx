"use client";

import Link from "next/link";
import { Activity, ArrowRight, Sparkles } from "lucide-react";
import { useScanSession } from "../hooks/use-scan-session";
import { EmptyScanState } from "./empty-scan-state";
import { PageHeader, Panel, ScoreBar, StatusBadge } from "./ui";

export function ResultsExperience() {
  const { session, ready } = useScanSession();
  const result = session?.analysis;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Analysis results"
        title="Plain-language insights from skin scores."
        description="Scores become actions: explanation, routine priorities, and progress markers a consumer can understand."
        action={{ href: "/routine", label: "View routine" }}
      />

      {ready && !session ? (
        <EmptyScanState message="No analysis yet. Run a scan from the Skin Scan page or load demo sample data to preview how Skinova explains concern scores." />
      ) : null}

      {session && result ? (
        <div className="flex flex-col gap-8">
          <Panel className="border-emerald-300/20 bg-emerald-300/[0.05]">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="mint">{session.mode === "demo" ? "Demo scan" : "Live scan"}</StatusBadge>
              <p className="text-sm text-emerald-50/90">
                Latest scan from {new Date(session.scannedAt).toLocaleString()}.
              </p>
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <Panel className="gradient-border">
              <StatusBadge tone="mint">Overall score</StatusBadge>
              <p className="mt-5 text-4xl font-semibold text-white sm:text-5xl">{result.overallScore}%</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">{result.summary}</p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">Skin type</p>
                  <p className="mt-2 text-sm font-semibold text-white">{result.skinType}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">Tone context</p>
                  <p className="mt-2 text-sm font-semibold text-white">{result.tone}</p>
                </div>
              </div>
              <Link
                href="/routine"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Generate routine
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Panel>

            <Panel>
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white">Concern breakdown</h2>
              </div>
              <div className="mt-6 space-y-5">
                {result.concerns.map((concern) => (
                  <ScoreBar key={concern.type} label={concern.type} score={concern.score} detail={concern.explanation} />
                ))}
              </div>
            </Panel>
          </div>

          <Panel>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-violet-200" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-white">How Skinova reads your scan</h2>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {result.readingSteps.map((step) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                  {step}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
