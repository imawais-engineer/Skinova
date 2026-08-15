import dynamic from "next/dynamic";

const ResultsExperience = dynamic(
  () => import("../../components/results-experience").then((mod) => mod.ResultsExperience),
  { loading: () => <div className="h-96 animate-pulse rounded-2xl bg-white/6" /> }
);

export default function ResultsPage() {
  return <ResultsExperience />;
}
