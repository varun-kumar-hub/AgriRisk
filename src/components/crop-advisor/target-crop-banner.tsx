"use client";

import { useUserInput } from "@/components/providers/user-input-provider";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { getAgronomicConstraintReason } from "@/lib/data/store";
import { RiskBadge } from "@/components/ui/risk-badge";
import { AlertTriangle, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TargetCropStatusBanner() {
  const { inputs, recommendations, updateInputs } = useUserInput();
  const { t, getCropName } = useTranslation();

  const selectedCropName = inputs.selectedCrop || "rice";
  const targetRec = recommendations.find((r) => r.crop.toLowerCase().includes(selectedCropName.toLowerCase())) || recommendations[0];

  const topRec = recommendations[0];
  const isTargetRecommended = targetRec.decisionScore >= 75 && (targetRec.riskLevel === "LOW" || targetRec.riskLevel === "MODERATE");

  const constraintReasons = getAgronomicConstraintReason(selectedCropName, inputs);

  return (
    <div className={`my-6 rounded-2xl border p-5 shadow-sm transition-all ${
      isTargetRecommended
        ? "border-emerald-300 bg-emerald-50/70"
        : "border-amber-300 bg-amber-50/80"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`grid size-10 place-items-center rounded-xl shrink-0 text-white shadow-sm ${
            isTargetRecommended ? "bg-emerald-600" : "bg-amber-600"
          }`}>
            {isTargetRecommended ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Active Target Crop:
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 capitalize">
                {getCropName(targetRec.crop)}
              </h3>
              <RiskBadge level={targetRec.riskLevel} />
              <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-md border">
                Suitability Fit: {targetRec.decisionScore}/100
              </span>
            </div>

            {isTargetRecommended ? (
              <p className="mt-2 text-sm text-emerald-900 font-medium">
                ✅ <strong>{getCropName(targetRec.crop)}</strong> is well suited for your soil pH ({inputs.soilPh}), N-P-K ({inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium}), temperature ({inputs.temperatureC}°C), and water supply in {inputs.distName}, {inputs.stateName}.
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                <p className="text-sm font-bold text-amber-950">
                  ⚠️ <strong>{getCropName(targetRec.crop)}</strong> is NOT recommended under your current farm inputs. Detailed agronomic constraints:
                </p>
                <ul className="space-y-1.5 text-xs text-amber-900 font-medium pl-1">
                  {constraintReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-white/70 p-2 rounded-lg border border-amber-200">
                      <span className="text-amber-600 font-bold shrink-0">❌</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {!isTargetRecommended && topRec && topRec.crop !== targetRec.crop && (
          <div className="mt-3 sm:mt-0 shrink-0 rounded-xl bg-white p-3 border border-amber-200 text-right">
            <p className="text-[11px] font-bold uppercase text-slate-400">Better Alternative</p>
            <p className="text-sm font-bold text-slate-900">{getCropName(topRec.crop)} ({topRec.decisionScore}/100)</p>
            <button
              onClick={() => updateInputs({ selectedCrop: topRec.crop.toLowerCase().split(" ")[0] })}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-crop px-3 py-1.5 text-xs font-bold text-white hover:bg-crop/90 cursor-pointer"
            >
              Switch to {getCropName(topRec.crop)} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
