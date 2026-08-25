import Link from "next/link";
import { AlertTriangle, ArrowRight, Sprout, Tractor } from "lucide-react";
import { RiskTrendChart } from "@/components/charts/risk-trend-chart";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { alerts, cropHealth, cropRisk, demoFarm, recommendations } from "@/lib/mock/data";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-crop">Kharif 2026 · {demoFarm.location}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Good evening, Varun.</h1>
          <p className="mt-1 text-slate-600">Here is your agricultural intelligence overview.</p>
        </div>
        <p className="text-sm text-slate-500">Risk prediction updated 2 hours ago</p>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Link href="/crop-advisor" className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 hover:bg-emerald-100">
          <Sprout className="text-crop" />
          <h2 className="mt-4 text-xl font-semibold">Plan a crop</h2>
          <p className="mt-1 text-sm text-slate-600">What should I grow?</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-crop">Start Crop Advisor <ArrowRight size={16} /></span>
        </Link>
        <Link href="/farms" className="rounded-lg border border-sky-200 bg-sky-50 p-5 hover:bg-sky-100">
          <Tractor className="text-water" />
          <h2 className="mt-4 text-xl font-semibold">Manage my crop</h2>
          <p className="mt-1 text-sm text-slate-600">What should I do now?</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-water">View My Farms <ArrowRight size={16} /></span>
        </Link>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title="Overall Agricultural Risk" value={`${cropRisk.overallScore}/100`} detail="Up 12% this week">
          <div className="mt-3"><RiskBadge level={cropRisk.level} /></div>
        </MetricCard>
        <MetricCard title="Crop Health" value={`${cropHealth.score}/100`} detail={`${cropHealth.label} · Vegetative stage`} />
        <MetricCard title="Confidence" value={`${Math.round(cropRisk.confidence * 100)}%`} detail="Based on data completeness and similarity" />
        <MetricCard title="Active Alerts" value={alerts.length} detail="Drought and pest conditions" />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardTitle>Risk And Health Trend</CardTitle>
          <RiskTrendChart />
        </Card>
        <Card>
          <CardTitle>Attention Center</CardTitle>
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
          <CardTitle>AI Insight</CardTitle>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            Risk for your rice crop increased because rainfall deficit and temperature anomaly are raising water stress during the vegetative stage.
          </p>
          <Link href="/risk" className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">View Analysis</Link>
        </Card>
        <Card>
          <CardTitle>Top Actions</CardTitle>
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
