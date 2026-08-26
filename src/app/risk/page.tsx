"use client";

import { useState } from "react";
import { AlertTriangle, BarChart3, CloudRain, DollarSign, Droplets, LineChart, ShieldAlert, Sprout, Sun, Thermometer, TrendingDown, Wheat } from "lucide-react";
import { CategoryBars } from "@/components/charts/category-bars";
import { RiskTrendChart } from "@/components/charts/risk-trend-chart";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { classifyRisk } from "@/lib/scoring/risk";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function RiskIntelligencePage() {
  const { farm, activeCropCycle, cropRisk, inputs } = useUserInput();
  const { t, getCropName, getRiskLevelLabel } = useTranslation();
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");

  // Dynamic Risk calculations based on user inputs
  const weatherRisk = Math.min(95, Math.max(10, Math.round(Math.abs(inputs.rainfallMm - 1000) / 15 + Math.abs(inputs.temperatureC - 25) * 3)));
  const soilRisk = Math.min(90, Math.max(10, Math.round(Math.abs(inputs.soilPh - 6.5) * 20)));
  const waterRisk = inputs.waterAvailability === "Low" ? 82 : inputs.waterAvailability === "Moderate" ? 45 : 20;
  const marketRisk = inputs.selectedCrop === "cotton" ? 78 : inputs.selectedCrop === "rice" ? 35 : 52;
  const yieldRisk = Math.min(92, Math.max(15, Math.round((weatherRisk + soilRisk + waterRisk) / 3)));
  const economicRisk = Math.min(95, Math.max(15, Math.round((marketRisk + yieldRisk) / 2)));

  const prePlantingRiskScore = Math.round((weatherRisk + soilRisk + waterRisk + marketRisk + yieldRisk + economicRisk) / 6);
  const prePlantingRiskLevel = classifyRisk(prePlantingRiskScore);

  const heavyRainRisk = inputs.rainfallMm > 1200 ? 75 : 25;
  const heatStressRisk = inputs.temperatureC > 32 ? 85 : inputs.temperatureC > 28 ? 55 : 20;
  const waterStressRisk = waterRisk;
  const diseaseRisk = inputs.rainfallMm > 900 && inputs.temperatureC > 28 ? 78 : 30;
  const pestRisk = inputs.selectedCrop === "cotton" ? 82 : 40;

  const farmRiskScore = Math.round((heavyRainRisk + heatStressRisk + waterStressRisk + diseaseRisk + pestRisk) / 5);
  const farmRiskLevel = classifyRisk(farmRiskScore);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-risk">{t("risk.centralIntelligence")}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">{t("risk.title")}</h1>
        <p className="mt-2 text-slate-600">
          {t("risk.subtitle")}
        </p>
      </header>

      <CustomInputPanel />

      {/* BEFORE PLANTING / AFTER PLANTING Architecture Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("before")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all active:scale-95 cursor-pointer ${
            activeTab === "before"
              ? "bg-slate-950 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Sprout size={18} className={activeTab === "before" ? "text-emerald-400" : ""} />
          {t("risk.beforePlantingTab")}
        </button>

        <button
          onClick={() => setActiveTab("after")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all active:scale-95 cursor-pointer ${
            activeTab === "after"
              ? "bg-slate-950 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <LineChart size={18} className={activeTab === "after" ? "text-sky-400" : ""} />
          {t("risk.afterPlantingTab")}
        </button>
      </div>

      {/* TAB 1: BEFORE PLANTING - CROP & CULTIVATION RISK */}
      {activeTab === "before" && (
        <div className="mt-6 space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard title={t("risk.overallCultivationRisk")} value={`${prePlantingRiskScore}/100`} detail={`${t("risk.targetCrop")}: ${getCropName(inputs.selectedCrop)}`}>
              <RiskBadge level={prePlantingRiskLevel} />
            </MetricCard>
            <MetricCard title={t("risk.marketVolatility")} value={getRiskLevelLabel(marketRisk > 60 ? "HIGH" : "MODERATE")} detail={t("risk.marketUncertainty")} />
            <MetricCard title={t("risk.yieldSuitabilityFit")} value={`${100 - yieldRisk}%`} detail={`Soil pH ${inputs.soilPh} | NPK ${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}`} />
          </section>

          <Card className="border-2 border-crop/30 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <CardTitle>{t("risk.beforePlantingBreakdown")}</CardTitle>
                <p className="text-xs text-slate-500">{t("risk.answersBeforePlanting", { crop: getCropName(inputs.selectedCrop) })}</p>
              </div>
              <RiskBadge level={prePlantingRiskLevel} />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><Sun size={15} className="text-amber-500" /> {t("risk.weatherRisk")}</span>
                  <span className="font-extrabold text-sm text-slate-900">{weatherRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{t("customInput.rainfall")}: {inputs.rainfallMm}mm | {t("customInput.temperature")}: {inputs.temperatureC}°C</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><Sprout size={15} className="text-emerald-500" /> {t("risk.soilRisk")}</span>
                  <span className="font-extrabold text-sm text-slate-900">{soilRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">Soil pH: {inputs.soilPh} | NPK: {inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><Droplets size={15} className="text-sky-500" /> {t("risk.waterAvailability")}</span>
                  <span className="font-extrabold text-sm text-slate-900">{waterRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{t("customInput.waterAvailability")}: {getRiskLevelLabel(inputs.waterAvailability)}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><TrendingDown size={15} className="text-indigo-500" /> {t("risk.marketPriceRisk")}</span>
                  <span className="font-extrabold text-sm text-slate-900">{marketRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{t("risk.mandiesFluctuation")}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><Wheat size={15} className="text-amber-600" /> {t("risk.yieldLossRisk")}</span>
                  <span className="font-extrabold text-sm text-slate-900">{yieldRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{t("risk.estimatedYieldVariability")}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><DollarSign size={15} className="text-emerald-600" /> {t("risk.economicRisk")}</span>
                  <span className="font-extrabold text-sm text-slate-900">{economicRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{t("risk.returnOnInvestment")}</p>
              </div>

            </div>
          </Card>

          <section className="grid gap-4 xl:grid-cols-2">
            <Card><CardTitle>{t("risk.historicalTrend")}</CardTitle><RiskTrendChart /></Card>
            <Card><CardTitle>{t("risk.categoryWeighting")}</CardTitle><CategoryBars risk={cropRisk} /></Card>
          </section>
        </div>
      )}

      {/* TAB 2: AFTER PLANTING - FARM FIELD RISK */}
      {activeTab === "after" && (
        <div className="mt-6 space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard title="Active Farm Field Risk" value={`${farmRiskScore}/100`} detail={`${t("common.farm")}: ${farm.name}`}>
              <RiskBadge level={farmRiskLevel} />
            </MetricCard>
            <MetricCard title="Primary Field Threat" value={diseaseRisk > 70 ? "Fungal Leaf Blight" : "Water Stress"} detail="Immediate field monitoring required" />
            <MetricCard title={t("dashboard.cropHealthIndex")} value="78/100" detail={`${t("common.stage")}: ${getGrowthStageLabel(activeCropCycle.stage)}`} />
          </section>

          <Card className="border-2 border-sky-300 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <CardTitle>{t("risk.afterPlantingBreakdown")} — {farm.name}</CardTitle>
                <p className="text-xs text-slate-500">{t("risk.answersAfterPlanting", { crop: getCropName(inputs.selectedCrop) })}</p>
              </div>
              <RiskBadge level={farmRiskLevel} />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><CloudRain size={15} className="text-sky-500" /> Rainfall Deficit</span>
                  <span className="font-extrabold text-sm text-slate-900">{heavyRainRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{inputs.rainfallMm}mm annual rainfall</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><Thermometer size={15} className="text-red-500" /> Heat Stress</span>
                  <span className="font-extrabold text-sm text-slate-900">{heatStressRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{inputs.temperatureC}°C ambient temp</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><Droplets size={15} className="text-blue-500" /> Water Stress</span>
                  <span className="font-extrabold text-sm text-slate-900">{waterStressRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{t("customInput.waterAvailability")}: {getRiskLevelLabel(inputs.waterAvailability)}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><ShieldAlert size={15} className="text-purple-500" /> Disease Threat</span>
                  <span className="font-extrabold text-sm text-slate-900">{diseaseRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">Fungal early blight risk</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><AlertTriangle size={15} className="text-amber-500" /> Pest Vulnerability</span>
                  <span className="font-extrabold text-sm text-slate-900">{pestRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">Stem borer & thrips monitoring</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><BarChart3 size={15} className="text-emerald-500" /> Yield Loss Risk</span>
                  <span className="font-extrabold text-sm text-slate-900">{yieldRisk}/100</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">Predicted crop yield impact</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-sky-50 p-4 border border-sky-100">
              <p className="font-bold text-sky-950 text-sm">Recommended Field Action:</p>
              <p className="mt-1 text-xs text-sky-800 leading-5">
                Maintain optimal irrigation monitoring over the next 48 hours to protect tillering during the {getGrowthStageLabel(activeCropCycle.stage)} stage.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

