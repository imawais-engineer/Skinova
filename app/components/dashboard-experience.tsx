"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { careTimeline, experienceHighlights } from "../lib/skinova-data";
import { generateRoutineFromAnalysis } from "../lib/scan-session";
import { useScanSession } from "../hooks/use-scan-session";
import { EmptyScanState } from "./empty-scan-state";
import { MetricCard, PageHeader, Panel, ScoreBar, StatusBadge } from "./ui";

export function DashboardExperience({ userName }: { userName: string }) {
  const { session, ready } = useScanSession();
  const analysis = session?.analysis;
  const routine = analysis ? generateRoutineFromAnalysis(analysis) : null;
  const topConcerns = analysis?.concerns.slice(0, 3) ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Your Skinova workspace"
        title={`Welcome back, ${userName}.`}
        description="Start a scan, review your latest insights, and continue your skincare guidance journey."
        action={{ href: "/scan", label: "Start scan" }}
      />

      {ready && !session ? (
        <EmptyScanState message="No scan results yet. Run a live scan or load demo sample data to populate your dashboard, results, routine, and progress views." />
      ) : null}

      {analysis ? (
        <div className="mb-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={experienceHighlights[1].icon}
            label="Skin health score"
            value={`${analysis.overallScore}%`}
            detail={`Latest ${session?.mode === "demo" ? "demo" : "live"} scan result.`}
            tone="mint"
          />
          <MetricCard
            icon={experienceHighlights[0].icon}
            label="Care signals"
            value={`${analysis.concerns.length}`}
            detail="Tracked concerns from your most recent analysis."
            tone="cyan"
          />
          <MetricCard
            icon={experienceHighlights[2].icon}
            label="Routine steps"
            value={`${(routine?.morning.length ?? 0) + (routine?.night.length ?? 0)}`}
            detail="Morning and night steps generated from your scan."
            tone="violet"
          />
          <MetricCard
            icon={experienceHighlights[3].icon}
            label="Scan status"
            value={session?.mode === "live" ? "Live" : "Demo"}
            detail="Results, routine, and progress are synced to this session."
            tone="mint"
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
        <Panel className="gradient-border">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <StatusBadge tone="mint">Your care journey</StatusBadge>
              <h2 className="mt-4 text-2xl font-semibold text-white">Selfie to action plan in under three minutes</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Skinova turns skin intelligence into explanations, routines, progress trends, and an improvement story you can act on.
              </p>
            </div>
            <Link
              href="/results"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View results
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-4">
            {careTimeline.map((step, index) => (
              <div key={step.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/12 text-sm font-semibold text-cyan-100">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm font-semibold text-white">{step.label}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{step.value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          {analysis ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Latest scan snapshot</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{analysis.overallScore}%</p>
                </div>
                <StatusBadge tone={session?.mode === "live" ? "mint" : "cyan"}>
                  {session?.mode === "live" ? "Live scan" : "Demo scan"}
                </StatusBadge>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{analysis.summary}</p>
              <div className="mt-5 space-y-4">
                {topConcerns.map((concern) => (
                  <ScoreBar key={concern.type} label={concern.type} score={concern.score} detail={concern.explanation} />
                ))}
              </div>
              <Link
                href="/routine"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Open routine
              </Link>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-slate-400">Next step</p>
                <p className="mt-2 text-2xl font-semibold text-white">Run your first skin scan</p>
              </div>
              <div className="mt-5 space-y-3">
                {["Upload a clear selfie", "Review personalized insights", "Follow your routine guidance", "Track progress over time"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/scan"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Start scan
              </Link>
            </>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-4">
        {experienceHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <Panel key={item.label}>
              <Icon className="h-5 w-5 text-cyan-200" aria-hidden="true" />
              <p className="mt-4 text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.value}</p>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
