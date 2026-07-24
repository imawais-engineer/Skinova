"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bot,
  Camera,
  ClipboardList,
  Home,
  LineChart,
  Settings,
  Sparkles
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/scan", label: "Skin Scan", icon: Camera },
  { href: "/results", label: "Results", icon: BarChart3 },
  { href: "/routine", label: "Routine", icon: ClipboardList },
  { href: "/coach", label: "Skin Coach", icon: Bot },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:flex">
      <aside className="glass-panel sticky top-0 z-20 border-x-0 border-t-0 lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-y-0 lg:border-l-0">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-7">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/25">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-semibold tracking-normal text-white">Skinova</span>
              <span className="block truncate text-xs text-slate-400">YouCam Skin AI companion</span>
            </span>
          </Link>
          <div className="hidden rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 lg:mt-6 lg:inline-flex">
            Demo-ready
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-2 lg:overflow-visible lg:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  isActive
                    ? "bg-cyan-400/14 text-cyan-100 ring-1 ring-cyan-300/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                ].join(" ")}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden px-6 py-6 lg:block">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Activity className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              Judging Focus
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Complete consumer workflow: scan, explain, guide, track, and simulate improvement.
            </p>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
