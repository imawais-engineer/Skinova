import dynamic from "next/dynamic";
import { getSession } from "../../lib/auth";

const DashboardExperience = dynamic(
  () => import("../../components/dashboard-experience").then((mod) => mod.DashboardExperience),
  { loading: () => <div className="h-96 animate-pulse rounded-2xl bg-white/6" /> }
);

export default async function DashboardPage() {
  const session = await getSession();

  return <DashboardExperience userName={session?.name || "there"} />;
}
