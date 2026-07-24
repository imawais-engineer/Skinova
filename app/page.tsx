import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { apiHighlights, dashboardMetrics, demoTimeline, progressEntries } from "./lib/skinova-data";
import { MetricCard, PageHeader, Panel, StatusBadge } from "./components/ui";

export default function DashboardPage() {
  const latest = progressEntries[progressEntries.length - 1];

  return (
    <div>
      <PageHeader
        eyebrow="YouCam Skin AI Hackathon"
        title="Skinova turns skin analysis into a guided skincare journey."
        description="A complete dashboard-first consumer experience: upload a selfie, run a YouCam-style analysis, understand the results, generate a routine, and track progress over time."
        action={{ href: "/scan", label: "Start scan" }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <Panel className="gradient-border">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <StatusBadge tone="mint">Minimum winning demo</StatusBadge>
              <h2 className="mt-4 text-2xl font-semibold text-white">Selfie to action plan in under three minutes</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Skinova avoids being a single API wrapper by turning YouCam Skin AI results into explanations, routines, progress trends, and an improvement simulation story.
              </p>
            </div>
            <Link
              href="/results"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View results
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-4">
            {demoTimeline.map((step, index) => (
              <div key={step.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/12 text-sm font-semibold text-cyan-100">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm font-semibold text-white">{step.label}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{step.value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Latest progress score</p>
              <p className="mt-2 text-5xl font-semibold text-white">{latest.overall}%</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-300/12 text-emerald-100 ring-1 ring-emerald-300/20">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {["Personalized routine generated", "API key handled server-side", "Mock fallback ready", "Demo video path defined"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-4">
        {apiHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <Panel key={item.label}>
              <Icon className="h-5 w-5 text-cyan-200" aria-hidden="true" />
              <p className="mt-4 text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.value}</p>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
