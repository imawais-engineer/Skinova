"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Bot, Camera, ShieldCheck } from "lucide-react";

type HealthResponse = {
  status: string;
  mode: "demo" | "live";
  scanReady: boolean;
  simulationReady?: boolean;
  personalizationReady?: boolean;
  coachReady: boolean;
  databaseReady?: boolean;
  youCamApiCount?: number;
  message: string;
};

export function LandingLiveStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch("/api/skinova/health")
      .then((response) => response.json())
      .then((data: HealthResponse) => setHealth(data))
      .catch(() => null);
  }, []);

  const isLive = health?.mode === "live";
  const isOnline = health?.status === "online";

  return (
    <section id="live" className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
                {isOnline ? "Skinova is live" : "Checking availability"}
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                {isOnline
                  ? isLive
                    ? "Live scan and guidance are online."
                    : "Skinova is online in demo mode."
                  : "Skinova is starting up."}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                {health?.message ||
                  "Skinova connects YouCam Skin AI, personalized routines, progress tracking, and an educational Skin Coach in one consumer experience."}
              </p>
              {health ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                    {health.scanReady ? (isLive ? "Live skin scan" : "Demo skin scan") : "Scan unavailable"}
                  </span>
                  <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-medium text-violet-100">
                    {health.personalizationReady
                      ? `${health.youCamApiCount || 5} YouCam APIs`
                      : "Personalization checking"}
                  </span>
                  <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-xs font-medium text-fuchsia-100">
                    {health.simulationReady ? (isLive ? "Live simulation" : "Demo simulation") : "Simulation checking"}
                  </span>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
                    {health.databaseReady ? "Neon persistence" : "Database checking"}
                  </span>
                  <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-medium text-violet-100">
                    {health.coachReady ? "Live Skin Coach" : "Guided Skin Coach"}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-lg">
              <StatusTile
                icon={Camera}
                label="Skin Scan"
                value={health?.scanReady ? (isLive ? "Live" : "Demo") : "Checking"}
                detail="YouCam Skin AI analysis"
              />
              <StatusTile
                icon={Bot}
                label="Skin Coach"
                value={health?.coachReady ? "Live" : "Guided"}
                detail="Educational Q&A"
              />
              <StatusTile icon={Activity} label="Application" value={isOnline ? "Online" : "Checking"} detail="Dashboard and flows" />
              <StatusTile icon={ShieldCheck} label="Privacy" value="Protected" detail="API keys stay server-side" />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusTile({
  icon: Icon,
  label,
  value,
  detail
}: {
  icon: typeof Camera;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-1 text-lg font-semibold text-cyan-100">{value}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
        </div>
        <Icon className="h-5 w-5 shrink-0 text-cyan-200" aria-hidden="true" />
      </div>
    </div>
  );
}
