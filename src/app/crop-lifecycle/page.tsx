"use client";

import { Calendar, CheckCircle2, Clock, Sprout, Tractor, Milestone } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function CropLifecyclePage() {
  const { farm, activeCropCycle, cropRisk, inputs } = useUserInput();
  const { t, getCropName, getGrowthStageLabel, getSeasonLabel } = useTranslation();

  const stages = [
    {
      stage: "Sowing / Germination",
      days: "Days 1-14",
      status: "COMPLETED",
      desc: "Seed emergence and early root establishment.",
      milestone: "100% germination achieved"
    },
    {
      stage: "Vegetative Phase",
      days: "Days 15-45",
      status: "ACTIVE",
      desc: "Active tillering, stem elongation & leaf canopy biomass expansion.",
      milestone: `Current phase · Day ${activeCropCycle.ageDays}`
    },
    {
      stage: "Flowering & Panicle Initiation",
      days: "Days 46-75",
      status: "UPCOMING",
      desc: "Reproductive phase requiring optimal N-P-K nutrient balance and moisture.",
      milestone: "Expected in ~18 days"
    },
    {
      stage: "Grain Filling & Ripening",
      days: "Days 76-110",
      status: "UPCOMING",
      desc: "Starch accumulation, grain hardiness, and field drainage prep.",
      milestone: "Expected in ~45 days"
    },
    {
      stage: "Harvest & Post-Harvest",
      days: "Days 111-120",
      status: "UPCOMING",
      desc: "Combine harvesting, moisture content testing, and mandi transport.",
      milestone: "Expected in ~75 days"
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-crop">{t("navigation.cropManagement")}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">{t("navigation.cropLifecycle")} — {getCropName(activeCropCycle.crop)}</h1>
        <p className="mt-2 text-slate-600">
          Track growth milestones, sowing age, active crop stage, and field intervention timelines.
        </p>
      </header>

      <CustomInputPanel />

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title="Current Stage" value={getGrowthStageLabel(activeCropCycle.stage)} detail={`Day ${activeCropCycle.ageDays} since sowing`} />
        <MetricCard title="Season & Cycle" value={getSeasonLabel(activeCropCycle.season)} detail={`Sown on ${inputs.sowingDate}`} />
        <MetricCard title="Field Moisture" value={inputs.waterAvailability} detail={`${farm.irrigationType}`} />
        <MetricCard title="Stage Risk Level" value={`${cropRisk.overallScore}/100`} detail="Dynamic risk evaluation"><RiskBadge level={cropRisk.level} /></MetricCard>
      </section>

      <Card className="mt-6">
        <CardTitle className="flex items-center gap-2">
          <Milestone size={20} className="text-crop" />
          CROP GROWTH STAGE TIMELINE & MILESTONES
        </CardTitle>

        <div className="mt-6 space-y-6">
          {stages.map((stg, idx) => (
            <div key={idx} className="relative flex items-start gap-4 pb-6 last:pb-0 border-l-2 border-slate-200 pl-6 last:border-l-0">
              <span className={`absolute -left-[17px] top-0 grid size-8 place-items-center rounded-full text-white shadow-md ${
                stg.status === "COMPLETED" ? "bg-emerald-600" : stg.status === "ACTIVE" ? "bg-crop ring-4 ring-crop/20" : "bg-slate-300"
              }`}>
                {stg.status === "COMPLETED" ? <CheckCircle2 size={16} /> : stg.status === "ACTIVE" ? <Sprout size={16} /> : <Clock size={16} />}
              </span>

              <div className="flex-1 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{stg.stage}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">{stg.days}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      stg.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : stg.status === "ACTIVE" ? "bg-crop/20 text-crop" : "bg-slate-200 text-slate-600"
                    }`}>
                      {stg.status}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-6">{stg.desc}</p>
                <p className="mt-3 text-xs font-bold text-slate-700 bg-white p-2 rounded-xl border border-slate-200 inline-block">
                  📌 {stg.milestone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
