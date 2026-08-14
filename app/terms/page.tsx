import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms — Skinova",
  description: "Skinova terms of service placeholder."
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-white">Terms of Service</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          This placeholder page will be replaced with the full Skinova terms of service before public launch. Skinova
          provides educational skincare information and does not diagnose medical conditions.
        </p>
      </div>
    </main>
  );
}
