"use client";

import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import {
  buildHistoryTrend,
  describeHistoryDelta,
  formatScanDateShort,
  type ScanHistoryEntry
} from "../lib/scan-session";
import { StatusBadge } from "./ui";

export function ScanHistoryStrip({
  history,
  href = "/progress"
}: {
  history: ScanHistoryEntry[];
  href?: string;
}) {
  const trend = buildHistoryTrend(history);

  if (!trend) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="mint">Scan history</StatusBadge>
            {trend.previous ? (
              <StatusBadge tone={trend.direction === "up" ? "mint" : trend.direction === "down" ? "rose" : "cyan"}>
                {trend.direction === "up" ? (
                  <span className="inline-flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    +{trend.delta}
                  </span>
                ) : trend.direction === "down" ? (
                  <span className="inline-flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" aria-hidden="true" />
                    {trend.delta}
                  </span>
                ) : (
                  "No change"
                )}
              </StatusBadge>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-200">{describeHistoryDelta(trend)}</p>
        </div>
        <Link
          href={href}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          View progress
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {history.slice(0, 6).map((entry, index) => (
          <div
            key={entry.id}
            className={[
              "min-w-[7.5rem] shrink-0 rounded-xl border px-3 py-2.5",
              index === 0 ? "border-cyan-300/30 bg-cyan-300/10" : "border-white/10 bg-white/[0.03]"
            ].join(" ")}
          >
            <p className="text-[10px] uppercase tracking-wide text-slate-400">{formatScanDateShort(entry.scannedAt)}</p>
            <p className="mt-1 text-lg font-semibold text-white">{entry.overall}%</p>
            <p className="mt-0.5 text-[10px] text-slate-400">{entry.mode === "live" ? "Live" : "Demo"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
