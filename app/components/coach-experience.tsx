"use client";

import { useState } from "react";
import { Bot, Loader2, Send } from "lucide-react";
import { Panel } from "./ui";

type CoachMessage = {
  role: "user" | "coach";
  content: string;
};

const starterMessages: CoachMessage[] = [
  {
    role: "coach",
    content:
      "Ask about acne, redness, routines, or ingredients. I will respond with skincare education based on the Skinova demo analysis."
  }
];

export function CoachExperience() {
  const [messages, setMessages] = useState<CoachMessage[]>(starterMessages);
  const [input, setInput] = useState("Why is my skin red this week?");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const trimmed = input.trim();
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
        body: JSON.stringify({ message: trimmed })
      });
      const data = (await response.json()) as { answer: string; safety: string };
      setMessages((current) => [
        ...current,
        { role: "coach", content: `${data.answer} ${data.safety}` }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "coach", content: "The local coach route is unavailable. Restart the dev server and try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-300/12 text-violet-100 ring-1 ring-violet-300/20">
          <Bot className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-white">Functional local Skin Coach</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This is intentionally local and deterministic for the prototype. It avoids unsupported medical claims and keeps the demo reliable.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
          onClick={sendMessage}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="mr-2 h-4 w-4" aria-hidden="true" />}
          Send
        </button>
      </div>
    </Panel>
  );
}
