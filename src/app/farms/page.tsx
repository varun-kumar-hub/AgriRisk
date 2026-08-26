"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function FarmsPage() {
  const { farm, activeCropCycle, cropRisk, inputs } = useUserInput();
  const { t, getCropName, getRiskLevelLabel, getSoilTypeLabel, getIrrigationLabel, getGrowthStageLabel, getSeasonLabel } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-crop">{t("farms.headerCategory")}</p>
          <h1 className="mt-1 text-3xl font-bold">{t("farms.title")}</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-crop px-4 py-2 text-sm font-semibold text-white">
          <Plus size={16} /> {t("farms.addFarm")}
        </button>
      </header>

      <CustomInputPanel />

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardTitle>{t("farms.farmProfile")}</CardTitle>
          <h2 className="mt-4 text-2xl font-semibold">{farm.name}</h2>
          <p className="mt-1 text-slate-600">{farm.location}</p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">{t("common.area")}</dt><dd>{farm.areaAcres} {t("farms.acres")}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">{t("common.soil")}</dt><dd>{getSoilTypeLabel(farm.soilType)} (pH {farm.soilPh})</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Crop Age</dt><dd>{inputs.cropAge || 45} days</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">{t("common.irrigation")}</dt><dd>{getIrrigationLabel(farm.irrigationType)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">{t("customInput.waterAvailability")}</dt><dd>{getRiskLevelLabel(farm.waterAvailability)}</dd></div>
          </dl>
          <Link href={`/farms/${farm.id}`} className="mt-6 block rounded-md bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white">
            {t("farms.openFarm")}
          </Link>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard title={t("farms.activeCrop")} value={getCropName(activeCropCycle.crop)} detail={`${getSeasonLabel(activeCropCycle.season)} · ${getGrowthStageLabel(activeCropCycle.stage)}`} />
          <MetricCard title={t("farms.cropAge")} value={`${activeCropCycle.ageDays} days`} detail={t("farms.sinceSowing")} />
          <MetricCard title={t("farms.cropRisk")} value={`${cropRisk.overallScore}/100`} detail={t("farms.dynamicRiskScore")}><RiskBadge level={cropRisk.level} /></MetricCard>
        </div>
      </section>
    </div>
  );
}



