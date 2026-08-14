import { Activity, CheckCircle2, HeartPulse, Lock, ShieldCheck } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "../components/ui";

const healthItems = [
  { label: "Application", value: "Online", detail: "Dashboard and care journey are available.", icon: Activity },
  { label: "Skin scan", value: "Ready", detail: "Photo analysis flow is accepting new scans.", icon: HeartPulse },
  { label: "Guidance", value: "Ready", detail: "Routine and education views are available.", icon: CheckCircle2 },
  { label: "Privacy boundary", value: "Protected", detail: "Operational details stay behind the application boundary.", icon: Lock }
];

export default function HealthPage() {
  return (
    <div>
      <PageHeader
        eyebrow="App health"
        title="Skinova is online and ready for live testing."
        description="Service readiness for the public Skinova experience."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Panel className="gradient-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <StatusBadge tone="mint">Healthy</StatusBadge>
              <h2 className="mt-5 text-3xl font-semibold text-white">All public flows available</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Skinova can accept a clear selfie, return skincare intelligence, generate routine guidance, and show progress views.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-300/12 text-emerald-100 ring-1 ring-emerald-300/20">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2">
          {healthItems.map((item) => {
            const Icon = item.icon;
            return (
              <Panel key={item.label}>
                <div className="flex items-start justify-between gap-4">
                  <Icon className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                  <StatusBadge tone="mint">{item.value}</StatusBadge>
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{item.detail}</p>
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
