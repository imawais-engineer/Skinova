import Link from "next/link";
import { SkinovaLogo } from "./skinova-logo";

export function LegalPage({
  title,
  lastUpdated,
  children
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-[#050812]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/">
            <SkinovaLogo size="sm" />
          </Link>
          <Link href="/" className="text-sm text-slate-400 transition hover:text-white">
            Back to home
          </Link>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-6 sm:py-12">
        <article className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-cyan-200">Legal</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-slate-400">Last updated: {lastUpdated}</p>
          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-300">{children}</div>
        </article>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-4 px-4 text-sm text-slate-400 sm:px-6">
          <Link href="/privacy" className="transition hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition hover:text-white">
            Terms of Service
          </Link>
          <Link href="/login" className="transition hover:text-white">
            Log in
          </Link>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
