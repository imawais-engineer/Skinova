"use client";

import { Sparkles } from "lucide-react";
import { demoSessionAnalysis } from "../lib/demo-samples";
import { saveScanSession } from "../lib/scan-session";

export function LoadDemoSampleButton({ label = "Load demo sample data" }: { label?: string }) {
  function loadDemoSample() {
    saveScanSession({
      analysis: demoSessionAnalysis,
      mode: "demo",
      scannedAt: new Date().toISOString()
    });
    window.dispatchEvent(new Event("skinova:session-updated"));
  }

  return (
    <button
      type="button"
      onClick={loadDemoSample}
      className="inline-flex items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/10 px-4 py-2 text-sm font-medium text-violet-50 transition hover:bg-violet-300/15"
    >
      <Sparkles className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}
