"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, RefreshCw, UploadCloud } from "lucide-react";
import { scanSamples, skinScanRequirements } from "../lib/demo-samples";
import { validateImageFile } from "../lib/image-validation";
import type { AnalysisResult } from "../lib/skinova-data";
import { saveScanSession } from "../lib/scan-session";
import { Panel, ScoreBar, StatusBadge } from "./ui";

type AnalyzeResponse = {
  status?: string;
  mode?: "demo" | "live";
  analysis?: AnalysisResult;
  error?: string;
  pollingUrl?: string | null;
  message?: string;
};

type ScanPhase = "pick" | "scanning" | "result" | "error";

export function ScanExperience() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [phase, setPhase] = useState<ScanPhase>("pick");
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [scanMode, setScanMode] = useState<"demo" | "live" | null>(null);
  const [pollStep, setPollStep] = useState(0);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const showSamples = phase === "pick" && !file && !selectedSampleId;

  const statusLabel = useMemo(() => {
    if (phase === "scanning") return "Analyzing";
    if (phase === "result") return scanMode === "demo" ? "Demo complete" : "Complete";
    if (phase === "error") return "Needs attention";
    return file || selectedSampleId ? "Ready to scan" : "Upload a selfie";
  }, [file, phase, scanMode, selectedSampleId]);

  function persistScanResult(result: AnalysisResult, mode: "demo" | "live") {
    saveScanSession({
      analysis: result,
      mode,
      scannedAt: new Date().toISOString()
    });
    setScanMode(mode);
  }

  function resetScan() {
    setFile(null);
    setSelectedSampleId(null);
    setAnalysis(null);
    setScanMode(null);
    setMessage("");
    setPollStep(0);
    setPhase("pick");
  }

  async function pollLiveTask(pollingUrl: string) {
    const maxAttempts = 20;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      setPollStep(attempt);
      const delay = attempt === 1 ? 1200 : attempt <= 4 ? 1800 : 2500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const response = await fetch(pollingUrl);
      const data = (await response.json()) as AnalyzeResponse;

      if (data.analysis) {
        return {
          ok: true,
          analysis: data.analysis,
          message: "Live skin analysis complete. Results are saved to your session."
        };
      }

      if (data.status === "success" && data.analysis) {
        return {
          ok: true,
          analysis: data.analysis,
          message: "Skin scan completed."
        };
      }

      if (!response.ok || data.status === "error" || data.error) {
        return {
          ok: false,
          analysis: null,
          message: data.error || "The scan could not be completed."
        };
      }

      setMessage(`YouCam is analyzing your photo… (${attempt}/${maxAttempts})`);
    }

    return {
      ok: false,
      analysis: null,
      message: "The scan is taking longer than expected. Please try again in a moment."
    };
  }

  async function runScanRequest(formData: FormData, modeHint?: "demo" | "live") {
    setPhase("scanning");
    setPollStep(0);
    setMessage("Uploading photo securely…");
    setAnalysis(null);

    try {
      const response = await fetch("/api/skinova/scan", {
        method: "POST",
        body: formData
      });
      const data = (await response.json()) as AnalyzeResponse;

      if (!response.ok || data.error) {
        setPhase("error");
        setMessage(data.error || "The scan could not be completed.");
        return;
      }

      if (data.pollingUrl) {
        setMessage(data.message || "Running live skin analysis…");
        const finalResult = await pollLiveTask(data.pollingUrl);
        const nextAnalysis = finalResult.analysis || data.analysis || null;

        if (nextAnalysis && finalResult.ok) {
          persistScanResult(nextAnalysis, modeHint || data.mode || "live");
          setAnalysis(nextAnalysis);
          setMessage(finalResult.message);
          setPhase("result");
          return;
        }

        setAnalysis(null);
        setMessage(finalResult.message);
        setPhase("error");
        return;
      }

      if (data.analysis) {
        persistScanResult(data.analysis, data.mode || "demo");
        setAnalysis(data.analysis);
        setMessage(data.message || "Skin scan completed.");
        setPhase("result");
        return;
      }

      setPhase("error");
      setMessage("No analysis was returned. Please try again.");
    } catch {
      setPhase("error");
      setMessage("Network error while running the scan. Check your connection and try again.");
    }
  }

  async function analyzeSelectedFile() {
    if (!file) {
      setPhase("error");
      setMessage("Choose a selfie first, or pick one of the verified sample faces below.");
      return;
    }

    const validation = await validateImageFile(file);
    if (!validation.ok) {
      setPhase("error");
      setMessage(validation.message);
      return;
    }

    setSelectedSampleId(null);
    const formData = new FormData();
    formData.append("file", file);
    await runScanRequest(formData, "live");
  }

  async function analyzeSample(sampleId: string) {
    setFile(null);
    setSelectedSampleId(sampleId);
    const formData = new FormData();
    formData.append("sampleId", sampleId);
    await runScanRequest(formData, "live");
  }

  async function onFileChange(nextFile: File | null) {
    setSelectedSampleId(null);
    setAnalysis(null);
    setPhase("pick");
    setMessage("");

    if (!nextFile) {
      setFile(null);
      return;
    }

    const validation = await validateImageFile(nextFile);
    if (!validation.ok) {
      setFile(null);
      setPhase("error");
      setMessage(validation.message);
      return;
    }

    setFile(nextFile);
  }

  return (
    <div className="flex flex-col gap-3">
      <Panel className="!p-3 sm:!p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs text-slate-400">Upload a selfie or pick a verified sample below.</p>
          <StatusBadge tone={phase === "result" ? "mint" : phase === "error" ? "rose" : phase === "scanning" ? "cyan" : "slate"}>
            {statusLabel}
          </StatusBadge>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <h2 className="text-sm font-semibold text-white">Upload your selfie</h2>
            <p className="mt-0.5 text-[11px] leading-5 text-slate-400">Live analysis syncs to Results, Routine, and Progress.</p>

            <label className="mt-3 flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-cyan-300/30 bg-cyan-300/[0.04] px-3 py-3 text-center transition hover:bg-cyan-300/[0.08]">
              {previewUrl ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-md border border-white/10">
                  <Image src={previewUrl} alt="Selected selfie preview" fill className="object-cover" unoptimized />
                </div>
              ) : (
                <>
                  <UploadCloud className="h-6 w-6 text-cyan-200" aria-hidden="true" />
                  <span className="mt-1.5 text-xs font-medium text-white">Choose a selfie</span>
                  <span className="text-[11px] text-slate-400">JPG or PNG</span>
                </>
              )}
              {file ? <span className="mt-1.5 max-w-full truncate text-[11px] text-slate-300">{file.name}</span> : null}
              <input
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg"
                disabled={phase === "scanning"}
                onChange={(event) => {
                  void onFileChange(event.target.files?.[0] || null);
                }}
              />
            </label>

            <div className="mt-2 flex flex-wrap gap-2">
              {file ? (
                <button
                  type="button"
                  onClick={() => void analyzeSelectedFile()}
                  disabled={phase === "scanning"}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-cyan-300 px-3 text-xs font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {phase === "scanning" ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : null}
                  Run live scan
                </button>
              ) : null}

              {(phase === "result" || phase === "error" || file || selectedSampleId) && phase !== "scanning" ? (
                <button
                  type="button"
                  onClick={resetScan}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Try another scan
                </button>
              ) : null}
            </div>

            {phase === "scanning" ? (
              <p className="mt-2 text-[11px] leading-5 text-cyan-100/90">
                {message}
                {pollStep > 0 ? ` (${pollStep})` : null}
              </p>
            ) : message ? (
              <p className={`mt-2 text-[11px] leading-5 ${phase === "error" ? "text-rose-100/90" : "text-slate-400"}`}>{message}</p>
            ) : null}
          </div>

          <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] p-3">
            <h2 className="text-sm font-semibold text-cyan-100">{skinScanRequirements.title}</h2>
            <p className="mt-0.5 text-[11px] leading-5 text-slate-300">{skinScanRequirements.summary}</p>
            <ul className="mt-2 grid grid-cols-1 gap-1.5 text-[11px] leading-5 text-slate-400 sm:grid-cols-2">
              {skinScanRequirements.items.map((item) => (
                <li key={item} className="flex gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-200" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {showSamples ? (
          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-xs font-semibold text-white">Verified sample faces</p>
            <p className="text-[11px] text-slate-400">Tap to run a live scan.</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {scanSamples.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => void analyzeSample(sample.id)}
                  className="flex flex-col items-center rounded-lg border border-white/10 bg-white/[0.03] p-2 text-center transition hover:bg-white/[0.05]"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border border-white/10">
                    <Image src={sample.previewPath} alt={sample.label} fill className="object-cover" sizes="48px" />
                  </div>
                  <p className="mt-1.5 w-full truncate text-[11px] font-semibold text-white">{sample.label}</p>
                  <p className="w-full truncate text-[10px] text-slate-400">{sample.trait}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {analysis && phase === "result" ? (
          <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Overall skin score</p>
                <p className="mt-1 text-3xl font-semibold text-white sm:text-4xl">{analysis.overallScore}%</p>
              </div>
              <StatusBadge tone="mint">{scanMode === "demo" ? "Demo" : "Live"} analysis</StatusBadge>
            </div>
            <p className="text-sm leading-6 text-slate-300">{analysis.summary}</p>
            <div className="space-y-3">
              {analysis.concerns.slice(0, 4).map((concern) => (
                <ScoreBar key={concern.type} label={concern.type} score={concern.score} detail={concern.explanation} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/results"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                View full results
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/routine"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Open routine
              </Link>
            </div>
          </div>
        ) : null}
      </Panel>
    </div>
  );
}
