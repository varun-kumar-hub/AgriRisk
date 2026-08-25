"use client";

import { HistoricalTrendsVisualizer } from "@/components/analytics/historical-trends";
import { CropCard } from "@/components/crop-advisor/crop-card";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { getCropBenchmarkStats, getHistoricalYieldTrends } from "@/lib/data/historical-dataset";

export default function CropAdvisorPage() {
  const { farm, recommendations, inputs } = useUserInput();
  const stats = getCropBenchmarkStats(inputs.selectedCrop);
  const trends = getHistoricalYieldTrends(inputs.selectedCrop);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-crop">Before planting</p>
        <h1 className="mt-1 text-3xl font-bold">Crop Advisor</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          AgriRisk evaluates your soil, water, season, weather, market, yield, and economic context to answer what you should grow.
        </p>
      </header>

      <CustomInputPanel />

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_2fr]">
        <Card>
          <CardTitle>Farm Inputs</CardTitle>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Farm</dt><dd className="font-medium">{farm.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Location</dt><dd className="font-medium">{farm.location}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Area</dt><dd className="font-medium">{farm.areaAcres} acres</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Soil</dt><dd className="font-medium">{farm.soilType}, pH {farm.soilPh}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Soil N-P-K</dt><dd className="font-medium">{inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium} kg/ha</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Water</dt><dd className="font-medium">{farm.waterAvailability}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Temp / Rain</dt><dd className="font-medium">{inputs.temperatureC}°C / {inputs.rainfallMm}mm</dd></div>
          </dl>
          <p className="mt-5 rounded-md bg-slate-100 p-3 text-sm text-slate-600">
            Powered by 50,000+ historical crop yield and climate records.
          </p>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((crop) => <CropCard key={crop.crop} crop={crop} />)}
        </div>
      </section>
      <HistoricalTrendsVisualizer initialStats={stats} trendsData={trends} />
    </div>
  );
}


