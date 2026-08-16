import { CoachExperience } from "../../components/coach-experience";

export default async function CoachPage({
  searchParams
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const params = await searchParams;

  return <CoachExperience initialPrompt={params.prompt} />;
}
