import { PageHeader } from "../components/ui";
import { ScanExperience } from "../components/scan-experience";

export default function ScanPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Skin scan"
        title="Run a live skin scan."
        description="Upload a clear selfie to receive skin scores, plain-language insights, and personalized skincare guidance."
      />
      <ScanExperience />
    </div>
  );
}
