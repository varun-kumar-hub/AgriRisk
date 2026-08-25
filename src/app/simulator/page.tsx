"use client";

import { useState } from "react";
import { Play, RotateCcw, Sliders } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { classifyRisk, formatCurrency } from "@/lib/scoring/risk";

export default function SimulatorPage() {
  const { farm, cropRisk, recommendations, inputs } = useUserInput();

  const [rainfallChange, setRainfallChange] = useState(-20); // -20%
  const [tempChange, setTempChange] = useState(2); // +2 °C
  const [irrigationBoost, setIrrigationBoost] = useState(10); // +10%
  const [loading, setLoading] = useState(false);

  // Dynamic calculations based on user input & sliders
  const baselineRisk = cropRisk.overallScore;

  const tempImpact = tempChange * 4;
  const rainImpact = Math.abs(Math.min(0, rainfallChange)) * 0.8;
  const irrigationMitigation = irrigationBoost * 0.5;

  const simulatedRisk = Math.max(10, Math.min(98, Math.round(baselineRisk + tempImpact + rainImpact - irrigationMitigation)));
  const simulatedLevel = classifyRisk(simulatedRisk);

  const selectedCropRec = recommendations.find((r) => r.crop.toLowerCase() === inputs.selectedCrop.toLowerCase()) || recommendations[0];
  const baselineYield = selectedCropRec.expectedYield;
  const yieldLossPct = Math.round(((simulatedRisk - baselineRisk) / 100) * 40);
  const simulatedYield = Math.max(0.5, Math.round(baselineYield * (1 - yieldLossPct / 100) * 10) / 10);

  const lossPerAcre = Math.round((baselineYield - simulatedYield) * 18000);
  const totalPotentialLoss = lossPerAcre * farm.areaAcres;

  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const handleReset = () => {
    setRainfallChange(-20);
    setTempChange(2);
    setIrrigationBoost(10);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-water">What-if decision intelligence</p>
        <h1 className="mt-1 text-3xl font-bold">Interactive Farm Simulator</h1>
        <p className="mt-2 text-slate-600">
          Simulate weather stress, climate anomalies, and irrigation interventions to model real-time risk & economic impacts.
        </p>
      </header>

      <CustomInputPanel />

      {/* Simulator Key Metrics */}
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title="Baseline Risk" value={`${baselineRisk}/100`} detail="Current farm inputs" />
        <MetricCard title="Simulated Risk" value={`${simulatedRisk}/100`} detail={`Under ${tempChange >= 0 ? `+${tempChange}` : tempChange}°C / ${rainfallChange}% rain`}>
          <RiskBadge level={simulatedLevel} />
        </MetricCard>
        <MetricCard title="Yield Impact" value={`${baselineYield} → ${simulatedYield}`} detail="t/ha estimated" />
        <MetricCard title="Potential Loss" value={formatCurrency(totalPotentialLoss)} detail={`For ${farm.areaAcres} acres`} />
      </section>

      {/* Interactive Controls & Scenario Analysis */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Card className="border-2 border-slate-200 shadow-md">
          <div className="flex items-center justify-between border-b pb-3">
            <CardTitle className="flex items-center gap-2">
              <Sliders size={18} className="text-crop" /> Scenario Controls
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw size={14} /> Reset
            </Button>
          </div>

          <div className="mt-5 space-y-6">
            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Rainfall Delta (%)</span>
                <span className={rainfallChange < 0 ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>
                  {rainfallChange > 0 ? `+${rainfallChange}` : rainfallChange}%
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={rainfallChange}
                onChange={(e) => setRainfallChange(parseInt(e.target.value, 10))}
                className="mt-2 w-full accent-crop cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>-50% Drought</span>
                <span>Normal (0%)</span>
                <span>+50% Heavy Rain</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Temperature Anomaly (°C)</span>
                <span className={tempChange > 0 ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>
                  {tempChange > 0 ? `+${tempChange}` : tempChange} °C
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="8"
                step="1"
                value={tempChange}
                onChange={(e) => setTempChange(parseInt(e.target.value, 10))}
                className="mt-2 w-full accent-crop cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>-5°C Cooler</span>
                <span>Normal (0°C)</span>
                <span>+8°C Heatwave</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Irrigation Boost (%)</span>
                <span className="text-emerald-600 font-bold">+{irrigationBoost}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={irrigationBoost}
                onChange={(e) => setIrrigationBoost(parseInt(e.target.value, 10))}
                className="mt-2 w-full accent-crop cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0% Standard</span>
                <span>+25% Extra Watering</span>
                <span>+50% Drip Irrigation</span>
              </div>
            </div>

            <Button onClick={handleSimulate} loading={loading} className="w-full">
              <Play size={16} /> Run What-If Simulation
            </Button>
          </div>
        </Card>

        {/* Simulation Output Card */}
        <Card className="border-2 border-crop/30 bg-white shadow-xl flex flex-col justify-between">
          <div>
            <CardTitle>Simulation Intelligence & Risk Breakdown</CardTitle>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-3">
              <p className="text-base leading-7 text-slate-800">
                Simulating a <strong>{rainfallChange}% rainfall change</strong> and a <strong>+{tempChange}°C temperature change</strong> for{" "}
                <strong className="capitalize">{inputs.selectedCrop}</strong> increases agricultural risk from <strong>{baselineRisk}/100</strong> to{" "}
                <strong>{simulatedRisk}/100</strong> ({simulatedLevel}).
              </p>
              <p className="text-sm text-slate-600">
                Expected yield per hectare changes from {baselineYield} t/ha to {simulatedYield} t/ha, resulting in an estimated revenue impact of{" "}
                <strong>{formatCurrency(totalPotentialLoss)}</strong> across your {farm.areaAcres} acre farm.
              </p>
            </div>

            <div className="mt-5 rounded-xl bg-emerald-50 p-4 border border-emerald-100">
              <p className="font-bold text-emerald-950 text-sm">Recommended Intervention:</p>
              <p className="mt-1 text-xs text-emerald-800 leading-5">
                Applying a +{irrigationBoost}% irrigation boost reduces risk impact by {irrigationMitigation} points. Inspect soil moisture every 48 hours to protect tillering during the Vegetative stage.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 text-xs text-slate-500 flex justify-between items-center">
            <span>Powered by AgriRisk What-If Decision Engine</span>
            <span className="font-bold text-slate-700">Crop: {inputs.selectedCrop.toUpperCase()}</span>
          </div>
        </Card>
      </section>
    </div>
  );
}
