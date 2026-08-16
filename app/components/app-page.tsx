"use client";

import { usePathname } from "next/navigation";

export function AppPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCoach = pathname === "/coach";

  if (isCoach) {
    return <div className="flex min-h-0 flex-1 flex-col">{children}</div>;
  }

  return <div className="flex flex-col gap-6 pt-1 sm:pt-2">{children}</div>;
}
