"use client";

import { useEffect, useState } from "react";
import {
  getSimulationResult,
  routineScanKeyFromSession,
  saveSimulationResult,
  type ScanSession
} from "../lib/scan-session";

type SimulationResponse = {
  status?: string;
  resultUrl?: string;
  mode?: "demo" | "live";
  error?: string;
  pollingUrl?: string;
  message?: string;
};

type SavedSimulationResponse = {
  result?: {
    resultUrl: string;
    mode: "demo" | "live";
    updatedAt?: string;
  } | null;
};

async function pollSimulation(pollingUrl: string) {
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 1200 : 2000));
    const response = await fetch(pollingUrl);
    const data = (await response.json()) as SimulationResponse;

    if (data.resultUrl) {
      return { ok: true as const, resultUrl: data.resultUrl, mode: data.mode || "live" };
    }

    if (!response.ok || data.status === "error" || data.error) {
      return { ok: false as const, message: data.error || "Simulation could not be completed." };
    }
  }

  return { ok: false as const, message: "Simulation is taking longer than expected. Please try again." };
}

export function useSkinSimulation(session: ScanSession | null) {
  const [simulationUrl, setSimulationUrl] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState<"demo" | "live" | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [simulationMessage, setSimulationMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!session) {
      setSimulationUrl(null);
      setSimulationMode(null);
      setSimulationStatus("idle");
      setSimulationMessage("");
      setHydrated(true);
      return;
    }

    let cancelled = false;
    const scanKey = routineScanKeyFromSession(session);
    const cached = getSimulationResult(session);

    if (cached?.resultUrl) {
      setSimulationUrl(cached.resultUrl);
      setSimulationMode(cached.mode);
      setSimulationStatus("ready");
      setSimulationMessage("Saved simulation preview restored from your account.");
    }

    fetch(`/api/skinova/simulation?scanKey=${encodeURIComponent(scanKey)}`)
      .then(async (response) => {
        const data = (await response.json()) as SavedSimulationResponse;
        if (!response.ok || !data.result?.resultUrl || cancelled) {
          return;
        }

        saveSimulationResult(session, {
          resultUrl: data.result.resultUrl,
          mode: data.result.mode
        });
        setSimulationUrl(data.result.resultUrl);
        setSimulationMode(data.result.mode);
        setSimulationStatus("ready");
        setSimulationMessage("Saved simulation preview restored from your account.");
      })
      .catch(() => null)
      .finally(() => {
        if (!cancelled) {
          setHydrated(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  async function runSimulation() {
    if (!session) {
      return;
    }

    const scanKey = routineScanKeyFromSession(session);
    setSimulationStatus("loading");
    setSimulationMessage("Starting YouCam Skin Simulation…");
    setSimulationUrl(null);

    try {
      const response = await fetch("/api/skinova/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanId: session.scanId,
          fileId: session.fileId,
          scanKey
        })
      });
      const data = (await response.json()) as SimulationResponse;

      if (!response.ok || data.error) {
        setSimulationStatus("error");
        setSimulationMessage(data.error || "Simulation could not be started.");
        return;
      }

      if (data.pollingUrl) {
        setSimulationMessage(data.message || "Rendering improvement preview…");
        const result = await pollSimulation(data.pollingUrl);

        if (result.ok && result.resultUrl) {
          saveSimulationResult(session, {
            resultUrl: result.resultUrl,
            mode: result.mode || "live"
          });
          setSimulationUrl(result.resultUrl);
          setSimulationMode(result.mode || "live");
          setSimulationStatus("ready");
          setSimulationMessage("Simulation saved to your account until you clear scan data.");
          return;
        }

        setSimulationStatus("error");
        setSimulationMessage(result.message || "Simulation failed.");
        return;
      }

      setSimulationStatus("error");
      setSimulationMessage("No simulation task was returned.");
    } catch {
      setSimulationStatus("error");
      setSimulationMessage("Network error while running simulation.");
    }
  }

  return {
    simulationUrl,
    simulationMode,
    simulationStatus,
    simulationMessage,
    runSimulation,
    hydrated
  };
}
