"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildScanHistoryEntries,
  type ScanHistoryEntry
} from "../lib/scan-session";
import type { AnalysisResult } from "../lib/skinova-data";

type ScanListItem = {
  id: string;
  analysis: AnalysisResult;
  mode: "demo" | "live";
  overallScore: number;
  scannedAt: string;
  fileId?: string | null;
};

export function useScanHistory(enabled: boolean) {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setHistory([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function loadHistory() {
      try {
        const response = await fetch("/api/skinova/scans");
        if (!response.ok || cancelled) {
          return;
        }

        const data = (await response.json()) as { scans?: ScanListItem[] };
        if (!data.scans?.length || cancelled) {
          setHistory([]);
          return;
        }

        setHistory(
          buildScanHistoryEntries(
            data.scans.map((scan) => ({
              id: scan.id,
              scannedAt: scan.scannedAt,
              mode: scan.mode,
              analysis: scan.analysis
            }))
          )
        );
      } catch {
        if (!cancelled) {
          setHistory([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadHistory();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const trend = useMemo(() => {
    if (history.length < 1) {
      return null;
    }

    const latest = history[0];
    const previous = history[1] || null;
    const delta = previous ? latest.overall - previous.overall : 0;

    return {
      scanCount: history.length,
      latest,
      previous,
      delta,
      direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat"
    } as const;
  }, [history]);

  return { history, trend, loading };
}
