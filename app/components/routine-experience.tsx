"use client";

import Link from "next/link";
import { ClipboardList, ShieldCheck } from "lucide-react";
import { generateRoutineFromAnalysis } from "../lib/scan-session";
import { useScanSession } from "../hooks/use-scan-session";
import { EmptyScanState } from "./empty-scan-state";
import { PageHeader, Panel, StatusBadge } from "./ui";

export function RoutineExperience() {
  const { session, ready } = useScanSession();
  const plan = session ? generateRoutineFromAnalysis(session.analysis) : null;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Personalized guidance"
        title="A routine generated from the analysis."
        description="Skinova turns technical results into a practical morning and night plan without making medical claims."
        action={{ href: "/coach", label: "Ask coach" }}
      />

      {ready && !session ? (
        <EmptyScanState message="No routine yet. Complete a scan first — Skinova will generate morning, night, and ingredient safety notes from your concern scores." />
      ) : null}

      {session && plan ? (
        <>
          <Panel className="border-emerald-300/20 bg-emerald-300/[0.05]">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="mint">{session.mode === "demo" ? "Demo routine" : "Live routine"}</StatusBadge>
              <p className="text-sm text-emerald-50/90">
                Generated from your latest scan score of {session.analysis.overallScore}%.
              </p>
            </div>
          </Panel>

          <div className="section-grid lg:grid-cols-2">
            <RoutineCard title="Morning routine" items={plan.morning} />
            <RoutineCard title="Night routine" items={plan.night} />
          </div>

          <Panel>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-200" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-white">Ingredient safety notes</h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {plan.avoid.map((item) => (
                <div key={item} className="rounded-2xl border border-rose-300/15 bg-rose-300/[0.06] p-5 text-sm leading-7 text-rose-50/90">
                  {item}
                </div>
              ))}
            </div>
          </Panel>
        </>
      ) : null}
    </div>
  );
}

function RoutineCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-cyan-200" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <StatusBadge tone="cyan">{items.length} steps</StatusBadge>
      </div>
      <div className="mt-8 space-y-4">
        {items.map((item, index) => (
          <div key={item} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/12 text-sm font-semibold text-cyan-100">
              {index + 1}
            </span>
            <p className="min-w-0 text-sm leading-7 text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
