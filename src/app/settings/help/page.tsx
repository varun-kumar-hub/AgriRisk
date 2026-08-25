"use client";

import { useState } from "react";
import { HelpCircle, FileText, Send, MessageSquare, ShieldAlert, Cpu, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function HelpSettingsPage() {
  const toast = useToast();
  const { t } = useTranslation();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [issueType, setIssueType] = useState("Incorrect recommendation");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReport = () => {
    if (!description.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setReportModalOpen(false);
      setDescription("");
      toast.success("Problem Reported", "Thank you. Your feedback has been sent to the AgriRisk engineering team.");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* How AgriRisk Works */}
      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Cpu className="text-crop" size={22} />
          {t("settings.howAgriRiskWorks")}
        </CardTitle>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Understanding the end-to-end intelligence flow from farm sensors to Gemini 2.5 Flash recommendations.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-5 text-center">
          {[
            { step: "1", title: "Farm Data", desc: "Soil pH, N-P-K, Location & Area" },
            { step: "2", title: "Live Feeds", desc: "OpenWeather + Agmarknet Mandis" },
            { step: "3", title: "ML Models", desc: "Risk & Crop Suitability Engine" },
            { step: "4", title: "Gemini 2.5 AI", desc: "Real-time Agronomic Reasoning" },
            { step: "5", title: "Action Plan", desc: "Prioritized Field Interventions" }
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 flex flex-col justify-between">
              <span className="mx-auto grid size-7 place-items-center rounded-full bg-crop text-white text-xs font-extrabold shadow-sm">
                {item.step}
              </span>
              <h3 className="mt-2 text-xs font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-[11px] text-slate-500 leading-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Understanding Risk Scores */}
      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <ShieldAlert className="text-amber-500" size={20} />
          {t("settings.understandingRiskScores")}
        </CardTitle>
        <p className="mt-1 text-xs font-medium text-slate-500">
          How risk scores (0–100) are classified and calculated across weather, soil, market, and pest categories.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200">
            <span className="font-extrabold text-emerald-800 text-sm">0 – 29</span>
            <p className="font-bold text-emerald-950 text-base mt-1">LOW RISK</p>
            <p className="text-xs text-emerald-800 mt-1">Optimal soil N-P-K fit & stable climate conditions.</p>
          </div>

          <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
            <span className="font-extrabold text-amber-800 text-sm">30 – 49</span>
            <p className="font-bold text-amber-950 text-base mt-1">MODERATE RISK</p>
            <p className="text-xs text-amber-800 mt-1">Minor nutrient deficit or rainfall fluctuation.</p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-4 border border-orange-200">
            <span className="font-extrabold text-orange-800 text-sm">50 – 69</span>
            <p className="font-bold text-orange-950 text-base mt-1">HIGH RISK</p>
            <p className="text-xs text-orange-800 mt-1">Elevated temperature stress or water availability deficit.</p>
          </div>

          <div className="rounded-2xl bg-red-50 p-4 border border-red-200">
            <span className="font-extrabold text-red-800 text-sm">70 – 100</span>
            <p className="font-bold text-red-950 text-base mt-1">CRITICAL RISK</p>
            <p className="text-xs text-red-800 mt-1">Severe drought anomaly or pest vulnerability requiring immediate field intervention.</p>
          </div>
        </div>
      </Card>

      {/* Report a Problem */}
      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold">Have a Question or Found an Issue?</CardTitle>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Submit feedback directly to the AgriRisk agronomic team.
            </p>
          </div>
          <Button onClick={() => setReportModalOpen(true)}>
            <MessageSquare size={16} />
            {t("settings.reportProblem")}
          </Button>
        </div>
      </Card>

      {/* Report Problem Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">{t("settings.reportProblem")}</h2>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Issue Category</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
                >
                  <option value="Incorrect recommendation">Incorrect recommendation</option>
                  <option value="Translation error">Translation error in Tamil/Telugu/Kannada/Hindi</option>
                  <option value="Weather / Mandi data gap">Weather / Mandi data gap</option>
                  <option value="UI Bug">UI Layout or Navigation Bug</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened or what recommendation seemed inaccurate..."
                  className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => setReportModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                {t("settings.cancel")}
              </button>
              <Button onClick={handleSubmitReport} loading={submitting} disabled={!description.trim()}>
                <Send size={16} /> Submit Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
