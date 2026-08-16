import { CoachExperience } from "../../components/coach-experience";

export default async function CoachPage({
  searchParams
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-[calc(100dvh-8.5rem)] flex-col">
      <CoachExperience initialPrompt={params.prompt} />
    </div>
  );
}
