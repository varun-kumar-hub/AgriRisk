"use client";

import Link from "next/link";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { formatCurrency } from "@/lib/scoring/risk";

export default function CropComparePage() {
  const { recommendations } = useUserInput();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-crop">Before planting</p>
        <h1 className="mt-1 text-3xl font-bold">Crop Comparison</h1>
        <p className="mt-2 text-slate-600">Compare crops by suitability, risk, yield, and risk-adjusted economic return.</p>
      </header>

      <CustomInputPanel />

      <Card className="mt-6 overflow-x-auto">
        <CardTitle>Decision Matrix</CardTitle>
        <table className="mt-4 min-w-full text-left text-sm">
          <thead className="border-b text-slate-500">
            <tr>
              <th className="py-3 pr-5">Crop</th>
              <th className="py-3 pr-5">Decision</th>
              <th className="py-3 pr-5">Risk</th>
              <th className="py-3 pr-5">Soil</th>
              <th className="py-3 pr-5">Climate</th>
              <th className="py-3 pr-5">Water</th>
              <th className="py-3 pr-5">Market</th>
              <th className="py-3 pr-5">Yield</th>
              <th className="py-3 pr-5">Risk-adjusted profit</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((crop) => (
              <tr key={crop.crop} className="border-b last:border-0">
                <td className="py-4 pr-5 font-semibold"><Link href={`/crop-advisor/${crop.crop.toLowerCase()}`}>{crop.crop}</Link></td>
                <td className="py-4 pr-5">{crop.decisionScore}</td>
                <td className="py-4 pr-5"><RiskBadge level={crop.riskLevel} /></td>
                <td className="py-4 pr-5">{crop.soilScore}</td>
                <td className="py-4 pr-5">{crop.climateScore}</td>
                <td className="py-4 pr-5">{crop.waterScore}</td>
                <td className="py-4 pr-5">{crop.marketScore}</td>
                <td className="py-4 pr-5">{crop.expectedYield} t/ha</td>
                <td className="py-4 pr-5">{formatCurrency(crop.riskAdjustedProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

