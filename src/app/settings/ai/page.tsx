"use client";

import { useState } from "react";
import { Bot, Sparkles, Sliders, Check } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function AiSettingsPage() {
  const toast = useToast();
  const { t } = useTranslation();

  const [aiStyle, setAiStyle] = useState("Farmer Friendly");
  const [aiLang, setAiLang] = useState("app");
  const [useFarmContext, setUseFarmContext] = useState(true);
  const [showExplanations, setShowExplanations] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ai_response_style: aiStyle,
          ai_use_farm_context: useFarmContext,
          show_ai_explanations: showExplanations
        })
      });
      toast.success("AI Preferences Saved", "Gemini 2.5 Flash copilot behavior and response style updated.");
    } catch (e) {
      toast.error("Save Failed", "Could not save AI settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <CardTitle className="text-xl font-bold">{t("settings.tabAi")}</CardTitle>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Configure response tone, prompt context, and explanation detail for AgriRisk Gemini 2.5 Flash Copilot.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              AI Response Tone & Style
            </label>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Simple", desc: "Short, plain answers" },
                { name: "Farmer Friendly", desc: "Practical advice & terms" },
                { name: "Detailed", desc: "Comprehensive reasoning" },
                { name: "Technical", desc: "Agronomist / research data" }
              ].map((style) => {
                const isSelected = style.name === aiStyle;
                return (
                  <button
                    key={style.name}
                    onClick={() => setAiStyle(style.name)}
                    className={`rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-crop bg-crop/10 text-crop shadow-sm ring-2 ring-crop/20"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-900">{style.name}</p>
                    <p className="mt-1 text-xs font-normal text-slate-500">{style.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Use Active Farm Context in Copilot</p>
              <p className="text-xs text-slate-500 font-medium">Allows AI to access soil pH, N-P-K, weather, and crop stage for personalized answers</p>
            </div>
            <button
              onClick={() => setUseFarmContext(!useFarmContext)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                useFarmContext ? "bg-crop" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  useFarmContext ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Display Detailed AI Agronomic Explanations</p>
              <p className="text-xs text-slate-500 font-medium">Show why crops are recommended or constrained in recommendation cards</p>
            </div>
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showExplanations ? "bg-crop" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  showExplanations ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
          <Button onClick={handleSave} loading={loading}>
            {t("settings.saveChanges")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
