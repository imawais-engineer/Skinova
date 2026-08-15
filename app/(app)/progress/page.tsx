import dynamic from "next/dynamic";

const ProgressExperience = dynamic(
  () => import("../../components/progress-experience").then((mod) => mod.ProgressExperience),
  { loading: () => <div className="h-96 animate-pulse rounded-2xl bg-white/6" /> }
);

export default function ProgressPage() {
  return <ProgressExperience />;
}
