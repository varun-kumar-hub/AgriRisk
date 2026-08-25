import { Card, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { regionalRisks } from "@/lib/mock/data";

export default function RiskMapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-water">Regional intelligence</p>
        <h1 className="mt-1 text-3xl font-bold">Regional Risk Map</h1>
        <p className="mt-2 text-slate-600">MVP uses state and district risk panels first; full GeoJSON map layers can replace this view later.</p>
      </header>
      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card className="min-h-[420px]">
          <CardTitle>India Risk View</CardTitle>
          <div className="mt-5 grid min-h-80 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
            <div className="text-center">
              <p className="text-5xl font-bold text-crop">India</p>
              <p className="mt-2 text-slate-600">Interactive Leaflet or Mapbox layer planned after base MVP wiring.</p>
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          {regionalRisks.map((region) => (
            <Card key={region.region}>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{region.level}</CardTitle>
                  <h2 className="mt-2 text-xl font-semibold">{region.region}</h2>
                </div>
                <RiskBadge level={region.riskLevel} />
              </div>
              <p className="mt-3 text-3xl font-semibold">{region.score}/100</p>
              <p className="mt-3 text-sm text-slate-600">Drivers: {region.drivers.join(", ")}</p>
              <p className="mt-2 text-sm text-slate-600">Affected crops: {region.affectedCrops.join(", ")}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
