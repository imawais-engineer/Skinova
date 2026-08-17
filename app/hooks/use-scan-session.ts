"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getScanSession,
  saveScanSession,
  toScanSessionFromApi,
  type ScanSession
} from "../lib/scan-session";

type LatestScanResponse = {
  scan?: {
    id: string;
    analysis: ScanSession["analysis"];
    mode: "demo" | "live";
    scannedAt: string;
    fileId?: string | null;
    previewImageUrl?: string | null;
    sampleId?: string | null;
  } | null;
};

async function syncLocalPreviewToServer(session: ScanSession) {
  if (!session.scanId || !session.previewImageUrl) {
    return;
  }

  try {
    await fetch("/api/skinova/scans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scanId: session.scanId,
        previewImageUrl: session.previewImageUrl,
        sampleId: session.sampleId || null
      })
    });
  } catch {
    // Ignore — local cache still works for this session.
  }
}

export function useScanSession() {
  const [session, setSession] = useState<ScanSession | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const local = getScanSession();

    try {
      const response = await fetch("/api/skinova/scans?latest=1");
      if (response.ok) {
        const data = (await response.json()) as LatestScanResponse;
        if (data.scan) {
          let hydrated = toScanSessionFromApi(data.scan);
          const localScanId = local?.scanId;
          const localPreview = local?.previewImageUrl;
          const localSampleId = local?.sampleId;

          if (localScanId === hydrated.scanId && localPreview && !hydrated.previewImageUrl) {
            hydrated = {
              ...hydrated,
              previewImageUrl: localPreview,
              sampleId: localSampleId ?? hydrated.sampleId
            };
            void syncLocalPreviewToServer(hydrated);
          }

          saveScanSession(hydrated);
          setSession(hydrated);
          setReady(true);
          return;
        }
      }
    } catch {
      // Fall back to browser cache below.
    }

    if (local) {
      setSession(local);
      setReady(true);
      return;
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
