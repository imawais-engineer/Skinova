import { Check, Circle, Loader2 } from "lucide-react";
import { liveScanSteps } from "../lib/scan-steps";

export function ScanStepper({
  activeIndex,
  isRunning
}: {
  activeIndex: number;
  isRunning: boolean;
}) {
  return (
    <ol className="space-y-2">
      {liveScanSteps.map((step, index) => {
        const isComplete = index < activeIndex;
        const isActive = index === activeIndex;
        const tone = isComplete ? "text-emerald-100" : isActive ? "text-cyan-100" : "text-slate-500";

        return (
          <li
            key={step.id}
            className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 transition ${
              isActive
                ? "border-cyan-300/30 bg-cyan-300/[0.08]"
                : isComplete
                  ? "border-emerald-300/20 bg-emerald-300/[0.05]"
                  : "border-white/5 bg-white/[0.02]"
            }`}
          >
            <span className={`mt-0.5 shrink-0 ${tone}`} aria-hidden="true">
              {isComplete ? (
                <Check className="h-4 w-4" />
              ) : isActive && isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-medium ${isActive || isComplete ? "text-white" : "text-slate-400"}`}>
                {index + 1}. {step.label}
              </p>
              {(isActive || isComplete) && <p className="mt-0.5 text-xs leading-5 text-slate-400">{step.detail}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
