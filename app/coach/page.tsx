import { PageHeader } from "../components/ui";
import { CoachExperience } from "../components/coach-experience";

export default function CoachPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI skin coach"
        title="Ask routine and ingredient questions."
        description="The prototype coach is functional via local deterministic responses so the demo remains reliable before adding a live LLM provider."
      />
      <CoachExperience />
    </div>
  );
}
