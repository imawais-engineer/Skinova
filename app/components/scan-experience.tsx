"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, ImageIcon, Loader2, UploadCloud } from "lucide-react";
import { coachSamplePrompts, scanSamples, skinScanRequirements } from "../lib/demo-samples";
import { Panel, ScoreBar, StatusBadge } from "./ui";
import type { AnalysisResult } from "../lib/skinova-data";
import { saveScanSession } from "../lib/scan-session";

type AnalyzeResponse = {
  status?: string;
  mode?: "demo" | "live";
  analysis?: AnalysisResult;
  error?: string;
  pollingUrl?: string | null;
  message?: string;
};

export function ScanExperience() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState("Choose a clear selfie or try one of the demo samples below.");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [scanMode, setScanMode] = useState<"demo" | "live" | null>(null);

  function persistScanResult(result: AnalysisResult, mode: "demo" | "live") {
    saveScanSession({
      analysis: result,
      mode,
      scannedAt: new Date().toISOString()
    });
    setScanMode(mode);
  }

  async function runScanRequest(formData: FormData, modeHint?: "demo" | "live") {
    setStatus("running");
    setMessage("Preparing secure skin scan...");

    try {
      const response = await fetch("/api/skinova/scan", {
        method: "POST",
        body: formData
      });
      const data = (await response.json()) as AnalyzeResponse;

      if (!response.ok || data.error) {
        setStatus("error");
        setMessage(data.error || "The scan could not be completed. Review the photo requirements and try again.");
        return;
      }

      if (data.pollingUrl) {
        setMessage(data.message || "Skin scan started. Waiting for results...");
        const finalResult = await pollLiveTask(data.pollingUrl);
        const nextAnalysis = finalResult.analysis || data.analysis || null;
        if (nextAnalysis) {
          persistScanResult(nextAnalysis, modeHint || data.mode || "live");
        }
        setAnalysis(nextAnalysis);
        setMessage(finalResult.message);
        setStatus(finalResult.ok ? "done" : "error");
        return;
      }

      if (data.analysis) {
        persistScanResult(data.analysis, data.mode || "demo");
      }

      setAnalysis(data.analysis || null);
      setMessage(data.message || "Skin scan completed.");
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("The scan could not be completed. Review the photo requirements and try again.");
    }
  }

  async function analyzeSelectedFile() {
    if (!file) {
      setStatus("error");
      setMessage("Choose a photo first, or try one of the demo samples below.");
      return;
    }

    setSelectedSampleId(null);
    const formData = new FormData();
    formData.append("file", file);
    await runScanRequest(formData);
  }

  async function analyzeSample(sampleId: string, mode: "demo" | "live") {
    setFile(null);
    setSelectedSampleId(sampleId);
    const formData = new FormData();
    formData.append("sampleId", sampleId);
    await runScanRequest(formData, mode);
  }

  async function pollLiveTask(pollingUrl: string) {
    for (let attempt = 1; attempt <= 8; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 1500 : 3000));
      const response = await fetch(pollingUrl);
      const data = (await response.json()) as AnalyzeResponse;

      if (data.analysis) {
        return {
          ok: true,
          analysis: data.analysis,
          message: "Skin scan completed and was converted into Skinova guidance."
        };
      }

      if (data.status === "success") {
        return {
          ok: true,
          analysis: data.analysis || null,
          message: "Skin scan completed."
        };
      }

      if (!response.ok || data.status === "error" || data.error) {
        return {
          ok: false,
          analysis: null,
          message: data.error || "The scan could not be completed. Review the photo requirements and try again."
        };
      }

      setMessage(`Skin scan is ${data.status || "running"}... checking results ${attempt}/8.`);
    }

    return {
      ok: false,
      analysis: null,
      message: "The scan is still processing. Try again in a moment."
    };
  }

  return (
    <div className="section-grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <Panel>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Selfie scan</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Upload your own photo or use a verified demo sample to run the full Skinova flow.
            </p>
          </div>
          <StatusBadge tone={status === "done" ? "mint" : status === "error" ? "rose" : "cyan"}>
            {status === "running" ? "Running" : status === "done" ? (scanMode === "demo" ? "Demo complete" : "Complete") : status === "error" ? "Needs attention" : "Ready"}
          </StatusBadge>
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] p-5">
          <h3 className="text-sm font-semibold text-cyan-100">{skinScanRequirements.title}</h3>
          <p className="mt-2 text-xs leading-6 text-slate-300">{skinScanRequirements.summary}</p>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-300">
            {skinScanRequirements.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <label className="mt-8 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/[0.04] px-6 py-10 text-center transition hover:bg-cyan-300/[0.08]">
          <UploadCloud className="h-9 w-9 text-cyan-200" aria-hidden="true" />
          <span className="mt-4 text-sm font-medium text-white">{file ? file.name : "Choose your own selfie"}</span>
          <span className="mt-2 text-xs leading-5 text-slate-400">JPG or PNG. Face centered, well lit, high resolution.</span>
          <input
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setSelectedSampleId(null);
            }}
          />
        </label>

        <div className="mt-8">
          <button
            type="button"
            onClick={analyzeSelectedFile}
            disabled={status === "running"}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === "running" && !selectedSampleId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Analyze selected photo
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-violet-200" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-white">Try one of these</h3>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Demo-safe samples help judges and testers complete a successful scan without getting stuck on photo quality issues.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {scanSamples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                disabled={status === "running"}
                onClick={() => analyzeSample(sample.id, sample.mode)}
                className={[
                  "rounded-2xl border p-3 text-left transition",
                  selectedSampleId === sample.id
                    ? "border-cyan-300/40 bg-cyan-300/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                ].join(" ")}
              >
                {sample.previewPath ? (
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-xl border border-white/10">
                    <Image src={sample.previewPath} alt={sample.label} fill className="object-cover" sizes="160px" />
                  </div>
                ) : (
                  <div className="mb-3 flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xs text-slate-400">
                    Guided demo
                  </div>
                )}
                <StatusBadge tone={sample.mode === "live" ? "mint" : "cyan"}>{sample.badge}</StatusBadge>
                <p className="mt-3 text-sm font-semibold text-white">{sample.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{sample.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm leading-6 text-slate-300">{message}</p>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-slate-300">
          {["Front-facing selfie", "Even lighting", "Educational guidance only", "Demo samples available"].map((item) => (
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
            <a
              href="/results"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open full results
            </a>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-sm leading-6 text-slate-400">
              Upload a selfie or choose a demo sample to show skin scores, plain-language insights, and routine guidance.
            </p>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-violet-300/20 bg-violet-300/[0.05] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-100">Coach sample prompts</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {coachSamplePrompts.map((prompt) => (
              <a
                key={prompt}
                href={`/coach?prompt=${encodeURIComponent(prompt)}`}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/[0.08]"
              >
                {prompt}
              </a>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
