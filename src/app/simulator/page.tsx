import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { simulationResult } from "@/lib/mock/data";
import { classifyRisk, formatCurrency } from "@/lib/scoring/risk";

export default function SimulatorPage() {
  const simulatedLevel = classifyRisk(simulationResult.simulatedRisk);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-water">What-if decision</p>
        <h1 className="mt-1 text-3xl font-bold">Farm Simulator</h1>
        <p className="mt-2 text-slate-600">Scenario: rainfall -20% and temperature +2 C during the vegetative stage.</p>
      </header>
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title="Baseline Risk" value={simulationResult.baselineRisk} detail="Current scenario" />
        <MetricCard title="Simulated Risk" value={simulationResult.simulatedRisk} detail="Weather stress scenario"><RiskBadge level={simulatedLevel} /></MetricCard>
        <MetricCard title="Yield Impact" value={`${simulationResult.baselineYield} -> ${simulationResult.simulatedYield}`} detail="t/ha" />
        <MetricCard title="Potential Loss" value={formatCurrency(simulationResult.estimatedLoss)} detail="Estimated" />
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardTitle>Scenario Inputs</CardTitle>
          <div className="mt-4 space-y-4 text-sm">
            {["Rainfall -20%", "Temperature +2 C", "Humidity unchanged", "Irrigation +10%", "Pest pressure +8%"].map((item) => (
              <div key={item} className="rounded-md bg-slate-50 px-3 py-2 font-medium">{item}</div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Simulation Explanation</CardTitle>
          <p className="mt-4 text-lg leading-8 text-slate-700">{simulationResult.explanation}</p>
          <p className="mt-5 rounded-md bg-emerald-50 p-4 text-sm text-emerald-800">
            Recommended action: increase irrigation monitoring and inspect field stress every 48 hours until rainfall normalizes.
          </p>
        </Card>
      </section>
    </div>
  );
}
