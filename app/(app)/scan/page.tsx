import dynamic from "next/dynamic";

const ScanExperience = dynamic(() => import("../../components/scan-experience").then((mod) => mod.ScanExperience), {
  loading: () => <div className="h-48 animate-pulse rounded-2xl bg-white/6" />
});

export default function ScanPage() {
  return (
    <div className="flex flex-col gap-3">
      <header>
        <p className="text-sm font-medium text-cyan-200">Skin scan</p>
        <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Run a live skin scan.</h1>
      </header>
      <ScanExperience />
    </div>
  );
}
