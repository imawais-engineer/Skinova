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
      <aside className="glass-panel sticky top-0 z-20 border-x-0 border-t-0 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:overflow-hidden lg:border-y-0 lg:border-l-0">
        <div className="shrink-0 px-5 py-4 lg:px-6 lg:py-5">
          <Link href="/dashboard" className="flex min-w-0 items-center">
            <SkinovaLogo size="sm" subtitle="YouCam Skin AI companion" />
          </Link>
          <div
            className={[
              "mt-4 hidden rounded-full border px-3 py-1 text-xs font-medium lg:inline-flex",
              appMode === "live"
                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                : "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
            ].join(" ")}
          >
            {appMode === "live" ? "Live mode" : "Demo mode"}
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:min-h-0 lg:flex-1 lg:flex-col lg:space-y-1.5 lg:overflow-y-auto lg:px-4 lg:pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={[
                  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  isActive
                    ? "bg-cyan-400/14 text-cyan-100 ring-1 ring-cyan-300/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 px-6 py-4 lg:block">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="mt-1 truncate text-xs text-slate-400">{user.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06] disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {loggingOut ? "Signing out..." : "Log out"}
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
