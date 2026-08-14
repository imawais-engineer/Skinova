import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — Skinova",
  description: "Skinova privacy policy placeholder."
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-white">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          This placeholder page will be replaced with the full Skinova privacy policy before public launch. Skinova is
          designed to keep API credentials server-side and limit exposure of personal skincare data.
        </p>
      </div>
    </main>
  );
}
