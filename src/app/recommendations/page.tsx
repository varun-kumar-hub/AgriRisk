"use client";

import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { recommendations } from "@/lib/mock/data";
import { formatCurrency } from "@/lib/scoring/risk";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function RecommendationsPage() {
  const { farm, inputs } = useUserInput();
  const { t, getRiskLevelLabel } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-crop">{t("recommendations.actionIntelligence")}</p>
        <h1 className="mt-1 text-3xl font-bold">{t("recommendations.headerTitle", { farm: farm.name })}</h1>
        <p className="mt-2 text-slate-600">
          {t("recommendations.headerSubtitle", { ph: inputs.soilPh, water: getRiskLevelLabel(inputs.waterAvailability) })}
        </p>
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
                <div className="flex justify-between"><dt className="text-slate-500">{t("recommendations.cost")}</dt><dd className="font-semibold">{formatCurrency(item.estimatedCost)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">{t("recommendations.riskReduction")}</dt><dd className="font-semibold text-emerald-600">-{item.expectedRiskReduction}%</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">{t("recommendations.confidence")}</dt><dd className="font-semibold">{Math.round(item.confidence * 100)}%</dd></div>
              </dl>
            </div>
            <Button className="mt-5 w-full">
              {t("recommendations.applyRecommendation")}
            </Button>
          </Card>
        ))}
      </section>

      <Card className="mt-6 overflow-x-auto">
        <CardTitle>{t("recommendations.interventionBenefitView")}</CardTitle>
        <table className="mt-4 min-w-full text-left text-sm">
          <thead className="border-b text-slate-500">
            <tr>
              <th className="py-3">{t("recommendations.thAction")}</th>
              <th>{t("recommendations.thCost")}</th>
              <th>{t("recommendations.thRiskDrop")}</th>
              <th>{t("recommendations.thBenefit")}</th>
            </tr>
          </thead>
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


