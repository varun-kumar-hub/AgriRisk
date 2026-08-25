"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

export interface ProgressStep {
  id: string;
  label: string;
}

interface ApiProgressStepperProps {
  steps: ProgressStep[];
  currentStepIndex: number;
  progressPercent: number;
}

export function ApiProgressStepper({ steps, currentStepIndex, progressPercent }: ApiProgressStepperProps) {
  return (
    <div className="rounded-xl border border-crop/30 bg-white p-5 shadow-lg space-y-4 animate-in fade-in">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Loader2 className="animate-spin text-crop" size={18} /> Processing Intelligence Analysis...
        </h4>
        <span className="font-extrabold text-sm text-crop">{progressPercent}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-crop transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Checklist */}
      <div className="space-y-2 pt-1 text-xs">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-2.5 transition-colors ${
                isDone
                  ? "text-emerald-700 font-semibold"
                  : isCurrent
                  ? "text-slate-900 font-bold"
                  : "text-slate-400"
              }`}
            >
              {isDone && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
              {isCurrent && <Loader2 size={16} className="animate-spin text-crop shrink-0" />}
              {isPending && <span className="size-4 rounded-full border-2 border-slate-300 shrink-0 inline-block" />}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
