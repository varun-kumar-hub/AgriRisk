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
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function SimulatorPage() {
  const { farm, cropRisk, recommendations, inputs } = useUserInput();
  const { t, getCropName, getRiskLevelLabel } = useTranslation();

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
        <p className="text-sm font-medium text-water">{t("simulator.category")}</p>
        <h1 className="mt-1 text-3xl font-bold">{t("simulator.title")}</h1>
        <p className="mt-2 text-slate-600">
          {t("simulator.subtitle")}
        </p>
      </header>

      <CustomInputPanel />

      {/* Simulator Key Metrics */}
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title={t("simulator.baselineRisk")} value={`${baselineRisk}/100`} detail={t("simulator.currentInputs")} />
        <MetricCard title={t("simulator.simulatedRisk")} value={`${simulatedRisk}/100`} detail={`Under ${tempChange >= 0 ? `+${tempChange}` : tempChange}°C / ${rainfallChange}% rain`}>
          <RiskBadge level={simulatedLevel} />
        </MetricCard>
        <MetricCard title={t("simulator.yieldImpact")} value={`${baselineYield} → ${simulatedYield}`} detail={t("simulator.estimated")} />
        <MetricCard title={t("simulator.potentialLoss")} value={formatCurrency(totalPotentialLoss)} detail={t("simulator.forAcres", { acres: farm.areaAcres })} />
      </section>

      {/* Interactive Controls & Scenario Analysis */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Card className="border-2 border-slate-200 shadow-md">
          <div className="flex items-center justify-between border-b pb-3">
            <CardTitle className="flex items-center gap-2">
              <Sliders size={18} className="text-crop" /> {t("simulator.scenarioControls")}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw size={14} /> {t("simulator.reset")}
            </Button>
          </div>

          <div className="mt-5 space-y-6">
            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span>{t("simulator.rainfallDelta")}</span>
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
                <span>{t("simulator.droughtLabel")}</span>
                <span>{t("simulator.normalLabel")}</span>
                <span>{t("simulator.heavyRainLabel")}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span>{t("simulator.tempAnomaly")}</span>
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
                <span>{t("simulator.coolerLabel")}</span>
                <span>{t("simulator.normalLabel")}</span>
                <span>{t("simulator.heatwaveLabel")}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span>{t("simulator.irrigationBoost")}</span>
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
                <span>{t("simulator.standardLabel")}</span>
                <span>{t("simulator.extraWatering")}</span>
                <span>{t("simulator.dripIrrigation")}</span>
              </div>
            </div>

            <Button onClick={handleSimulate} loading={loading} className="w-full">
              <Play size={16} /> {t("simulator.runSimulationBtn")}
            </Button>
          </div>
        </Card>

        {/* Simulation Output Card */}
        <Card className="border-2 border-crop/30 bg-white shadow-xl flex flex-col justify-between">
          <div>
            <CardTitle>{t("simulator.simulationIntelligence")}</CardTitle>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-3">
              <p className="text-base leading-7 text-slate-800">
                {t("simulator.simDesc", {
                  rain: rainfallChange,
                  temp: tempChange,
                  crop: getCropName(inputs.selectedCrop),
                  base: baselineRisk,
                  sim: simulatedRisk,
                  level: getRiskLevelLabel(simulatedLevel)
                })}
              </p>
              <p className="text-sm text-slate-600">
                {t("simulator.yieldDesc", {
                  baseYield: baselineYield,
                  simYield: simulatedYield,
                  loss: formatCurrency(totalPotentialLoss),
                  acres: farm.areaAcres
                })}
              </p>
            </div>

            <div className="mt-5 rounded-xl bg-emerald-50 p-4 border border-emerald-100">
              <p className="font-bold text-emerald-950 text-sm">{t("simulator.recommendedIntervention")}</p>
              <p className="mt-1 text-xs text-emerald-800 leading-5">
                {t("simulator.interventionDesc", { boost: irrigationBoost, mitigation: irrigationMitigation })}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 text-xs text-slate-500 flex justify-between items-center">
            <span>{t("simulator.engineFooter")}</span>
            <span className="font-bold text-slate-700">{t("common.crop")}: {getCropName(inputs.selectedCrop)}</span>
          </div>
        </Card>
      </section>
    </div>
  );
}

