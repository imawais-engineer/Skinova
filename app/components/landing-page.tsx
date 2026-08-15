"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  Camera,
  ClipboardList,
  LineChart,
  Menu,
  ShieldCheck,
  X
} from "lucide-react";
import { SkinovaLogo } from "./skinova-logo";
import { ScrollToTop } from "./scroll-to-top";

const navLinks = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" }
];

const capabilities = [
  {
    title: "Skin Scan",
    status: "Available",
    description: "AI-powered skin analysis using YouCam Skin AI.",
    icon: Camera
  },
  {
    title: "Skin Insights",
    status: "Available",
    description: "Understand analysis results in simple, educational language.",
    icon: BarChart3
  },
  {
    title: "Personalized Guidance",
    status: "Available",
    description: "Turn insights into practical morning and night skincare steps.",
    icon: ClipboardList
  },
  {
    title: "Skin Coach",
    status: "Available",
    description: "Ask skincare-related educational questions with safety boundaries.",
    icon: Bot
  },
  {
    title: "Progress",
    status: "Available",
    description: "Track changes and understand trends over time.",
    icon: LineChart
  }
];

const steps = [
  { number: "01", title: "Scan", description: "Take or upload a clear front-facing selfie." },
  { number: "02", title: "Understand", description: "YouCam Skin AI analyzes relevant skin characteristics." },
  { number: "03", title: "Learn", description: "Skinova translates technical analysis into understandable education." },
  { number: "04", title: "Improve", description: "Use guidance and progress tracking to make better routine decisions." }
];

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050812]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <SkinovaLogo size="sm" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-slate-300 transition hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/10 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3" aria-label="Mobile">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2 py-2 text-sm text-slate-300"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link href="/login" className="rounded-lg px-2 py-2 text-sm text-slate-300" onClick={() => setMenuOpen(false)}>
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      <main className="flex flex-col">
        <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:py-12 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start xl:gap-10 xl:px-8 xl:py-16">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">AI-Powered Skin Intelligence</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:text-5xl">
              Understand Your Skin.
              <span className="block text-cyan-200">Improve with Intelligence.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-6 text-slate-300">
              Skinova transforms a simple selfie into understandable skin insights and actionable skincare guidance. Built
              for consumers who want clarity, not confusion.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="glass-panel gradient-border min-w-0 rounded-3xl p-5 sm:p-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Product preview</p>
                  <p className="mt-2 text-lg font-semibold text-white sm:text-xl">Your skincare intelligence workspace</p>
                </div>
                <Activity className="h-5 w-5 shrink-0 text-cyan-200 sm:h-6 sm:w-6" aria-hidden="true" />
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {["Scan", "Insights", "Routine", "Progress"].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-[#0a1022]/80 px-4 py-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-400">
                A premium consumer experience built around YouCam Skin AI — not a one-time score, but a guided journey.
              </p>
            </div>
          </div>
        </section>

        <section id="product" className="border-y border-white/10 bg-white/[0.02] py-12 sm:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 xl:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl xl:text-4xl">Skincare data is everywhere. Clarity is not.</h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                Many people receive skin scores, product recommendations, or conflicting advice without knowing what it
                means or what to do next. Skinova is the layer that turns analysis into understandable guidance.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                "You do not always understand what your skin analysis means.",
                "You buy products without enough context.",
                "You struggle to know what to do next.",
                "You cannot easily tell whether your routine is helping.",
                "Skincare information feels overwhelming and contradictory."
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-12 sm:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 xl:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl xl:text-4xl">How Skinova works</h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                A clear path from selfie to better skincare decisions.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {steps.map((step) => (
                <div key={step.number} className="glass-panel rounded-2xl p-5">
                  <p className="text-sm font-semibold text-cyan-200">{step.number}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-8">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start">
              <div className="min-w-0">
                <h2 className="text-2xl font-semibold text-white sm:text-3xl xl:text-4xl">Powered by YouCam Skin AI</h2>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  Skinova is not an AI model. It is the consumer experience built around YouCam API skin analysis —
                  translating technical output into education, routines, and progress.
                </p>
              </div>
              <div className="min-w-0 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.04] p-5 font-mono text-sm leading-7 text-slate-200 sm:p-6">
                <p>Selfie</p>
                <p>↓ Secure upload workflow</p>
                <p>↓ YouCam Skin AI analysis</p>
                <p>↓ Skin insights</p>
                <p>↓ Skinova interpretation</p>
                <p>↓ Actionable guidance</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 sm:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 xl:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl xl:text-4xl">Product capabilities</h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                A complete skincare intelligence experience — not a single API wrapper.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {capabilities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="glass-panel rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <Icon className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="about" className="border-y border-white/10 bg-white/[0.02] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl xl:text-4xl">Analyze → Understand → Decide → Improve</h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                Skinova solves a real consumer problem: turning skin analysis into better understanding, clearer guidance,
                and continuous improvement over time.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-8">
            <div className="glass-panel rounded-3xl p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-200" aria-hidden="true" />
                <div>
                  <h2 className="text-2xl font-semibold text-white">Education, not diagnosis</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                    Skinova provides educational skincare information and AI-assisted analysis. It does not diagnose
                    medical conditions or replace professional medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 pt-4 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 xl:px-8">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl xl:text-4xl">Ready to understand your skin?</h2>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <SkinovaLogo size="sm" subtitle="YouCam Skin AI companion" />
            <p className="mt-4 text-xs text-slate-400">Built for the YouCam API Skin AI & Apparel VTO Hackathon.</p>
            <p className="mt-2 text-xs text-slate-500">© {new Date().getFullYear()} Skinova. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <a href="#product">Product</a>
            <a href="#how-it-works">How It Works</a>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
