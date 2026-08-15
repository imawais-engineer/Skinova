import { redirect } from "next/navigation";
import { getSession } from "../lib/auth";
import { getAppMode } from "../lib/app-mode";
import { AppPage } from "../components/app-page";
import { AppShell } from "../components/app-shell";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const appMode = getAppMode();

  return (
    <AppShell user={session} appMode={appMode}>
      <AppPage>{children}</AppPage>
    </AppShell>
  );
}
