import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { cropRecommendations } from "@/lib/mock/data";
import { formatCurrency } from "@/lib/scoring/risk";

export default async function CropDetailPage({ params }: { params: Promise<{ crop: string }> }) {
  const resolvedParams = await params;
  const crop = cropRecommendations.find((item) => item.crop.toLowerCase() === resolvedParams.crop?.toLowerCase());
  if (!crop) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-crop">Crop decision detail</p>
          <h1 className="mt-1 text-3xl font-bold">{crop.crop}</h1>
          <p className="mt-2 text-slate-600">Decision support based on farm, soil, water, season, market, and production estimates.</p>
        </div>
        <Link href="/farms/farm-thanjavur/crops/cycle-rice-kharif-2026" className="rounded-md bg-crop px-4 py-2 text-sm font-semibold text-white">
          Select crop and create cycle
        </Link>
      </header>
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title="Decision Score" value={crop.decisionScore} detail={`${Math.round(crop.confidence * 100)}% confidence`} />
        <MetricCard title="Risk Score" value={crop.riskScore} detail="Before planting risk"><RiskBadge level={crop.riskLevel} /></MetricCard>
        <MetricCard title="Expected Yield" value={`${crop.expectedYield} t/ha`} detail="Estimated" />
        <MetricCard title="Risk-Adjusted Profit" value={formatCurrency(crop.riskAdjustedProfit)} detail="Estimated per acre" />
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Suitability Breakdown</CardTitle>
          <div className="mt-4 space-y-3">
            {[
              ["Soil", crop.soilScore],
              ["Climate", crop.climateScore],
              ["Water", crop.waterScore],
              ["Market", crop.marketScore],
              ["Production", crop.productionScore]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                <span>{label}</span>
                <span className="font-semibold">{value}/100</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>AI Crop Explanation</CardTitle>
          <p className="mt-4 leading-7 text-slate-700">{crop.explanation}</p>
          <h3 className="mt-6 font-semibold">Why not?</h3>
          <p className="mt-2 leading-7 text-slate-700">{crop.whyNot}</p>
        </Card>
      </section>
    </div>
  );
}
