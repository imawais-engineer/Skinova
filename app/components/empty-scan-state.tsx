import Link from "next/link";
import { LoadDemoSampleButton } from "./load-demo-sample";
import { Panel } from "./ui";

export function EmptyScanState({
  message,
  showDemoButton = true
}: {
  message: string;
  showDemoButton?: boolean;
}) {
  return (
    <Panel className="mb-5 border-amber-300/20 bg-amber-300/[0.05]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-amber-50/90">{message}</p>
        <div className="flex flex-wrap gap-2">
          {showDemoButton ? <LoadDemoSampleButton /> : null}
          <Link
            href="/scan"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
          >
            Run scan
          </Link>
        </div>
      </div>
    </Panel>
  );
}
