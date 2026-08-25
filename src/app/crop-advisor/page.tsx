"use client";

import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { HistoricalTrendsVisualizer } from "@/components/analytics/historical-trends";
import { CropCard } from "@/components/crop-advisor/crop-card";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { TargetCropStatusBanner } from "@/components/crop-advisor/target-crop-banner";
import { useUserInput } from "@/components/providers/user-input-provider";
import { useToast } from "@/components/providers/toast-provider";
import { ApiProgressStepper, ProgressStep } from "@/components/ui/api-progress-stepper";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { getCropBenchmarkStats, getHistoricalYieldTrends } from "@/lib/data/historical-dataset";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function CropAdvisorPage() {
  const { farm, recommendations, inputs, refreshAiPredictions, loadingAi } = useUserInput();
  const toast = useToast();
  const { t, getRiskLevelLabel } = useTranslation();

  const [analyzing, setAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const ANALYSIS_STEPS: ProgressStep[] = [
    { id: "1", label: t("cropAdvisor.step1") },
    { id: "2", label: t("cropAdvisor.step2") },
    { id: "3", label: t("cropAdvisor.step3") },
    { id: "4", label: t("cropAdvisor.step4") },
    { id: "5", label: t("cropAdvisor.step5") }
  ];

  const stats = getCropBenchmarkStats(inputs.selectedCrop);
  const trends = getHistoricalYieldTrends(inputs.selectedCrop);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setCurrentStepIndex(0);
    setProgressPercent(15);
    toast.info(t("cropAdvisor.analyzingToastTitle"), t("cropAdvisor.analyzingToastDesc"));

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        setProgressPercent(Math.min(95, (next + 1) * 20));
        if (next >= ANALYSIS_STEPS.length - 1) {
          clearInterval(stepInterval);
        }
        return next;
      });
    }, 400);

    try {
      await refreshAiPredictions();
    } finally {
      clearInterval(stepInterval);
      setCurrentStepIndex(ANALYSIS_STEPS.length - 1);
      setProgressPercent(100);
      setTimeout(() => {
        setAnalyzing(false);
        toast.success(t("cropAdvisor.completeToastTitle"), t("cropAdvisor.completeToastDesc"));
      }, 300);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-crop">{t("navigation.beforePlanting")}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">{t("cropAdvisor.title")}</h1>
          <p className="mt-1 max-w-3xl text-slate-600">
            {t("cropAdvisor.headerSubtitle")}
          </p>
        </div>

        <Button onClick={handleRunAnalysis} loading={analyzing || loadingAi}>
          <RefreshCw size={16} /> {t("cropAdvisor.reAnalyzeFarm")}
        </Button>
      </header>

      <CustomInputPanel />

      <TargetCropStatusBanner />

      {/* Step-by-Step API Progress Communicator */}
      {analyzing && (
        <div className="my-6">
          <ApiProgressStepper
            steps={ANALYSIS_STEPS}
            currentStepIndex={currentStepIndex}
            progressPercent={progressPercent}
          />
        </div>
      )}

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_2fr]">
        <Card className="border border-slate-200">
          <div className="flex items-center justify-between border-b pb-3">
            <CardTitle>{t("cropAdvisor.inputsContext")}</CardTitle>
            <span className="text-xs font-bold text-crop bg-crop/10 px-2.5 py-1 rounded-full">
              {t("cropAdvisor.liveProfile")}
            </span>
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{t("customInput.farmName")}</dt><dd className="font-semibold">{farm.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{t("common.location")}</dt><dd className="font-semibold">{farm.location}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{t("common.area")}</dt><dd className="font-semibold">{farm.areaAcres} {t("farms.acres")}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{t("farms.soilPh")}</dt><dd className="font-semibold">{inputs.soilPh} / {farm.soilType}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Soil N-P-K</dt><dd className="font-semibold">{inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium} kg/ha</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{t("customInput.waterAvailability")}</dt><dd className="font-semibold">{getRiskLevelLabel(inputs.waterAvailability)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{t("common.temp")} / {t("common.rain")}</dt><dd className="font-semibold">{inputs.temperatureC}°C / {inputs.rainfallMm}mm</dd></div>
          </dl>

          <div className="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Sparkles className="text-crop shrink-0" size={18} />
            <span>{t("cropAdvisor.poweredBy50k")}</span>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((crop) => (
            <CropCard key={crop.crop} crop={crop} />
          ))}
        </div>
      </section>

      <HistoricalTrendsVisualizer initialStats={stats} trendsData={trends} />
    </div>
  );
}

