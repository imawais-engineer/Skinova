import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-cyan-200">{eyebrow}</p>
        <h1 className="mt-2 max-w-4xl text-3xl font-semibold tracking-normal text-white md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">{description}</p>
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-cyan-200"
        >
          {action.label}
        </Link>
      ) : null}
    </header>
  );
}

export function Panel({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`glass-panel rounded-2xl p-5 ${className}`}>{children}</section>;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "cyan"
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: "cyan" | "mint" | "rose" | "violet";
}) {
  const toneClass = {
    cyan: "bg-cyan-400/12 text-cyan-200 ring-cyan-300/20",
    mint: "bg-emerald-400/12 text-emerald-200 ring-emerald-300/20",
    rose: "bg-rose-400/12 text-rose-200 ring-rose-300/20",
    violet: "bg-violet-400/12 text-violet-200 ring-violet-300/20"
  }[tone];

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${toneClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-5 text-slate-400">{detail}</p>
    </div>
  );
}

export function ScoreBar({
  label,
  score,
  detail
}: {
  label: string;
  score: number;
  detail: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm text-cyan-200">{score}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-violet-300"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p>
    </div>
  );
}

export function StatusBadge({
  children,
  tone = "cyan"
}: {
  children: React.ReactNode;
  tone?: "cyan" | "mint" | "rose" | "violet" | "slate";
}) {
  const toneClass = {
    cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
    mint: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
    rose: "border-rose-300/25 bg-rose-300/10 text-rose-100",
    violet: "border-violet-300/25 bg-violet-300/10 text-violet-100",
    slate: "border-slate-300/20 bg-slate-300/10 text-slate-200"
  }[tone];

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${toneClass}`}>{children}</span>;
}
