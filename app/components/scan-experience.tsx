"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, UploadCloud } from "lucide-react";
import { Panel, ScoreBar, StatusBadge } from "./ui";
import type { AnalysisResult } from "../lib/skinova-data";

type AnalyzeResponse = {
  mode: string;
  analysis?: AnalysisResult;
  error?: string;
  pollingUrl?: string | null;
  taskId?: string | null;
  task_status?: string;
  task?: {
    analysis?: AnalysisResult;
    task_status?: string;
    data?: {
      task_id?: string;
      task_status?: string;
    };
  };
  message?: string;
};

export function ScanExperience() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState("Select a selfie or run the demo scan.");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  async function runDemoScan() {
    setStatus("running");
    setMessage("Running demo-safe YouCam-style analysis...");

    try {
      const response = await fetch("/api/skinova/analyze", { method: "POST" });
      const data = (await response.json()) as AnalyzeResponse;
      setAnalysis(data.analysis || data.task?.analysis || null);
      setMessage(data.message || "Demo scan complete.");
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Demo scan failed. Check the local dev server and try again.");
    }
  }

  async function analyzeSelectedFile() {
    if (!file) {
      setStatus("error");
      setMessage("Choose a photo first, or use the demo scan.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setStatus("running");
    setMessage("Preparing YouCam workflow. Demo mode will avoid consuming API units unless disabled.");

    try {
      const response = await fetch("/api/youcam/analyze", {
        method: "POST",
        body: formData
      });
      const data = (await response.json()) as AnalyzeResponse;

      if (!response.ok || data.error) {
        setStatus("error");
        setMessage(data.error || "YouCam analysis request failed.");
        return;
      }

      if (data.mode === "live" && data.pollingUrl) {
        setMessage("Live YouCam task created. Polling task status...");
        const finalResult = await pollLiveTask(data.pollingUrl);
        setAnalysis(finalResult.analysis || data.task?.analysis || data.analysis || null);
        setMessage(finalResult.message);
        setStatus(finalResult.ok ? "done" : "error");
        return;
      }

      setAnalysis(data.task?.analysis || data.analysis || null);
      setMessage("Mock YouCam workflow completed. Add API credentials and disable demo mode for live processing.");
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("The scan workflow failed. Use demo mode or check API configuration.");
    }
  }

  async function pollLiveTask(pollingUrl: string) {
    for (let attempt = 1; attempt <= 8; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 1500 : 3000));
      const response = await fetch(pollingUrl);
      const data = (await response.json()) as AnalyzeResponse;
      const taskStatus = data.task?.task_status || data.task?.data?.task_status || data.task_status;

      if (data.analysis) {
        return {
          ok: true,
          analysis: data.analysis,
          message: "Live YouCam analysis completed and was converted into Skinova guidance."
        };
      }

      if (taskStatus === "success") {
        return {
          ok: true,
          analysis: data.task?.analysis || data.analysis || null,
          message: "Live YouCam task completed. Raw result is available from the polling endpoint."
        };
      }

      if (!response.ok || taskStatus === "error" || data.error) {
        return {
          ok: false,
          analysis: null,
          message: data.error || "Live YouCam task returned an error. Check image quality and API configuration."
        };
      }

      setMessage(`Live YouCam task is ${taskStatus || "running"}... polling attempt ${attempt}/8.`);
    }

    return {
      ok: false,
      analysis: null,
      message: "Live YouCam task is still running. Poll again from the task status endpoint or use demo mode for judging."
    };
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <Panel>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Selfie scan</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Use a clear front-facing image. The functional prototype defaults to a safe mock workflow so the demo does not depend on API units.
            </p>
          </div>
          <StatusBadge tone={status === "done" ? "mint" : status === "error" ? "rose" : "cyan"}>
            {status === "running" ? "Running" : status === "done" ? "Complete" : status === "error" ? "Needs attention" : "Ready"}
          </StatusBadge>
        </div>

        <label className="mt-6 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/[0.04] px-5 py-8 text-center transition hover:bg-cyan-300/[0.08]">
          <UploadCloud className="h-9 w-9 text-cyan-200" aria-hidden="true" />
          <span className="mt-4 text-sm font-medium text-white">{file ? file.name : "Choose selfie image"}</span>
          <span className="mt-2 text-xs leading-5 text-slate-400">JPG or PNG. Keep face centered with even lighting.</span>
          <input
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </label>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={runDemoScan}
            disabled={status === "running"}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "running" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Run demo scan
          </button>
          <button
            type="button"
            onClick={analyzeSelectedFile}
            disabled={status === "running"}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/12 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Analyze selected photo
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm leading-6 text-slate-300">{message}</p>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-slate-300">
          {["Front-facing selfie", "Even lighting", "No medical diagnosis claims", "Server-side API key handling"].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <h2 className="text-xl font-semibold text-white">Live result preview</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          This preview is what judges should see immediately after the scan completes.
        </p>

        {analysis ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
              <p className="text-sm text-emerald-100">Skin health score</p>
              <p className="mt-2 text-5xl font-semibold text-white">{analysis.overallScore}%</p>
              <p className="mt-3 text-sm leading-6 text-emerald-50/80">{analysis.summary}</p>
            </div>
            <div className="space-y-4">
              {analysis.concerns.slice(0, 4).map((concern) => (
                <ScoreBar key={concern.type} label={concern.type} score={concern.score} detail={concern.explanation} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-sm leading-6 text-slate-400">
              Run a demo scan to show YouCam-style scores, plain-language insights, and routine guidance.
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}
