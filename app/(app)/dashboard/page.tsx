import { getSession } from "../../lib/auth";
import { DashboardExperience } from "../../components/dashboard-experience";

export default async function DashboardPage() {
  const session = await getSession();

  return <DashboardExperience userName={session?.name || "there"} />;
}
