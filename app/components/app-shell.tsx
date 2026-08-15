"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bot,
  Camera,
  ClipboardList,
  HeartPulse,
  Home,
  LineChart,
  LogOut
} from "lucide-react";
import type { AppMode } from "../lib/app-mode";
import type { SessionUser } from "../lib/session";
import { SkinovaLogo } from "./skinova-logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/scan", label: "Skin Scan", icon: Camera },
  { href: "/results", label: "Results", icon: BarChart3 },
  { href: "/routine", label: "Routine", icon: ClipboardList },
  { href: "/coach", label: "Skin Coach", icon: Bot },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/health", label: "Health", icon: HeartPulse }
];

export function AppShell({
  children,
  user,
  appMode
}: {
  children: React.ReactNode;
  user: SessionUser;
  appMode: AppMode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen lg:flex">
      <aside className="glass-panel sticky top-0 z-20 border-x-0 border-t-0 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:overflow-hidden lg:border-y-0 lg:border-l-0">
        <div className="relative z-10 shrink-0 border-b border-white/10 px-4 pb-4 pt-3 lg:px-4 lg:pt-3.5">
          <div className="flex items-center justify-between gap-2">
            <Link href="/dashboard" className="min-w-0">
              <SkinovaLogo size="xs" />
            </Link>
            <span
              className={[
                "hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium lg:inline-flex",
                appMode === "live"
                  ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                  : "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
              ].join(" ")}
            >
              {appMode === "live" ? "Live" : "Demo"}
            </span>
          </div>
        </div>

        <nav className="relative z-0 mt-3 flex gap-2 overflow-x-auto px-3 pb-3 lg:mt-0 lg:flex-1 lg:flex-col lg:gap-0 lg:space-y-1 lg:overflow-hidden lg:px-3 lg:pb-2 lg:pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={[
                  "flex shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] leading-none transition",
                  isActive
                    ? "bg-cyan-400/14 text-cyan-100 ring-1 ring-cyan-300/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                ].join(" ")}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 border-t border-white/10 px-3 py-3 lg:block">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="truncate text-xs font-medium text-white">{user.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-slate-400">{user.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-200 transition hover:bg-white/[0.06] disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              {loggingOut ? "Signing out..." : "Log out"}
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:ml-64 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
