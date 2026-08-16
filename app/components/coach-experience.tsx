"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useScanSession } from "../hooks/use-scan-session";
import { Panel } from "./ui";
import { SkinovaLogo } from "./skinova-logo";

type CoachMessage = {
  id?: string;
  role: "user" | "coach" | "scan";
  content: string;
};

type CoachMode = "live" | "guided" | "checking";

const INTRO =
  "I interpret your YouCam face scan using Skinova's knowledge base. Ask about your concern scores, routine, or ingredients.";

export function CoachExperience({ initialPrompt }: { initialPrompt?: string }) {
  const { session } = useScanSession();
  const [coachMode, setCoachMode] = useState<CoachMode>("checking");
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState(initialPrompt || "");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const chatStarted = messages.some((message) => message.role === "user");

  const loadThread = useCallback(async () => {
    try {
      const response = await fetch("/api/skinova/coach");
      const data = (await response.json()) as {
        messages?: CoachMessage[];
        mode?: CoachMode;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to load coach history");
      }

      if (data.mode === "live" || data.mode === "guided") {
        setCoachMode(data.mode);
      }

      if (data.messages?.length) {
        setMessages(data.messages);
      } else {
        setMessages([{ role: "coach", content: INTRO }]);
      }
    } catch {
      setCoachMode("guided");
      setMessages([{ role: "coach", content: INTRO }]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    void loadThread();
  }, [loadThread]);

  useEffect(() => {
    const resetCoach = () => {
      setMessages([{ role: "coach", content: INTRO }]);
      setInput("");
    };
    window.addEventListener("skinova:coach-reset", resetCoach);
    return () => window.removeEventListener("skinova:coach-reset", resetCoach);
  }, []);

  async function sendMessage(messageOverride?: string) {
    const trimmed = (messageOverride ?? input).trim();
    if (!trimmed || loading) {
      return;
    }

    setInput("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: trimmed }]);

    try {
      const response = await fetch("/api/skinova/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          analysis: session?.analysis || null,
          scanMode: session?.mode,
          scannedAt: session?.scannedAt
        })
      });
      const data = (await response.json()) as {
        answer?: string;
        safety?: string;
        mode?: "live" | "guided";
        error?: string;
      };

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "Coach unavailable");
      }

      if (data.mode) {
        setCoachMode(data.mode);
      }

      setMessages((current) => [...current, { role: "coach", content: data.answer! }]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "coach", content: "Skin Coach is unavailable. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <Panel className="flex min-h-[20rem] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-200" aria-hidden="true" />
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="flex items-start gap-3">
        <SkinovaLogo size="sm" showWordmark={false} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-white">Skin Coach</h2>
            {coachMode === "live" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-300/25">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Live AI
              </span>
            ) : (
              <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 ring-1 ring-white/10">
                Guided
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Face-scan interpretation only — grounded in YouCam results and Skinova knowledge.
          </p>
          {session ? (
            <p className="mt-2 text-xs text-emerald-200/90">Scan context: {session.analysis.overallScore}% overall.</p>
          ) : (
            <p className="mt-2 text-xs text-amber-100/80">
              <Link href="/scan" className="underline underline-offset-2">
                Run a scan
              </Link>{" "}
              for personalized answers.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={message.id || `${message.role}-${index}`}
            className={[
              "max-w-3xl rounded-2xl px-4 py-3 text-sm leading-6",
              message.role === "user"
                ? "ml-auto bg-cyan-300 text-slate-950"
                : message.role === "scan"
                  ? "border border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-50/90"
                  : "bg-white/[0.05] text-slate-200 ring-1 ring-white/10"
            ].join(" ")}
          >
            {message.role === "scan" ? <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-200/80">Scan · </span> : null}
            {message.content}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void sendMessage();
            }
          }}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
          placeholder="Ask about your scan results"
        />
        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="mr-2 h-4 w-4" aria-hidden="true" />}
          Send
        </button>
      </div>

      <p className="mt-3 text-center text-[11px] text-slate-500">Educational only · max 3 sentences per reply</p>
    </Panel>
  );
}
