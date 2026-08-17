"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Activity, ArrowRight, Layers, Palette, Sparkles } from "lucide-react";
import { useScanSession } from "../hooks/use-scan-session";
import { getOriginalScanImageUrl } from "../lib/scan-session";
import { EmptyScanState } from "./empty-scan-state";
import { SkinSimulationPanel } from "./skin-simulation-panel";
import { PageHeader, Panel, ScoreBar, StatusBadge } from "./ui";

export function ResultsExperience() {
  const { session, ready } = useScanSession();
  const result = session?.analysis;
  const [activeMask, setActiveMask] = useState<string | null>(null);

  const concernsWithMasks = useMemo(
    () => result?.concerns.filter((concern) => concern.maskUrls?.length) ?? [],
    [result?.concerns]
  );

  const selectedMaskConcern = useMemo(() => {
    if (!result || !activeMask) {
      return concernsWithMasks[0] || null;
    }

    return result.concerns.find((concern) => concern.type === activeMask) || concernsWithMasks[0] || null;
  }, [activeMask, concernsWithMasks, result]);

  const personalization = result?.personalization;
  const originalScanUrl = session ? getOriginalScanImageUrl(session) : null;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Analysis results"
        title="Plain-language insights from skin scores."
        description="YouCam Skin Analysis scores, Fitzpatrick typing, skin tone context, and concern masks — turned into actions you can understand."
        action={{ href: "/routine", label: "View routine" }}
      />

      {ready && !session ? (
        <EmptyScanState message="No analysis yet. Run a scan from the Skin Scan page or load demo sample data to preview how Skinova explains concern scores." />
      ) : null}

      {session && result ? (
        <div className="flex flex-col gap-8">
          <Panel className="border-emerald-300/20 bg-emerald-300/[0.05]">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="mint">{session.mode === "demo" ? "Demo scan" : "Live scan"}</StatusBadge>
              {personalization?.fitzpatrickLabel ? (
                <StatusBadge tone="violet">{personalization.fitzpatrickLabel}</StatusBadge>
              ) : null}
              {personalization?.skinColorHex ? (
                <StatusBadge tone="cyan">Skin tone detected</StatusBadge>
              ) : null}
              <p className="text-sm text-emerald-50/90">
                Latest scan from {new Date(session.scannedAt).toLocaleString()}.
              </p>
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <Panel className="gradient-border">
              <StatusBadge tone="mint">Overall score</StatusBadge>
              <p className="mt-5 text-4xl font-semibold text-white sm:text-5xl">{result.overallScore}%</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">{result.summary}</p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">Skin type</p>
                  <p className="mt-2 text-sm font-semibold text-white">{result.skinType}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">Tone context</p>
                  <p className="mt-2 text-sm font-semibold text-white">{result.tone}</p>
                </div>
              </div>
              <Link
                href="/routine"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Generate routine
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Panel>

            <Panel>
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white">Concern breakdown</h2>
              </div>
              <div className="mt-6 space-y-5">
                {result.concerns.map((concern) => (
                  <ScoreBar key={concern.type} label={concern.type} score={concern.score} detail={concern.explanation} />
                ))}
              </div>
            </Panel>
          </div>

          {personalization ? (
            <Panel>
              <div className="flex flex-wrap items-center gap-3">
                <Palette className="h-5 w-5 text-violet-200" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white">YouCam personalization</h2>
                <StatusBadge tone={personalization.source === "live" ? "mint" : "cyan"}>
                  {personalization.source === "live" ? "Live APIs" : "Demo context"}
                </StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Fitzpatrick, skin tone, and face attribute APIs add inclusive personalization context beyond concern scores.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {personalization.fitzpatrickLabel ? (
                  <PersonalizationTile label="Fitzpatrick scale" value={personalization.fitzpatrickLabel} />
                ) : null}
                {personalization.skinColorHex ? (
                  <PersonalizationTile
                    label="Skin color"
                    value={personalization.skinColorHex}
                    swatch={personalization.skinColorHex}
                  />
                ) : null}
                {personalization.eyeColorName ? (
                  <PersonalizationTile label="Eye color" value={personalization.eyeColorName} />
                ) : null}
                {personalization.hairColorName ? (
                  <PersonalizationTile label="Hair color" value={personalization.hairColorName} />
                ) : null}
                {personalization.faceShape ? (
                  <PersonalizationTile label="Face shape" value={personalization.faceShape} />
                ) : null}
                {personalization.estimatedAge !== undefined ? (
                  <PersonalizationTile label="Estimated age" value={`${personalization.estimatedAge} years`} />
                ) : null}
                {personalization.eyeShape ? (
                  <PersonalizationTile label="Eye shape" value={personalization.eyeShape} />
                ) : null}
                {personalization.lipShape ? (
                  <PersonalizationTile label="Lip shape" value={personalization.lipShape} />
                ) : null}
              </div>
            </Panel>
          ) : null}

          {concernsWithMasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <Panel>
                <div className="flex flex-wrap items-center gap-3">
                  <Layers className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-white">Concern detection masks</h2>
                  <StatusBadge tone="mint">YouCam mask overlays</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Compare your original scan with mask images showing where each signal was detected.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {concernsWithMasks.map((concern) => (
                    <button
                      key={concern.type}
                      type="button"
                      onClick={() => setActiveMask(concern.type)}
                      className={[
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                        selectedMaskConcern?.type === concern.type
                          ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-50"
                          : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                      ].join(" ")}
                    >
                      {concern.type} · {concern.score}%
                    </button>
                  ))}
                </div>

                {selectedMaskConcern?.maskUrls?.[0] && originalScanUrl ? (
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <MaskCompareTile
                      title="Original scan"
                      badge="Source photo"
                      imageUrl={originalScanUrl}
                      imageAlt="Original scan photo"
                    />
                    <MaskCompareTile
                      title={`${selectedMaskConcern.type} mask`}
                      badge={`Score ${selectedMaskConcern.score}%`}
                      imageUrl={selectedMaskConcern.maskUrls[0]}
                      imageAlt={`${selectedMaskConcern.type} detection mask`}
                      highlight
                    />
                  </div>
                ) : null}
              </Panel>

              {session ? <SkinSimulationPanel session={session} compact /> : null}
            </div>
          ) : session ? (
            <SkinSimulationPanel session={session} />
          ) : null}

          <Panel>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-violet-200" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-white">How Skinova reads your scan</h2>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {result.readingSteps.map((step) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                  {step}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}

function MaskCompareTile({
  title,
  badge,
  imageUrl,
  imageAlt,
  highlight = false
}: {
  title: string;
  badge: string;
  imageUrl: string;
  imageAlt: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border",
        highlight ? "border-cyan-300/25 bg-cyan-300/[0.04]" : "border-white/10 bg-black/20"
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-1.5">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-slate-400">{badge}</p>
      </div>
      <div className="relative aspect-[3/4] max-h-[200px] w-full">
        <Image src={imageUrl} alt={imageAlt} fill className="object-contain bg-slate-950" unoptimized />
      </div>
    </div>
  );
}

function PersonalizationTile({
  label,
  value,
  swatch
}: {
  label: string;
  value: string;
  swatch?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        {swatch ? (
          <span
            className="h-6 w-6 shrink-0 rounded-full border border-white/20"
            style={{ backgroundColor: swatch }}
            aria-hidden="true"
          />
        ) : null}
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
