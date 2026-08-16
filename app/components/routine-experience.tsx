"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Loader2, ShieldCheck } from "lucide-react";
import { getRoutinePlan, saveRoutinePlan } from "../lib/scan-session";
import { useScanSession } from "../hooks/use-scan-session";
import type { StructuredRoutinePlan } from "../lib/routine-types";
import { EmptyScanState } from "./empty-scan-state";
import { PageHeader, Panel, StatusBadge } from "./ui";

export function RoutineExperience() {
  const { session, ready } = useScanSession();
  const [plan, setPlan] = useState<StructuredRoutinePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      setPlan(null);
      return;
    }

    const cached = getRoutinePlan(session);
    if (cached) {
      setPlan(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    fetch("/api/skinova/routine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysis: session.analysis })
    })
      .then(async (response) => {
        const data = (await response.json()) as { plan?: StructuredRoutinePlan; error?: string };
        if (!response.ok || !data.plan) {
          throw new Error(data.error || "Routine generation failed");
        }
        if (!cancelled) {
          saveRoutinePlan(session, data.plan);
          setPlan(data.plan);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not generate routine");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Personalized guidance"
        title="AI routine from your face scan."
        description="Generated from YouCam concern scores — structured cards, not static templates."
        action={{ href: "/coach", label: "Ask coach" }}
      />

      {ready && !session ? (
        <EmptyScanState message="No routine yet. Complete a scan first — Skinova will build morning, night, and caution cards from your concern scores." />
      ) : null}

      {session && loading ? (
        <Panel className="flex min-h-[12rem] items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-200" aria-hidden="true" />
          <span className="text-sm text-slate-300">Building your routine from scan data…</span>
        </Panel>
      ) : null}

      {error ? <Panel className="text-sm text-rose-200">{error}</Panel> : null}

      {session && plan ? (
        <div className="flex flex-col gap-8">
          <Panel className="border-emerald-300/20 bg-emerald-300/[0.05]">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="mint">{plan.source === "ai" ? "AI routine" : "Template routine"}</StatusBadge>
              <p className="text-sm text-emerald-50/90">{plan.focus}</p>
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <RoutineCard title="Morning routine" steps={plan.morning} />
            <RoutineCard title="Night routine" steps={plan.night} />
          </div>

          <Panel>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-200" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-white">Ingredient safety notes</h2>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {plan.cautions.map((item) => (
                <div key={`${item.title}-${item.detail}`} className="rounded-2xl border border-rose-300/15 bg-rose-300/[0.06] p-4">
                  <p className="text-sm font-semibold text-rose-50">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-rose-50/85">{item.detail}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}

function RoutineCard({ title, steps }: { title: string; steps: StructuredRoutinePlan["morning"] }) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-cyan-200" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <StatusBadge tone="cyan">{steps.length} steps</StatusBadge>
      </div>
      <div className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <div key={`${step.title}-${index}`} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/12 text-sm font-semibold text-cyan-100">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
