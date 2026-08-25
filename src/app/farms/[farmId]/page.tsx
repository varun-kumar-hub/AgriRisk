import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { activeCropCycle, cropRisk, demoFarm, recommendations } from "@/lib/mock/data";

export default function FarmDetailPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-crop">Farm context</p>
        <h1 className="mt-1 text-3xl font-bold">{demoFarm.name}</h1>
        <p className="mt-2 text-slate-600">{demoFarm.location}</p>
      </header>
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title="Area" value={`${demoFarm.areaAcres} acres`} detail={demoFarm.soilType} />
        <MetricCard title="Soil pH" value={demoFarm.soilPh} detail="Good for rice" />
        <MetricCard title="Water" value={demoFarm.waterAvailability} detail={demoFarm.irrigationType} />
        <MetricCard title="Regional Risk" value="68/100" detail="Tamil Nadu"><RiskBadge level="HIGH" /></MetricCard>
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardTitle>Active Crop Cycle</CardTitle>
          <h2 className="mt-4 text-2xl font-semibold">{activeCropCycle.crop} · {activeCropCycle.season}</h2>
          <p className="mt-1 text-slate-600">{activeCropCycle.ageDays} days old · {activeCropCycle.stage} stage</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/farms/${demoFarm.id}/crops/${activeCropCycle.id}`} className="rounded-md bg-crop px-4 py-2 text-sm font-semibold text-white">Open crop cycle</Link>
            <Link href="/crop-advisor" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold">Run Crop Advisor</Link>
          </div>
        </Card>
        <Card>
          <CardTitle>Farm Recommendations</CardTitle>
          <div className="mt-4 space-y-3">
            {recommendations.slice(0, 2).map((item) => (
              <div key={item.id}>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-slate-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <Card className="mt-6">
        <CardTitle>Farm Risk Context</CardTitle>
        <p className="mt-4 text-lg text-slate-700">Current crop risk is <strong>{cropRisk.overallScore}/100</strong> because rainfall deficit is increasing water stress during the vegetative stage.</p>
      </Card>
    </div>
  );
}
