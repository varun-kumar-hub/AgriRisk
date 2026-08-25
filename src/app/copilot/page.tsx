"use client";

import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

const SUGGESTED_PROMPTS = [
  "What crop should I grow based on my soil pH and location?",
  "Why is my crop risk increasing?",
  "What fertilizer N-P-K recommendation should I apply?",
  "What happens if rainfall drops by 20%?"
];

export default function CopilotPage() {
  const { farm, activeCropCycle, cropRisk, inputs } = useUserInput();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(
    `Your ${inputs.selectedCrop} crop is currently in the ${activeCropCycle.stage} stage. Based on your soil pH (${inputs.soilPh}), NPK (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}), and ${inputs.waterAvailability.toLowerCase()} water availability, agricultural risk is calculated at ${cropRisk.overallScore}/100.`
  );
  const [datasetStats, setDatasetStats] = useState<any>(null);

  const handleAsk = async (userPrompt: string) => {
    const query = userPrompt || question;
    if (!query.trim()) return;

    setQuestion(query);
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query })
      });
      const data = await res.json();
      if (data.answer) setAnswer(data.answer);
      if (data.datasetStats) setDatasetStats(data.datasetStats);
    } catch (err) {
      console.error("Failed to query Copilot API:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-crop">AI Agricultural Copilot</p>
        <h1 className="mt-1 text-3xl font-bold">Ask AgriRisk AI</h1>
        <p className="mt-2 text-slate-600">
          Powered by Gemini AI and 50,000+ historical crop yield and climate records.
        </p>
      </header>

      <CustomInputPanel />

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardTitle>Active Farm Context</CardTitle>
          <dl className="mt-4 space-y-3 text-sm border-b pb-4">
            <div className="flex justify-between"><dt className="text-slate-500">Farm</dt><dd className="font-semibold">{farm.name}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Location</dt><dd className="font-semibold">{farm.location}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Target Crop</dt><dd className="font-semibold capitalize">{inputs.selectedCrop}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Soil pH / NPK</dt><dd className="font-semibold">{inputs.soilPh} / {inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Temp / Rain</dt><dd className="font-semibold">{inputs.temperatureC}°C / {inputs.rainfallMm}mm</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Risk Score</dt><dd className="font-semibold">{cropRisk.overallScore}/100</dd></div>
          </dl>

          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">Suggested Questions</p>
          <div className="mt-2 space-y-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleAsk(prompt)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-left text-xs font-semibold text-slate-700 transition-all hover:border-crop hover:bg-crop/10 hover:text-crop active:scale-95 cursor-pointer"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-2 border-crop/30 bg-white shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-crop text-white shadow-md">
                  <Bot size={22} />
                </span>
                <div>
                  <CardTitle>AgriRisk AI Response</CardTitle>
                  <p className="text-xs text-slate-500">Dynamic model confidence {Math.round(cropRisk.confidence * 100)}%</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-crop bg-crop/10 px-2.5 py-1 rounded-full">
                <Sparkles size={14} /> Gemini Intelligence
              </span>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-5 border border-slate-100 min-h-[160px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-slate-500">
                  <span className="grid size-8 place-items-center rounded-full bg-crop text-white animate-spin">🌱</span>
                  <p className="text-sm font-semibold">AgriRisk AI is analyzing crop dataset & soil parameters...</p>
                </div>
              ) : (
                <p className="text-base leading-8 text-slate-800">{answer}</p>
              )}
            </div>

            {datasetStats && (
              <div className="mt-4 rounded-lg bg-emerald-50 p-4 border border-emerald-100 text-xs space-y-1 text-emerald-950">
                <p className="font-bold">Historical Dataset Citation ({datasetStats.recordCount} Records):</p>
                <p>• Avg Historical Yield: {datasetStats.avgYieldKgPerHa} kg/ha | Optimal NPK: {datasetStats.avgNReq}-{datasetStats.avgPReq}-{datasetStats.avgKReq} kg/ha</p>
                <p>• Top Producing States: {datasetStats.topStates?.join(", ")}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-2 border-t pt-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk(question)}
              placeholder="Ask AgriRisk AI anything about crops, soil, water, risk, or weather..."
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
            />
            <Button onClick={() => handleAsk(question)} loading={loading}>
              <Send size={16} /> Ask AI
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
