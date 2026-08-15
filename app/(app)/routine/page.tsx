import dynamic from "next/dynamic";

const RoutineExperience = dynamic(
  () => import("../../components/routine-experience").then((mod) => mod.RoutineExperience),
  { loading: () => <div className="h-96 animate-pulse rounded-2xl bg-white/6" /> }
);

export default function RoutinePage() {
  return <RoutineExperience />;
}
