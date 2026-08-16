import { CoachExperience } from "../../components/coach-experience";
import { PageHeader } from "../../components/ui";

export default async function CoachPage({
  searchParams
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <PageHeader
        density="compact"
        eyebrow="Skin coach"
        title="Ask about your scan results."
        description="Education on routines and ingredients — not medical diagnosis."
      />
      <CoachExperience initialPrompt={params.prompt} />
    </div>
  );
}
