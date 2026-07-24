import { Database, KeyRound, Server, ShieldCheck } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "../components/ui";

export default function SettingsPage() {
  const demoMode = process.env.SKINOVA_DEMO_MODE !== "false";
  const apiKeyConfigured = Boolean(process.env.API_KEY);

  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="Server-side API settings and demo readiness."
        description="Secrets stay on the server. Judges can use the mock path, while live YouCam processing can be enabled with environment variables."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-semibold text-white">Runtime status</h2>
          <div className="mt-6 space-y-3">
            <SettingRow icon={KeyRound} label="API key configured" value={apiKeyConfigured ? "Yes" : "No"} tone={apiKeyConfigured ? "mint" : "rose"} />
            <SettingRow icon={Server} label="Demo mode" value={demoMode ? "Enabled" : "Disabled"} tone={demoMode ? "cyan" : "mint"} />
            <SettingRow icon={ShieldCheck} label="Client secret exposure" value="Blocked" tone="mint" />
            <SettingRow icon={Database} label="Persistence" value="Prototype mock data" tone="violet" />
          </div>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold text-white">Required environment variables</h2>
          <div className="mt-6 space-y-3">
            {["API_KEY", "SECRET_KEY", "BASE_URL", "SKINOVA_DEMO_MODE", "NEXT_PUBLIC_APP_URL"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <code className="text-sm text-cyan-100">{item}</code>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Set `SKINOVA_DEMO_MODE=false` only when YouCam credentials are available and you want to consume live API units.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: typeof KeyRound;
  label: string;
  value: string;
  tone: "cyan" | "mint" | "rose" | "violet";
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="h-5 w-5 shrink-0 text-cyan-200" aria-hidden="true" />
        <span className="min-w-0 text-sm text-slate-300">{label}</span>
      </div>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}
