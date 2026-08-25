"use client";

import { Activity, AlertTriangle, CheckCircle2, Droplets, Leaf, ShieldAlert } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function CropHealthPage() {
  const { farm, activeCropCycle, cropRisk, inputs } = useUserInput();
  const { t, getCropName, getRiskLevelLabel } = useTranslation();

  // Calculate dynamic vegetation health metrics based on soil & weather inputs
  const ndviIndex = Math.round((0.78 - (cropRisk.overallScore / 100) * 0.25) * 100) / 100;
  const leafChlorophyll = Math.round(42 - (inputs.temperatureC > 30 ? 6 : 0) - (inputs.nitrogen < 15 ? 8 : 0));
  const canopyCoverPct = Math.min(95, Math.max(40, 75 - (inputs.rainfallMm < 400 ? 15 : 0)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-crop">{t("navigation.afterPlanting")}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">{t("cropHealth.title")} — {farm.name}</h1>
        <p className="mt-2 text-slate-600">
          {t("cropHealth.subtitle", { crop: getCropName(inputs.selectedCrop) })}
        </p>
      </header>

      <CustomInputPanel />

      {/* Vital Health Metrics */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title={t("cropHealth.ndviIndex")} value={ndviIndex.toString()} detail={t("cropHealth.ndviRange")}>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{t("cropHealth.healthyCanopy")}</span>
        </MetricCard>
        <MetricCard title={t("cropHealth.leafChlorophyll")} value={`${leafChlorophyll} SPAD`} detail={t("cropHealth.soilNitrogen", { n: inputs.nitrogen })}>
          <span className="text-xs font-bold text-crop bg-crop/10 px-2 py-0.5 rounded-md">{t("cropHealth.goodVigour")}</span>
        </MetricCard>
        <MetricCard title={t("cropHealth.canopyCoverage")} value={`${canopyCoverPct}%`} detail={`${t("common.stage")}: ${activeCropCycle.stage}`}>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">{t("cropHealth.activeTillering")}</span>
        </MetricCard>
        <MetricCard title={t("cropHealth.fieldStressLevel")} value={`${cropRisk.overallScore}/100`} detail={`${t("common.temp")}: ${inputs.temperatureC}°C | ${t("common.rain")}: ${inputs.rainfallMm}mm`}>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">{t("cropHealth.moderateStress")}</span>
        </MetricCard>
      </section>

      {/* Detailed Crop Vigour & Disease Risk Diagnostics */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="border-2 border-crop/30 bg-white shadow-md">
          <div className="flex items-center justify-between border-b pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-crop" size={20} /> {t("cropHealth.fieldHealthIndicators")}
            </CardTitle>
            <span className="text-xs font-bold text-slate-500">{t("cropHealth.liveDiagnostic")}</span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                    <Leaf size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{t("cropHealth.nutrientAbsorption")}</h3>
                    <p className="text-xs text-slate-500">N-P-K: {inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium} kg/ha</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={14} /> {t("common.optimal")}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                {t("cropHealth.nutrientDesc")}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-sky-100 text-sky-800">
                    <Droplets size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{t("cropHealth.waterDeficit")}</h3>
                    <p className="text-xs text-slate-500">{t("farms.waterAvailability")}: {getRiskLevelLabel(inputs.waterAvailability)} ({inputs.rainfallMm} mm)</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                  <AlertTriangle size={14} /> {t("common.monitorClosely")}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                {t("cropHealth.waterDeficitDesc", { temp: inputs.temperatureC })}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-red-100 text-red-800">
                    <ShieldAlert size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{t("cropHealth.fungalPestRisk")}</h3>
                    <p className="text-xs text-slate-500">{t("common.temp")}: {inputs.temperatureC}°C</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                  <AlertTriangle size={14} /> {t("common.diseaseRisk")}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                {t("cropHealth.fungalPestDesc")}
              </p>
            </div>
          </div>
        </Card>

        {/* Growth Stage Milestone Timeline */}
        <Card className="border-2 border-slate-200 bg-white shadow-md">
          <CardTitle>{t("cropHealth.growthTimeline")}</CardTitle>
          <div className="mt-5 space-y-6">
            <div className="relative pl-6 border-l-2 border-crop">
              <span className="absolute -left-[9px] top-0 size-4 rounded-full bg-crop" />
              <p className="text-xs font-bold text-crop uppercase">{t("cropHealth.stage1Title")}</p>
              <h4 className="font-bold text-slate-900 text-sm">{t("cropHealth.stage1Desc")}</h4>
              <p className="text-xs text-slate-500">{t("cropHealth.stage1Status")}</p>
            </div>

            <div className="relative pl-6 border-l-2 border-crop">
              <span className="absolute -left-[9px] top-0 size-4 rounded-full bg-crop" />
              <p className="text-xs font-bold text-crop uppercase">{t("cropHealth.stage2Title")}</p>
              <h4 className="font-bold text-slate-900 text-sm">{t("cropHealth.stage2Desc")}</h4>
              <p className="text-xs text-slate-600">{t("cropHealth.stage2Status")}</p>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-200">
              <span className="absolute -left-[9px] top-0 size-4 rounded-full bg-slate-300" />
              <p className="text-xs font-bold text-slate-400 uppercase">{t("cropHealth.stage3Title")}</p>
              <h4 className="font-bold text-slate-700 text-sm">{t("cropHealth.stage3Desc")}</h4>
              <p className="text-xs text-slate-400">{t("cropHealth.stage3Status")}</p>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-200">
              <span className="absolute -left-[9px] top-0 size-4 rounded-full bg-slate-300" />
              <p className="text-xs font-bold text-slate-400 uppercase">{t("cropHealth.stage4Title")}</p>
              <h4 className="font-bold text-slate-700 text-sm">{t("cropHealth.stage4Desc")}</h4>
              <p className="text-xs text-slate-400">{t("cropHealth.stage4Status")}</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

