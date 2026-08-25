import { Bot } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { activeCropCycle, cropRisk, demoFarm, recommendations } from "@/lib/mock/data";

const prompts = [
  "What crop should I grow?",
  "Why is my crop risk increasing?",
  "What should I do now?",
  "What happens if rainfall drops?"
];

export default function CopilotPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-crop">AI Agricultural Copilot</p>
        <h1 className="mt-1 text-3xl font-bold">Ask AgriRisk</h1>
        <p className="mt-2 text-slate-600">Mock-grounded responses use farm, crop, stage, risk, recommendations, and freshness context.</p>
      </header>
      <section className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardTitle>Context</CardTitle>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Farm</dt><dd>{demoFarm.name}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Crop</dt><dd>{activeCropCycle.crop}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Stage</dt><dd>{activeCropCycle.stage}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Risk</dt><dd>{cropRisk.overallScore}/100</dd></div>
          </dl>
          <div className="mt-6 space-y-2">
            {prompts.map((prompt) => <button key={prompt} className="block w-full rounded-md border border-slate-200 px-3 py-2 text-left text-sm">{prompt}</button>)}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-crop text-white"><Bot size={20} /></span>
            <div>
              <CardTitle>Response</CardTitle>
              <p className="text-sm text-slate-500">Confidence {Math.round(cropRisk.confidence * 100)}%</p>
            </div>
          </div>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Your rice crop is in the vegetative stage, and the current risk is high because rainfall is below normal while temperatures are rising. The most useful next action is to monitor irrigation more closely and inspect pest conditions near field edges.
          </p>
          <div className="mt-5 rounded-md bg-slate-50 p-4">
            <p className="font-semibold">Recommended action</p>
            <p className="mt-1 text-sm text-slate-600">{recommendations[0].title}: {recommendations[0].expectedBenefit}</p>
          </div>
          <p className="mt-5 text-xs text-slate-500">Decision support based on available mock data, not guaranteed agricultural advice.</p>
        </Card>
      </section>
    </div>
  );
}
