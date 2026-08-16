import { PageHeader } from "../../components/ui";
import dynamic from "next/dynamic";

const ScanExperience = dynamic(() => import("../../components/scan-experience").then((mod) => mod.ScanExperience), {
  loading: () => <div className="h-72 animate-pulse rounded-2xl bg-white/6" />
});

export default function ScanPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        density="compact"
        eyebrow="Skin scan"
        title="Run a live skin scan."
        description="Select a photo, start the scan, and watch each analysis step complete with live results."
      />
      <ScanExperience />
    </div>
  );
}
