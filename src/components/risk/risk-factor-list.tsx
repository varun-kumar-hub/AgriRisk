import { RiskBadge } from "@/components/ui/risk-badge";
import type { RiskFactor } from "@/types/domain";

export function RiskFactorList({ factors }: { factors: RiskFactor[] }) {
  return (
    <div className="space-y-3">
      {factors.map((factor) => (
        <div key={factor.factor} className="rounded-md border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-950">{factor.factor}</h3>
              <p className="mt-1 text-sm text-slate-600">{factor.description}</p>
            </div>
            <RiskBadge level={factor.severity} />
          </div>
          <p className="mt-3 text-sm font-medium text-risk">Impact +{factor.impact}</p>
        </div>
      ))}
    </div>
  );
}
