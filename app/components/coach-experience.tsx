"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, Loader2, Send } from "lucide-react";
import { useScanSession } from "../hooks/use-scan-session";
import { Panel } from "./ui";

type CoachMessage = {
  id?: string;
  role: "user" | "coach" | "scan";
  content: string;
};

type CoachMode = "live" | "guided" | "checking";

const INTRO =
  "I read your YouCam face scan and explain what the scores mean. Ask about redness, acne, pores, texture, hydration, routines, or ingredients.";

const SCROLL_THRESHOLD = 72;

export function CoachExperience({ initialPrompt }: { initialPrompt?: string }) {
  const { session } = useScanSession();
  const [coachMode, setCoachMode] = useState<CoachMode>("checking");
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState(initialPrompt || "");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [pinnedToBottom, setPinnedToBottom] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatStarted = messages.some((message) => message.role === "user");

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    element.scrollTo({ top: element.scrollHeight, behavior });
  }, []);

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    setPinnedToBottom(distance < SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    if (pinnedToBottom) {
      scrollToBottom(messages.length <= 1 ? "auto" : "smooth");
    }
  }, [messages, loading, pinnedToBottom, scrollToBottom]);

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
      setPinnedToBottom(true);
    }
  }, []);

  useEffect(() => {
    void loadThread();
  }, [loadThread]);

  useEffect(() => {
    const resetCoach = () => {
      setMessages([{ role: "coach", content: INTRO }]);
      setInput("");
      setPinnedToBottom(true);
    };
    window.addEventListener("skinova:coach-reset", resetCoach);
    return () => window.removeEventListener("skinova:coach-reset", resetCoach);
  }, []);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    setInput("");
    setLoading(true);
    setPinnedToBottom(true);
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
        { role: "coach", content: "Coach is unavailable. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <Panel className="flex min-h-[24rem] flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-200" aria-hidden="true" />
      </Panel>
    );
  }

  return (
    <Panel className="flex min-h-0 flex-1 flex-col !p-0">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="text-sm font-semibold text-white">Skin Coach</h1>
          <span className="hidden text-slate-500 sm:inline">·</span>
          <span className="hidden truncate text-xs text-slate-400 sm:inline">Your scan results</span>
          <span
            className={[
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              coachMode === "live"
                ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/25"
                : "bg-white/5 text-slate-400 ring-1 ring-white/10"
            ].join(" ")}
          >
            {coachMode === "live" ? "Live" : "Guided"}
          </span>
        </div>
        <p className="shrink-0 text-xs text-slate-400">
          {session ? (
            <>Scan {session.analysis.overallScore}%</>
          ) : (
            <Link href="/scan" className="text-cyan-200 hover:underline">
              Run scan
            </Link>
          )}
        </p>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 space-y-3 overflow-y-auto px-4 py-4"
        >
          {messages.map((message, index) => (
            <div
              key={message.id || `${message.role}-${index}`}
              className={[
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-6",
                message.role === "user"
                  ? "ml-auto bg-cyan-300 text-slate-950"
                  : message.role === "scan"
                    ? "border border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-50/90"
                    : "bg-white/[0.05] text-slate-200 ring-1 ring-white/10"
              ].join(" ")}
            >
              {message.role === "scan" ? (
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-cyan-200/80">
                  Scan attached
                </span>
              ) : null}
              {message.content}
            </div>
          ))}
          {loading ? (
            <div className="flex max-w-[85%] items-center gap-2 rounded-2xl bg-white/[0.05] px-3.5 py-2.5 text-sm text-slate-400 ring-1 ring-white/10">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Thinking…
            </div>
          ) : null}
        </div>

        {!pinnedToBottom ? (
          <button
            type="button"
            onClick={() => {
              setPinnedToBottom(true);
              scrollToBottom("smooth");
            }}
            className="absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/95 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur transition hover:bg-slate-800"
          >
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            Latest
          </button>
        ) : null}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void sendMessage();
              }
            }}
            className="min-h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
            placeholder={chatStarted ? "Ask a follow-up…" : "Ask about your scan results"}
          />
          <button
            type="button"
            onClick={() => void sendMessage()}
            disabled={loading || !input.trim()}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Panel>
  );
}
