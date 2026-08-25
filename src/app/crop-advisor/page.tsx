"use client";

import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { HistoricalTrendsVisualizer } from "@/components/analytics/historical-trends";
import { CropCard } from "@/components/crop-advisor/crop-card";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { useToast } from "@/components/providers/toast-provider";
import { ApiProgressStepper, ProgressStep } from "@/components/ui/api-progress-stepper";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { getCropBenchmarkStats, getHistoricalYieldTrends } from "@/lib/data/historical-dataset";

const ANALYSIS_STEPS: ProgressStep[] = [
  { id: "1", label: "Farm location identified & geocoded" },
  { id: "2", label: "Soil test profile & N-P-K levels loaded" },
  { id: "3", label: "Historical 50,000+ crop records retrieved" },
  { id: "4", label: "Analyzing crop suitability fit & water demand" },
  { id: "5", label: "Calculating risk index & market return" }
];

export default function CropAdvisorPage() {
  const { farm, recommendations, inputs } = useUserInput();
  const toast = useToast();

  const [analyzing, setAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const stats = getCropBenchmarkStats(inputs.selectedCrop);
  const trends = getHistoricalYieldTrends(inputs.selectedCrop);

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setCurrentStepIndex(0);
    setProgressPercent(15);
    toast.info("Analyzing farm conditions...", "Loading soil, climate, and historical dataset records.");

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        setProgressPercent(Math.min(100, (next + 1) * 20));

        if (next >= ANALYSIS_STEPS.length) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setAnalyzing(false);
            toast.success("Crop Suitability Analysis Complete", "Recommendations updated based on live farm inputs.");
          }, 400);
        }
        return next;
      });
    }, 450);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-crop">Before planting intelligence</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Crop Advisor</h1>
          <p className="mt-1 max-w-3xl text-slate-600">
            AgriRisk evaluates your soil, water, season, weather, market, yield, and economic context to answer what you should grow.
          </p>
        </div>

        <Button onClick={handleRunAnalysis} loading={analyzing}>
          <RefreshCw size={16} /> Re-Analyze Farm
        </Button>
      </header>

      <CustomInputPanel />

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
            <CardTitle>Farm Inputs Context</CardTitle>
            <span className="text-xs font-bold text-crop bg-crop/10 px-2.5 py-1 rounded-full">
              Live Profile
            </span>
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Farm Name</dt><dd className="font-semibold">{farm.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Location</dt><dd className="font-semibold">{farm.location}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Area</dt><dd className="font-semibold">{farm.areaAcres} acres</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Soil pH / Type</dt><dd className="font-semibold">{inputs.soilPh} / {farm.soilType}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Soil N-P-K</dt><dd className="font-semibold">{inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium} kg/ha</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Water Level</dt><dd className="font-semibold">{inputs.waterAvailability}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Temp / Rain</dt><dd className="font-semibold">{inputs.temperatureC}°C / {inputs.rainfallMm}mm</dd></div>
          </dl>

          <div className="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Sparkles className="text-crop shrink-0" size={18} />
            <span>Powered by 50,000+ historical crop yield and climate records across India.</span>
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
