import { PageHeader } from "../../components/ui";
import { ScanExperience } from "../../components/scan-experience";

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
