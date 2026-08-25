import { CategoryBars } from "@/components/charts/category-bars";
import { RiskTrendChart } from "@/components/charts/risk-trend-chart";
import { RiskFactorList } from "@/components/risk/risk-factor-list";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { cropRisk } from "@/lib/mock/data";

export default function RiskPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-risk">Risk intelligence</p>
        <h1 className="mt-1 text-3xl font-bold">Crop Risk Analysis</h1>
        <p className="mt-2 text-slate-600">Every score includes classification, confidence, drivers, freshness, and recommended action context.</p>
      </header>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard title="Current Crop Risk" value={`${cropRisk.overallScore}/100`} detail="Rice · Vegetative stage"><RiskBadge level={cropRisk.level} /></MetricCard>
        <MetricCard title="Prediction Confidence" value={`${Math.round(cropRisk.confidence * 100)}%`} detail="Data completeness and historical similarity" />
        <MetricCard title="Primary Driver" value="Rainfall" detail="23% below historical average" />
      </section>
      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card><CardTitle>7-Day Trend</CardTitle><RiskTrendChart /></Card>
        <Card><CardTitle>Category Contribution</CardTitle><CategoryBars risk={cropRisk} /></Card>
      </section>
      <Card className="mt-6">
        <CardTitle>Explainability</CardTitle>
        <div className="mt-4"><RiskFactorList factors={cropRisk.factors} /></div>
      </Card>
    </div>
  );
}
