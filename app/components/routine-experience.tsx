"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardList, ShieldCheck } from "lucide-react";
import { analysisResult, routinePlan } from "../lib/skinova-data";
import { generateRoutineFromAnalysis, getScanSession, type ScanSession } from "../lib/scan-session";
import { PageHeader, Panel, StatusBadge } from "./ui";

export function RoutineExperience() {
  const [session, setSession] = useState<ScanSession | null>(null);

  useEffect(() => {
    setSession(getScanSession());
  }, []);

  const plan = session ? generateRoutineFromAnalysis(session.analysis) : routinePlan;

  return (
    <div>
      <PageHeader
        eyebrow="Personalized guidance"
        title="A routine generated from the analysis."
        description="Skinova turns technical results into a practical morning and night plan without making medical claims."
        action={{ href: "/coach", label: "Ask coach" }}
      />

      {!session ? (
        <Panel className="mb-5 border-amber-300/20 bg-amber-300/[0.05]">
          <p className="text-sm leading-6 text-amber-50/90">
            Showing a sample routine.{" "}
            <Link href="/scan" className="font-semibold text-amber-100 underline underline-offset-2">
              Run a scan
            </Link>{" "}
            to personalize morning and night steps.
          </p>
        </Panel>
      ) : (
        <Panel className="mb-5 border-emerald-300/20 bg-emerald-300/[0.05]">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone="mint">{session.mode === "demo" ? "Demo routine" : "Live routine"}</StatusBadge>
            <p className="text-sm text-emerald-50/90">
              Generated from your latest scan score of {session.analysis.overallScore}%.
            </p>
          </div>
        </Panel>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <RoutineCard title="Morning routine" items={plan.morning} />
        <RoutineCard title="Night routine" items={plan.night} />
      </div>

      <Panel className="mt-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-200" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">Ingredient safety notes</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {plan.avoid.map((item) => (
            <div key={item} className="rounded-2xl border border-rose-300/15 bg-rose-300/[0.06] p-4 text-sm leading-6 text-rose-50/90">
              {item}
            </div>
          ))}
        </div>
      </Panel>

      {!session ? (
        <p className="mt-4 text-xs text-slate-500">
          Sample baseline from the default analysis profile ({analysisResult.skinType}).
        </p>
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
      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <div key={item} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/12 text-sm font-semibold text-cyan-100">
              {index + 1}
            </span>
            <p className="min-w-0 text-sm leading-6 text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
