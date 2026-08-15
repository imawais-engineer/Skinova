"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SkinovaLogo } from "./skinova-logo";

type AuthFormProps = {
  mode: "login" | "signup";
  nextPath?: string;
};

export function AuthForm({ mode, nextPath = "/dashboard" }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const payload =
        mode === "signup"
          ? { name, email, password, confirmPassword }
          : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "Authentication failed. Please try again.");
        return;
      }

      setSuccess(mode === "signup" ? "Account created. Opening Skinova..." : "Signed in. Opening Skinova...");
      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <SkinovaLogo
              size="md"
              subtitle={mode === "signup" ? "Create your account" : "Welcome back"}
            />
          </Link>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {mode === "signup" ? (
            <Field label="Full Name" id="name">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClassName}
                placeholder="Your name"
              />
            </Field>
          ) : null}

          <Field label="Email Address" id="email">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
              placeholder="you@example.com"
            />
          </Field>

          <Field label="Password" id="password">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClassName}
              placeholder="At least 8 characters"
            />
          </Field>

          {mode === "signup" ? (
            <Field label="Confirm Password" id="confirmPassword">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={inputClassName}
                placeholder="Repeat your password"
              />
            </Field>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100" role="alert">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100" role="status">
              {success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-cyan-200 underline underline-offset-2">
                Log in
              </Link>
            </>
          ) : (
            <>
              New to Skinova?{" "}
              <Link href="/signup" className="font-medium text-cyan-200 underline underline-offset-2">
                Get started
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20";
