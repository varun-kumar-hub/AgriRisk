"use client";

import { Activity, AlertTriangle, CheckCircle2, CloudRain, Droplets, Leaf, ShieldAlert, Sun, Thermometer } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";

export default function CropHealthPage() {
  const { farm, activeCropCycle, cropRisk, inputs } = useUserInput();

  // Calculate dynamic vegetation health metrics based on soil & weather inputs
  const ndviIndex = Math.round((0.78 - (cropRisk.overallScore / 100) * 0.25) * 100) / 100;
  const leafChlorophyll = Math.round(42 - (inputs.temperatureC > 30 ? 6 : 0) - (inputs.nitrogen < 15 ? 8 : 0));
  const canopyCoverPct = Math.min(95, Math.max(40, 75 - (inputs.rainfallMm < 400 ? 15 : 0)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-crop">After Planting Intelligence</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Crop Health Monitor — {farm.name}</h1>
        <p className="mt-2 text-slate-600">
          Field-level canopy vigour, leaf moisture stress, disease monitoring, and growth milestone tracking for <strong className="capitalize">{inputs.selectedCrop}</strong>.
        </p>
      </header>

      <CustomInputPanel />

      {/* Vital Health Metrics */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="NDVI Vegetation Index" value={ndviIndex.toString()} detail="Normal range: 0.65 - 0.85">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Healthy Canopy</span>
        </MetricCard>
        <MetricCard title="Leaf Chlorophyll" value={`${leafChlorophyll} SPAD`} detail={`Soil Nitrogen: ${inputs.nitrogen} kg/ha`}>
          <span className="text-xs font-bold text-crop bg-crop/10 px-2 py-0.5 rounded-md">Good Vigour</span>
        </MetricCard>
        <MetricCard title="Canopy Coverage" value={`${canopyCoverPct}%`} detail={`Stage: ${activeCropCycle.stage}`}>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">Active Tillering</span>
        </MetricCard>
        <MetricCard title="Field Stress Level" value={`${cropRisk.overallScore}/100`} detail={`Temp: ${inputs.temperatureC}°C | Rain: ${inputs.rainfallMm}mm`}>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Moderate Stress</span>
        </MetricCard>
      </section>

      {/* Detailed Crop Vigour & Disease Risk Diagnostics */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="border-2 border-crop/30 bg-white shadow-md">
          <div className="flex items-center justify-between border-b pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-crop" size={20} /> Field Health & Stress Indicators
            </CardTitle>
            <span className="text-xs font-bold text-slate-500">Live Crop Diagnostic</span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                    <Leaf size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">Nitrogen & Nutrient Absorption</h3>
                    <p className="text-xs text-slate-500">N-P-K Applied: {inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium} kg/ha</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={14} /> Optimal
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Leaf nitrogen levels are sufficient for current vegetative biomass expansion.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-sky-100 text-sky-800">
                    <Droplets size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">Water Deficit & Stomatal Stress</h3>
                    <p className="text-xs text-slate-500">Water Availability: {inputs.waterAvailability} ({inputs.rainfallMm} mm annual)</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                  <AlertTriangle size={14} /> Monitor Closely
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Transpiration stress is elevated during peak afternoon temperatures ({inputs.temperatureC}°C). Ensure soil saturation.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-red-100 text-red-800">
                    <ShieldAlert size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">Fungal & Pest Outbreak Risk</h3>
                    <p className="text-xs text-slate-500">Relative Humidity: 75% | Temp: {inputs.temperatureC}°C</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                  <AlertTriangle size={14} /> Disease Risk
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Warm humid conditions increase early blight & stem borer vulnerability. Inspect leaf undersides every 48 hours.
              </p>
            </div>
          </div>
        </Card>

        {/* Growth Stage Milestone Timeline */}
        <Card className="border-2 border-slate-200 bg-white shadow-md">
          <CardTitle>Crop Growth Milestone Timeline</CardTitle>
          <div className="mt-5 space-y-6">
            <div className="relative pl-6 border-l-2 border-crop">
              <span className="absolute -left-[9px] top-0 size-4 rounded-full bg-crop" />
              <p className="text-xs font-bold text-crop uppercase">Stage 1 · Germination</p>
              <h4 className="font-bold text-slate-900 text-sm">Seedling Emergence</h4>
              <p className="text-xs text-slate-500">Completed · 100% germination rate</p>
            </div>

            <div className="relative pl-6 border-l-2 border-crop">
              <span className="absolute -left-[9px] top-0 size-4 rounded-full bg-crop" />
              <p className="text-xs font-bold text-crop uppercase">Stage 2 · Vegetative (Active)</p>
              <h4 className="font-bold text-slate-900 text-sm">Tillering & Leaf Development</h4>
              <p className="text-xs text-slate-600">Current active growth phase. Maintain NPK balance.</p>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-200">
              <span className="absolute -left-[9px] top-0 size-4 rounded-full bg-slate-300" />
              <p className="text-xs font-bold text-slate-400 uppercase">Stage 3 · Flowering</p>
              <h4 className="font-bold text-slate-700 text-sm">Panicle Initiation</h4>
              <p className="text-xs text-slate-400">Upcoming in 18 days</p>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-200">
              <span className="absolute -left-[9px] top-0 size-4 rounded-full bg-slate-300" />
              <p className="text-xs font-bold text-slate-400 uppercase">Stage 4 · Harvest</p>
              <h4 className="font-bold text-slate-700 text-sm">Maturity & Grain Ripening</h4>
              <p className="text-xs text-slate-400">Expected in 45 days</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
