"use client";

import { CloudSun, Thermometer, CloudRain, Wind, AlertTriangle, Droplets } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function ClimateIntelligencePage() {
  const { inputs } = useUserInput();
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-crop">{t("navigation.agriIntelligence")}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">{t("navigation.climateIntelligence")} — {inputs.distName}</h1>
        <p className="mt-2 text-slate-600">
          Real-time weather radar, thermal stress anomalies, monsoon rainfall deficit metrics, and extreme weather risk predictions.
        </p>
      </header>

      <CustomInputPanel />

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title="Ambient Temperature" value={`${inputs.temperatureC}°C`} detail="Normal range 22-28°C" />
        <MetricCard title="Monsoon Rainfall" value={`${inputs.rainfallMm} mm`} detail="Annual precipitation record" />
        <MetricCard title="Evapotranspiration" value="4.2 mm/day" detail="Moderate moisture loss" />
        <MetricCard title="Climate Risk Index" value={inputs.rainfallMm < 800 ? "75/100" : "28/100"} detail="Dynamic climate risk"><RiskBadge level={inputs.rainfallMm < 800 ? "HIGH" : "LOW"} /></MetricCard>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <CloudRain size={20} className="text-sky-500" />
            RAINFALL DEFICIT & MOISTURE STRESS ANOMALY
          </CardTitle>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Seasonal Accumulation</span><span className="font-bold">{inputs.rainfallMm} mm</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Historical 30-Yr Benchmark</span><span className="font-bold">1,050 mm</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Precipitation Anomaly</span><span className={`font-bold ${inputs.rainfallMm < 900 ? "text-amber-600" : "text-emerald-600"}`}>{inputs.rainfallMm < 900 ? `- ${1050 - inputs.rainfallMm} mm Deficit` : "+ Optimal"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Monsoon Forecast (14 Days)</span><span className="font-bold text-sky-600">Scattered Light Showers</span></div>
          </div>
        </Card>

        <Card className="border border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Thermometer size={20} className="text-red-500" />
            THERMAL STRESS & CANOPY HEAT INDEX
          </CardTitle>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Current Field Temperature</span><span className="font-bold">{inputs.temperatureC}°C</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Optimal Canopy Range</span><span className="font-bold">24°C - 28°C</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Heatwave Vulnerability</span><span className="font-bold text-emerald-600">Low Risk</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Relative Humidity</span><span className="font-bold">68%</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
