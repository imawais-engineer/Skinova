import { PageHeader } from "../components/ui";
import { ScanExperience } from "../components/scan-experience";

export default function ScanPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Core workflow"
        title="Run a demo-safe skin scan."
        description="This flow demonstrates the YouCam integration shape while remaining reliable for judging, local testing, and screenshot capture."
      />
      <ScanExperience />
    </div>
  );
}
