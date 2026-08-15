"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { coachSamplePrompts } from "../lib/demo-samples";
import { useScanSession } from "../hooks/use-scan-session";
import { Panel } from "./ui";
import { SkinovaLogo } from "./skinova-logo";

type CoachMessage = {
  role: "user" | "coach";
  content: string;
};

const starterMessages: CoachMessage[] = [
  {
    role: "coach",
    content:
      "Hi! I'm your Skin Coach. Ask me about skincare, ingredients, or your routine — I'll use your latest scan when available."
  }
];

export function CoachExperience({ initialPrompt }: { initialPrompt?: string }) {
  const { session } = useScanSession();
  const [messages, setMessages] = useState<CoachMessage[]>(starterMessages);
  const [input, setInput] = useState(initialPrompt || "Why is my skin red this week?");
  const [loading, setLoading] = useState(false);

  async function sendMessage(messageOverride?: string) {
    const trimmed = (messageOverride ?? input).trim();
    if (!trimmed) {
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
          analysis: session?.analysis || null
        })
      });
      const data = (await response.json()) as { answer?: string; safety?: string; error?: string };

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "Coach unavailable");
      }

      setMessages((current) => [
        ...current,
        { role: "coach", content: `${data.answer} ${data.safety || ""}`.trim() }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "coach", content: "Skin Coach is unavailable right now. Please try again in a moment." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel>
      <div className="flex items-start gap-3">
        <SkinovaLogo size="sm" showWordmark={false} />
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-white">Skin Coach</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Get skincare education and routine guidance without unsupported medical claims.
          </p>
          {session ? (
            <p className="mt-2 text-xs text-emerald-200/90">
              Using your latest scan score of {session.analysis.overallScore}%.
            </p>
          ) : (
            <p className="mt-2 text-xs text-amber-100/80">Run a scan first for more personalized coaching.</p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Try a sample question</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {coachSamplePrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void sendMessage(prompt)}
              disabled={loading}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/[0.08] disabled:opacity-60"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={[
              "max-w-3xl rounded-2xl px-4 py-3 text-sm leading-6",
              message.role === "user"
                ? "ml-auto bg-cyan-300 text-slate-950"
                : "bg-white/[0.05] text-slate-200 ring-1 ring-white/10"
            ].join(" ")}
          >
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
          placeholder="Ask a skincare routine question"
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

      {!session ? (
        <p className="mt-4 text-center text-xs text-slate-500">
          <Link href="/scan" className="text-cyan-200 underline underline-offset-2">
            Run a skin scan
          </Link>{" "}
          to personalize coach answers.
        </p>
      ) : null}
    </Panel>
  );
}
