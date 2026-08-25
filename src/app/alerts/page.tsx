import { Card, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { alerts } from "@/lib/mock/data";

export default function AlertsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-risk">Early warning</p>
        <h1 className="mt-1 text-3xl font-bold">Alerts</h1>
        <p className="mt-2 text-slate-600">Warnings connect risk escalation to farm, crop cycle, timeframe, and recommended response.</p>
      </header>
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{alert.type}</CardTitle>
                <h2 className="mt-3 text-xl font-semibold">{alert.title}</h2>
              </div>
              <RiskBadge level={alert.severity} />
            </div>
            <p className="mt-4 text-slate-600">{alert.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Current</p><p className="text-xl font-semibold">{alert.currentRisk}</p></div>
              <div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Projected</p><p className="text-xl font-semibold">{alert.projectedRisk}</p></div>
              <div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Timeframe</p><p className="text-xl font-semibold">{alert.timeframe}</p></div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
