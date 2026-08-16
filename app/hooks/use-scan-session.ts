"use client";

import { useCallback, useEffect, useState } from "react";
import { getScanSession, saveScanSession, type ScanSession } from "../lib/scan-session";

type LatestScanResponse = {
  scan?: {
    id: string;
    analysis: ScanSession["analysis"];
    mode: "demo" | "live";
    scannedAt: string;
    fileId?: string | null;
  } | null;
};

export function useScanSession() {
  const [session, setSession] = useState<ScanSession | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const local = getScanSession();

    if (local) {
      setSession(local);
      setReady(true);
      return;
    }

    try {
      const response = await fetch("/api/skinova/scans?latest=1");
      if (response.ok) {
        const data = (await response.json()) as LatestScanResponse;
        if (data.scan) {
          const hydrated: ScanSession = {
            analysis: data.scan.analysis,
            mode: data.scan.mode,
            scannedAt: data.scan.scannedAt,
            scanId: data.scan.id,
            fileId: data.scan.fileId || null
          };
          saveScanSession(hydrated);
          setSession(hydrated);
          setReady(true);
          return;
        }
      }
    } catch {
      // Fall back to empty session.
    }

    setSession(null);
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();

    const onUpdate = () => {
      void refresh();
    };

    window.addEventListener("skinova:session-updated", onUpdate);
    return () => window.removeEventListener("skinova:session-updated", onUpdate);
  }, [refresh]);

  return { session, ready, refresh };
}
