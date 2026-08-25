"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Sprout, Tractor } from "lucide-react";
import { RiskTrendChart } from "@/components/charts/risk-trend-chart";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { alerts, cropHealth, recommendations } from "@/lib/mock/data";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function DashboardPage() {
  const { farm, cropRisk, inputs } = useUserInput();
  const { t, getCropName, getRiskLevelLabel } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-crop">{t("dashboard.kharifLocation", { location: farm.location })}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">{t("dashboard.greeting", { name: "Varun" })}</h1>
          <p className="mt-1 text-slate-600">{t("dashboard.overviewFor", { farm: farm.name })}</p>
        </div>
        <p className="text-sm text-slate-500">{t("dashboard.predictionUpdatedLive")}</p>
      </header>

      <CustomInputPanel />

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Link href="/crop-advisor" className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 hover:bg-emerald-100">
          <Sprout className="text-crop" />
          <h2 className="mt-4 text-xl font-semibold">{t("dashboard.planCropTitle")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("dashboard.planCropSubtitle")}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-crop">{t("dashboard.startCropAdvisor")} <ArrowRight size={16} /></span>
        </Link>
        <Link href="/farms" className="rounded-lg border border-sky-200 bg-sky-50 p-5 hover:bg-sky-100">
          <Tractor className="text-water" />
          <h2 className="mt-4 text-xl font-semibold">{t("dashboard.manageCropTitle")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("dashboard.manageCropSubtitle")}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-water">{t("dashboard.viewMyFarms")} <ArrowRight size={16} /></span>
        </Link>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title={t("dashboard.overallAgriculturalRisk")} value={`${cropRisk.overallScore}/100`} detail={t("dashboard.dynamicRiskCalculation")}>
          <div className="mt-3"><RiskBadge level={cropRisk.level} /></div>
        </MetricCard>
        <MetricCard title={t("dashboard.cropHealthIndex")} value={`${cropHealth.score}/100`} detail={`${getRiskLevelLabel(cropHealth.label)} · ${t("dashboard.vegetativeStage")}`} />
        <MetricCard title={t("common.confidence")} value={`${Math.round(cropRisk.confidence * 100)}%`} detail={t("dashboard.confidenceDetail")} />
        <MetricCard title={t("dashboard.pendingAlerts")} value={alerts.length} detail={t("dashboard.activeAlertsDetail")} />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardTitle>{t("dashboard.riskAndHealthTrend")}</CardTitle>
          <RiskTrendChart />
        </Card>
        <Card>
          <CardTitle>{t("dashboard.attentionCenter")}</CardTitle>
          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} />{alert.title}</span>
                  <RiskBadge level={alert.severity} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{alert.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>{t("dashboard.aiInsight")}</CardTitle>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            {t("dashboard.aiInsightText", { crop: getCropName(inputs.selectedCrop) })}
          </p>
          <Link href="/risk" className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">{t("dashboard.viewAnalysis")}</Link>
        </Card>
        <Card>
          <CardTitle>{t("dashboard.topActions")}</CardTitle>
          <div className="mt-4 space-y-4">
            {recommendations.slice(0, 3).map((item) => (
              <div key={item.id}>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-slate-600">{item.expectedBenefit}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

