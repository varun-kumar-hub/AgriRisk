"use client";

import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { recommendations } from "@/lib/mock/data";
import { formatCurrency } from "@/lib/scoring/risk";

export default function RecommendationsPage() {
  const { farm, inputs } = useUserInput();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-crop">Action intelligence</p>
        <h1 className="mt-1 text-3xl font-bold">Recommendations for {farm.name}</h1>
        <p className="mt-2 text-slate-600">Actions tied to your soil pH ({inputs.soilPh}), current water availability ({inputs.waterAvailability}), and risk profile.</p>
      </header>

      <CustomInputPanel />

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {recommendations.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{item.category}</CardTitle>
                <RiskBadge level={item.priority} />
              </div>
              <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Cost</dt><dd className="font-semibold">{formatCurrency(item.estimatedCost)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Risk reduction</dt><dd className="font-semibold text-emerald-600">-{item.expectedRiskReduction}%</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Confidence</dt><dd className="font-semibold">{Math.round(item.confidence * 100)}%</dd></div>
              </dl>
            </div>
            <Button className="mt-5 w-full">
              Apply Recommendation
            </Button>
          </Card>
        ))}
      </section>

      <Card className="mt-6 overflow-x-auto">
        <CardTitle>Intervention Benefit View</CardTitle>
        <table className="mt-4 min-w-full text-left text-sm">
          <thead className="border-b text-slate-500"><tr><th className="py-3">Action</th><th>Cost</th><th>Risk Drop</th><th>Benefit</th></tr></thead>
          <tbody>
            {recommendations.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-3 font-medium">{item.title}</td>
                <td>{formatCurrency(item.estimatedCost)}</td>
                <td className="text-emerald-600 font-semibold">-{item.expectedRiskReduction}%</td>
                <td>{item.expectedBenefit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

