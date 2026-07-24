import { Activity, Sparkles } from "lucide-react";
import { PageHeader, Panel, ScoreBar, StatusBadge } from "../components/ui";
import { analysisResult } from "../lib/skinova-data";

export default function ResultsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Analysis results"
        title="Plain-language insights from YouCam-style skin scores."
        description="Scores become actions: explanation, routine priorities, and progress markers a consumer can understand."
        action={{ href: "/routine", label: "View routine" }}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Panel className="gradient-border">
          <StatusBadge tone="mint">Overall score</StatusBadge>
          <p className="mt-6 text-6xl font-semibold text-white">{analysisResult.overallScore}%</p>
          <p className="mt-4 text-sm leading-6 text-slate-300">{analysisResult.summary}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-slate-400">Skin type</p>
              <p className="mt-2 text-sm font-semibold text-white">{analysisResult.skinType}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-slate-400">Tone context</p>
              <p className="mt-2 text-sm font-semibold text-white">{analysisResult.tone}</p>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-cyan-200" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-white">Concern breakdown</h2>
          </div>
          <div className="mt-6 space-y-5">
            {analysisResult.concerns.map((concern) => (
              <ScoreBar key={concern.type} label={concern.type} score={concern.score} detail={concern.explanation} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-5">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-violet-200" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">YouCam workflow explanation</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {analysisResult.workflow.map((step) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
              {step}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
