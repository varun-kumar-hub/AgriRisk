"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Sprout, Tractor, Sparkles } from "lucide-react";
import { RiskTrendChart } from "@/components/charts/risk-trend-chart";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { TargetCropStatusBanner } from "@/components/crop-advisor/target-crop-banner";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function DashboardPage() {
  const { farm, cropRisk, inputs, recommendations, loadingAi } = useUserInput();
  const { t, getCropName, getRiskLevelLabel } = useTranslation();

  // Dynamic real-time alerts based on live inputs
  const dynamicAlerts = [];
  if (inputs.nitrogen < 25) {
    dynamicAlerts.push({
      id: "alert-n",
      title: "Nitrogen Deficit Stress",
      severity: "HIGH" as const,
      description: `Current Soil N level is ${inputs.nitrogen} kg/ha (Target: 40 kg/ha). Apply urea split dose.`
    });
  }
  if (inputs.waterAvailability === "Low" || inputs.rainfallMm < 600) {
    dynamicAlerts.push({
      id: "alert-water",
      title: "Moisture Deficit Warning",
      severity: "HIGH" as const,
      description: `Water supply in ${inputs.distName} is Low (${inputs.rainfallMm} mm). Schedule drip irrigation.`
    });
  }
  if (inputs.temperatureC > 34) {
    dynamicAlerts.push({
      id: "alert-temp",
      title: "Thermal Stress Anomaly",
      severity: "MODERATE" as const,
      description: `Ambient temp reached ${inputs.temperatureC}°C. Maintain mulching to protect crop root zone.`
    });
  }
  if (inputs.soilPh < 5.5 || inputs.soilPh > 8.0) {
    dynamicAlerts.push({
      id: "alert-ph",
      title: "Suboptimal Soil pH Level",
      severity: "MODERATE" as const,
      description: `Soil pH is ${inputs.soilPh}. Apply agricultural lime or organic compost to normalize.`
    });
  }
  if (dynamicAlerts.length === 0) {
    dynamicAlerts.push({
      id: "alert-optimal",
      title: "Field Conditions Optimal",
      severity: "LOW" as const,
      description: `All soil nutrients, moisture, and temperature levels in ${inputs.distName} are within target ranges.`
    });
  }

  // Dynamic crop health score calculated from soil & water factors
  const healthScore = Math.max(20, Math.min(98, 100 - cropRisk.overallScore * 0.6));
  const healthLabel = healthScore > 75 ? "LOW" : healthScore > 50 ? "MODERATE" : "HIGH";

  return (
    <div className="mx-auto max-w-7xl px-3.5 py-4 sm:px-6 lg:px-8 sm:py-6">
      <header className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-crop">{t("dashboard.kharifLocation", { location: `${inputs.distName}, ${inputs.stateName}` })}</p>
          <h1 className="mt-0.5 text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">{t("dashboard.greeting", { name: "Varun" })}</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">{t("dashboard.overviewFor", { farm: inputs.farmName })}</p>
        </div>
        <div className="self-start sm:self-auto flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-crop bg-crop/10 px-3 py-1.5 rounded-full border border-crop/20">
          <Sparkles size={13} className="animate-spin shrink-0" />
          <span>{t("dashboard.predictionUpdatedLive")} (Gemini 2.5 Flash)</span>
        </div>
      </header>

      <CustomInputPanel />

      <TargetCropStatusBanner />

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Link href="/crop-advisor" className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 hover:bg-emerald-100/70 transition-all">
          <Sprout className="text-crop" size={28} />
          <h2 className="mt-3 text-xl font-bold text-slate-900">{t("dashboard.planCropTitle")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("dashboard.planCropSubtitle")}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-crop">{t("dashboard.startCropAdvisor")} <ArrowRight size={16} /></span>
        </Link>
        <Link href="/farms" className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5 hover:bg-sky-100/70 transition-all">
          <Tractor className="text-water" size={28} />
          <h2 className="mt-3 text-xl font-bold text-slate-900">{t("dashboard.manageCropTitle")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("dashboard.manageCropSubtitle")}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-water">{t("dashboard.viewMyFarms")} <ArrowRight size={16} /></span>
        </Link>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title={t("dashboard.overallAgriculturalRisk")} value={`${cropRisk.overallScore}/100`} detail={t("dashboard.dynamicRiskCalculation")}>
          <div className="mt-3"><RiskBadge level={cropRisk.level} /></div>
        </MetricCard>
        <MetricCard title={t("dashboard.cropHealthIndex")} value={`${Math.round(healthScore)}/100`} detail={`${getRiskLevelLabel(healthLabel)} · Vegetative Stage`} />
        <MetricCard title={t("common.confidence")} value={`${Math.round(cropRisk.confidence * 100)}%`} detail={t("dashboard.confidenceDetail")} />
        <MetricCard title={t("dashboard.pendingAlerts")} value={dynamicAlerts.length} detail={t("dashboard.activeAlertsDetail")} />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardTitle>{t("dashboard.riskAndHealthTrend")}</CardTitle>
          <RiskTrendChart />
        </Card>
        <Card>
          <CardTitle>{t("dashboard.attentionCenter")}</CardTitle>
          <div className="mt-4 space-y-3">
            {dynamicAlerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-900 text-sm"><AlertTriangle size={16} className="text-amber-500 shrink-0" />{alert.title}</span>
                  <RiskBadge level={alert.severity} />
                </div>
                <p className="mt-2 text-xs text-slate-600 font-medium leading-5">{alert.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={18} className="text-crop" />
            {t("dashboard.aiInsight")}
          </CardTitle>
          <p className="mt-4 text-base leading-7 text-slate-700 font-medium">
            Based on real-time soil N-P-K ({inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium} kg/ha), pH {inputs.soilPh}, temperature {inputs.temperatureC}°C, and precipitation {inputs.rainfallMm} mm in {inputs.distName}, {inputs.stateName}: <strong>{getCropName(inputs.selectedCrop)}</strong> presents an overall risk score of {cropRisk.overallScore}/100.
          </p>
          <Link href="/risk" className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors">
            {t("dashboard.viewAnalysis")}
          </Link>
        </Card>

        <Card>
          <CardTitle>{t("dashboard.topActions")}</CardTitle>
          <div className="mt-4 space-y-3">
            {recommendations.slice(0, 3).map((item, idx) => (
              <div key={item.crop || idx} className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                <p className="font-bold text-slate-900 text-sm">Grow {getCropName(item.crop)} ({item.expectedYield} t/ha)</p>
                <p className="text-xs text-slate-600 mt-1">{item.explanation}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
