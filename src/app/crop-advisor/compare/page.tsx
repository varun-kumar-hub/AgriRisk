"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { formatCurrency } from "@/lib/scoring/risk";

export default function CropComparePage() {
  const { recommendations, inputs, updateInputs } = useUserInput();
  const toast = useToast();

  const handleSelectCrop = (cropName: string) => {
    updateInputs({ selectedCrop: cropName.toLowerCase() });
    toast.success(`Selected ${cropName}`, `Set ${cropName} as primary crop for farm testing profile.`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-crop">Before planting intelligence</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Crop Comparison Engine</h1>
        <p className="mt-2 text-slate-600">
          Compare crop options side-by-side by decision suitability, risk, yield, and risk-adjusted economic return.
        </p>
      </header>

      <CustomInputPanel />

      <Card className="mt-6 border-2 border-crop/30 bg-white shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <CardTitle>Side-by-Side Crop Decision Matrix</CardTitle>
            <p className="text-xs text-slate-500">Currently testing: <strong className="capitalize">{inputs.selectedCrop}</strong></p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-crop bg-crop/10 px-3 py-1 rounded-full">
            <Sparkles size={14} /> 50,000+ Record Dataset
          </span>
        </div>

        <table className="mt-4 min-w-full text-left text-sm">
          <thead className="border-b text-slate-500 bg-slate-50">
            <tr>
              <th className="py-3 px-4">Crop</th>
              <th className="py-3 px-4">Decision Score</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Soil Fit</th>
              <th className="py-3 px-4">Climate Fit</th>
              <th className="py-3 px-4">Water Fit</th>
              <th className="py-3 px-4">Market Potential</th>
              <th className="py-3 px-4">Expected Yield</th>
              <th className="py-3 px-4">Risk-Adjusted Profit</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((crop) => {
              const isSelected = inputs.selectedCrop.toLowerCase() === crop.crop.toLowerCase();

              return (
                <tr
                  key={crop.crop}
                  className={`border-b last:border-0 transition-colors ${
                    isSelected ? "bg-crop/5 font-semibold" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="py-4 px-4">
                    <Link
                      href={`/crop-advisor/${crop.crop.toLowerCase()}`}
                      className="font-bold text-slate-900 hover:text-crop hover:underline flex items-center gap-1.5"
                    >
                      {crop.crop}
                      {isSelected && <Check size={16} className="text-crop" />}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-base font-extrabold text-slate-900">{crop.decisionScore}/100</td>
                  <td className="py-4 px-4"><RiskBadge level={crop.riskLevel} /></td>
                  <td className="py-4 px-4">{crop.soilScore}%</td>
                  <td className="py-4 px-4">{crop.climateScore}%</td>
                  <td className="py-4 px-4">{crop.waterScore}%</td>
                  <td className="py-4 px-4">{crop.marketScore}%</td>
                  <td className="py-4 px-4 font-semibold text-slate-800">{crop.expectedYield} t/ha</td>
                  <td className="py-4 px-4 font-bold text-emerald-700">{formatCurrency(crop.riskAdjustedProfit)}</td>
                  <td className="py-4 px-4 text-right">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-crop/20 px-3 py-1 text-xs font-bold text-crop">
                        <Check size={14} /> Active
                      </span>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleSelectCrop(crop.crop)}>
                        Select Crop
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
