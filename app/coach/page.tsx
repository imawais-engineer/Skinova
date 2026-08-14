import { PageHeader } from "../components/ui";
import { CoachExperience } from "../components/coach-experience";

export default function CoachPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Skin coach"
        title="Ask routine and ingredient questions."
        description="Skin Coach gives skincare education, routine guidance, and ingredient cautions without medical diagnosis claims."
      />
      <CoachExperience />
    </div>
  );
}
