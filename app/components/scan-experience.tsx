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
    <div className="flex flex-col gap-4">
      <Panel className="!p-4 sm:!p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white sm:text-xl">Upload your selfie</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Live YouCam Skin AI analysis runs on the photo you choose. Results sync to Results, Routine, and Progress.
            </p>
          </div>
          <StatusBadge tone={phase === "result" ? "mint" : phase === "error" ? "rose" : phase === "scanning" ? "cyan" : "slate"}>
            {statusLabel}
          </StatusBadge>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/[0.04] px-4 py-5 text-center transition hover:bg-cyan-300/[0.08]">
            {previewUrl ? (
              <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-white/10">
                <Image src={previewUrl} alt="Selected selfie preview" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-cyan-200" aria-hidden="true" />
                <span className="mt-3 text-sm font-medium text-white">Choose a front-facing selfie</span>
                <span className="mt-1 text-xs leading-5 text-slate-400">JPG or PNG · face centered · well lit</span>
              </>
            )}
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

          <div className="flex flex-col gap-2">
            {file ? (
              <button
                type="button"
                onClick={() => void analyzeSelectedFile()}
                disabled={phase === "scanning"}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {phase === "scanning" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                Run live scan
              </button>
            ) : null}

            {(phase === "result" || phase === "error" || file || selectedSampleId) && phase !== "scanning" ? (
              <button
                type="button"
                onClick={resetScan}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try another scan
              </button>
            ) : null}

            {phase === "scanning" ? (
              <p className="text-xs leading-5 text-cyan-100/90">
                {message}
                {pollStep > 0 ? ` Step ${pollStep}.` : null}
              </p>
            ) : message ? (
              <p className={`text-xs leading-5 ${phase === "error" ? "text-rose-100/90" : "text-slate-400"}`}>{message}</p>
            ) : null}
          </div>
        </div>

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

      {showSamples ? (
        <Panel className="!p-4 sm:!p-5">
          <h3 className="text-sm font-semibold text-white">Or try a verified sample face</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Real selfies verified with YouCam — tap to run a live scan.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {scanSamples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => void analyzeSample(sample.id)}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-left transition hover:bg-white/[0.05]"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-white/10">
                  <Image src={sample.previewPath} alt={sample.label} fill className="object-cover" sizes="56px" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">{sample.label}</p>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-medium text-emerald-100">
                      {sample.trait}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-400">{sample.description}</p>
                </div>
              </button>
            ))}
          </div>
        </Panel>
      ) : null}

      <details className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-slate-200">{skinScanRequirements.title}</summary>
        <p className="mt-3 text-xs leading-6 text-slate-400">{skinScanRequirements.summary}</p>
        <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-400">
          {skinScanRequirements.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
