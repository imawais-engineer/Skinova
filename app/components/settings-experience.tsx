"use client";

import { useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { clearScanSession } from "../lib/scan-session";
import type { ResetTarget } from "../api/skinova/reset/route";
import { Panel, PageHeader } from "./ui";

type ResetOption = {
  id: ResetTarget;
  label: string;
  description: string;
};

const resetOptions: ResetOption[] = [
  {
    id: "scan",
    label: "Skin scan & results",
    description: "Clears your latest scan scores, concern breakdown, and results views."
  },
  {
    id: "routine",
    label: "Routine & progress",
    description: "Clears generated routine guidance and progress trends. Also removes the scan session they are based on."
  },
  {
    id: "coach",
    label: "Skin Coach history",
    description: "Deletes saved coach conversation history for your account and resets the chat on this device."
  }
];

export function SettingsExperience() {
  const [selected, setSelected] = useState<Set<ResetTarget>>(new Set());
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function toggleTarget(target: ResetTarget) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(target)) {
        next.delete(target);
      } else {
        next.add(target);
      }
      return next;
    });
    setMessage("");
    setStatus("idle");
  }

  function selectAll() {
    setSelected(new Set(resetOptions.map((option) => option.id)));
    setMessage("");
    setStatus("idle");
  }

  async function runReset() {
    if (!selected.size) {
      setStatus("error");
      setMessage("Select at least one item to reset.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const targets = [...selected];
    const needsScanClear = targets.includes("scan") || targets.includes("routine");
    const needsCoachClear = targets.includes("coach");

    try {
      const clearedParts: string[] = [];
      const response = await fetch("/api/skinova/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targets })
      });
      const data = (await response.json()) as { error?: string; cleared?: string[] };

      if (!response.ok) {
        throw new Error(data.error || "Reset failed.");
      }

      if (needsScanClear) {
        clearScanSession();
        window.dispatchEvent(new Event("skinova:session-updated"));
        clearedParts.push("scan, results, routine, and progress");
      }

      if (needsCoachClear) {
        window.dispatchEvent(new Event("skinova:coach-reset"));
        clearedParts.push("Skin Coach history");
      }

      setMessage(`Cleared ${clearedParts.join(" and ")}.`);
      setStatus("done");
      setSelected(new Set());
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Reset failed. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Settings"
        title="Manage your Skinova data."
        description="Reset scan results, routine guidance, progress views, or Skin Coach history. Your account stays signed in."
      />

      <Panel className="!p-4 sm:!p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Reset data</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Choose what to clear on this device and your account. This cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={selectAll}
            className="text-xs font-medium text-cyan-200 transition hover:text-cyan-100"
          >
            Select all
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {resetOptions.map((option) => {
            const checked = selected.has(option.id);
            return (
              <label
                key={option.id}
                className={[
                  "flex cursor-pointer gap-3 rounded-xl border p-3 transition",
                  checked ? "border-cyan-300/30 bg-cyan-300/[0.06]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-300 focus:ring-cyan-300/40"
                  checked={checked}
                  onChange={() => toggleTarget(option.id)}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">{option.label}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-400">{option.description}</span>
                </span>
              </label>
            );
          })}
        </div>

        {message ? (
          <p className={`mt-4 text-sm leading-6 ${status === "error" ? "text-rose-200" : "text-emerald-200"}`}>{message}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void runReset()}
            disabled={status === "loading" || !selected.size}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-300/25 bg-rose-300/10 px-4 text-sm font-semibold text-rose-50 transition hover:bg-rose-300/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RotateCcw className="h-4 w-4" aria-hidden="true" />}
            Reset selected
          </button>
        </div>
      </Panel>
    </div>
  );
}
