"use client";

import { useEffect, useState } from "react";
import { getScanSession, type ScanSession } from "../lib/scan-session";

export function useScanSession() {
  const [session, setSession] = useState<ScanSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setSession(getScanSession());
      setReady(true);
    };

    refresh();
    window.addEventListener("skinova:session-updated", refresh);
    return () => window.removeEventListener("skinova:session-updated", refresh);
  }, []);

  return { session, ready };
}
