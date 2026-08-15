import { PageHeader } from "../../components/ui";
import dynamic from "next/dynamic";

const ScanExperience = dynamic(() => import("../../components/scan-experience").then((mod) => mod.ScanExperience), {
  loading: () => <div className="h-72 animate-pulse rounded-2xl bg-white/6" />
});

export default function ScanPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Skin scan"
        title="Run a skin scan."
        description="Upload your own selfie or use a verified demo sample. Photo requirements are listed on this page to help avoid common YouCam scan errors."
      />
      <ScanExperience />
    </div>
  );
}
