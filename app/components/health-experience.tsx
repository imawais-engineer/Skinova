"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, HeartPulse, Lock, ShieldCheck } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "./ui";

type HealthResponse = {
  status: string;
  mode: "demo" | "live";
  scanReady: boolean;
  hasApiKey: boolean;
  demoMode: boolean;
  message: string;
};

export function HealthExperience() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/skinova/health")
      .then((response) => response.json())
      .then((data: HealthResponse) => setHealth(data))
      .catch(() => setError(true));
  }, []);

  const mode = health?.mode || "demo";
  const isHealthy = health?.status === "online" && !error;

  const healthItems = [
    {
      label: "Application",
      value: isHealthy ? "Online" : "Checking",
      detail: "Dashboard and care journey are available.",
      icon: Activity
    },
    {
      label: "Skin scan",
      value: health?.scanReady ? (mode === "live" ? "Live" : "Demo") : "Unavailable",
      detail: health?.message || "Checking scan readiness.",
      icon: HeartPulse
    },
    {
      label: "Guidance",
      value: "Ready",
      detail: "Routine, coach, and education views are available.",
      icon: CheckCircle2
    },
    {
      label: "Privacy boundary",
      value: health?.hasApiKey ? "Protected" : "Demo only",
      detail: "API credentials stay server-side. Demo mode never calls YouCam.",
      icon: Lock
    }
  ];

  return (
    <div>
      <PageHeader
        eyebrow="App health"
        title={isHealthy ? "Skinova is online and ready for testing." : "Checking Skinova readiness..."}
        description="Service readiness for the public Skinova experience."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Panel className="gradient-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <StatusBadge tone={isHealthy ? "mint" : "cyan"}>{isHealthy ? "Healthy" : "Loading"}</StatusBadge>
              <h2 className="mt-5 text-3xl font-semibold text-white">
                {mode === "live" ? "Live scan mode" : "Demo scan mode"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {health?.message ||
                  "Skinova checks scan readiness, guidance flows, and privacy boundaries before judges run the demo."}
              </p>
              {health ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  <StatusBadge tone={mode === "live" ? "mint" : "cyan"}>
                    {mode === "live" ? "YouCam live" : "Demo fallback"}
                  </StatusBadge>
                  <StatusBadge tone={health.hasApiKey ? "mint" : "violet"}>
                    {health.hasApiKey ? "API key configured" : "No API key"}
                  </StatusBadge>
                  <StatusBadge tone={health.demoMode ? "cyan" : "mint"}>
                    {health.demoMode ? "SKINOVA_DEMO_MODE=true" : "SKINOVA_DEMO_MODE=false"}
                  </StatusBadge>
                </div>
              ) : null}
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-300/12 text-emerald-100 ring-1 ring-emerald-300/20">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2">
          {healthItems.map((item) => {
            const Icon = item.icon;
            return (
              <Panel key={item.label}>
                <div className="flex items-start justify-between gap-4">
                  <Icon className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                  <StatusBadge tone={item.value === "Unavailable" ? "rose" : "mint"}>{item.value}</StatusBadge>
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{item.detail}</p>
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
