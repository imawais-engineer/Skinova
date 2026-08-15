import { PageHeader } from "../../components/ui";
import { CoachExperience } from "../../components/coach-experience";

export default async function CoachPage({
  searchParams
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <PageHeader
        eyebrow="Skin coach"
        title="Ask routine and ingredient questions."
        description="Skin Coach gives skincare education, routine guidance, and ingredient cautions without medical diagnosis claims."
      />
      <CoachExperience initialPrompt={params.prompt} />
    </div>
  );
}
