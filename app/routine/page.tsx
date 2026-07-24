import { ClipboardList, ShieldCheck } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "../components/ui";
import { routinePlan } from "../lib/skinova-data";

export default function RoutinePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Personalized guidance"
        title="A routine generated from the analysis."
        description="Skinova turns technical results into a practical morning and night plan without making medical claims."
        action={{ href: "/coach", label: "Ask coach" }}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <RoutineCard title="Morning routine" items={routinePlan.morning} />
        <RoutineCard title="Night routine" items={routinePlan.night} />
      </div>

      <Panel className="mt-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-200" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">Ingredient safety notes</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {routinePlan.avoid.map((item) => (
            <div key={item} className="rounded-2xl border border-rose-300/15 bg-rose-300/[0.06] p-4 text-sm leading-6 text-rose-50/90">
              {item}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function RoutineCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-cyan-200" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <StatusBadge tone="cyan">{items.length} steps</StatusBadge>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <div key={item} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/12 text-sm font-semibold text-cyan-100">
              {index + 1}
            </span>
            <p className="min-w-0 text-sm leading-6 text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
