import { InteractiveRiskMap } from "@/components/maps/interactive-risk-map";

export default function RiskMapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="text-sm font-medium text-water">Regional intelligence</p>
        <h1 className="mt-1 text-3xl font-bold">Regional Risk Map</h1>
        <p className="mt-2 text-slate-600">Interactive OpenStreetMap regional risk visualization across districts, states, and national level.</p>
      </header>
      <InteractiveRiskMap />
    </div>
  );
}

