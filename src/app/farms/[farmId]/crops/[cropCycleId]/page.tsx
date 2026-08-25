import Link from "next/link";
import { CategoryBars } from "@/components/charts/category-bars";
import { RiskFactorList } from "@/components/risk/risk-factor-list";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { activeCropCycle, alerts, cropHealth, cropRisk, recommendations } from "@/lib/mock/data";

export default function CropCyclePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-crop">Crop lifecycle</p>
          <h1 className="mt-1 text-3xl font-bold">{activeCropCycle.crop} · {activeCropCycle.season}</h1>
          <p className="mt-2 text-slate-600">Sown on {activeCropCycle.sowingDate} · {activeCropCycle.ageDays} days old · {activeCropCycle.stage}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/copilot" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold">Ask Copilot</Link>
          <Link href="/simulator" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Simulate</Link>
        </div>
      </header>
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title="Crop Health" value={`${cropHealth.score}/100`} detail={cropHealth.label} />
        <MetricCard title="Crop Risk" value={`${cropRisk.overallScore}/100`} detail="Dynamic score"><RiskBadge level={cropRisk.level} /></MetricCard>
        <MetricCard title="Confidence" value={`${Math.round(cropRisk.confidence * 100)}%`} detail="Available farm data" />
        <MetricCard title="Active Alerts" value={alerts.length} detail="Requires attention" />
      </section>
      <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardTitle>Risk Breakdown</CardTitle>
          <CategoryBars risk={cropRisk} />
        </Card>
        <Card>
          <CardTitle>Risk Factors</CardTitle>
          <div className="mt-4"><RiskFactorList factors={cropRisk.factors} /></div>
        </Card>
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Growth-Stage Intelligence</CardTitle>
          <p className="mt-4 leading-7 text-slate-700">
            Rice is in the vegetative stage, when stable water and nutrient availability strongly influence tillering and yield potential.
          </p>
        </Card>
        <Card>
          <CardTitle>Management Recommendations</CardTitle>
          <div className="mt-4 space-y-3">
            {recommendations.map((item) => (
              <div key={item.id} className="rounded-md bg-slate-50 p-3">
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
