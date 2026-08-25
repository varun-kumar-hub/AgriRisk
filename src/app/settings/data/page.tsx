"use client";

import { Database, Activity, CheckCircle2, Clock, Cpu } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function DataSettingsPage() {
  const { t } = useTranslation();

  const services = [
    { name: "Live Weather Radar Feed", type: "OpenWeatherMap API", status: "OPERATIONAL", lastUpdated: "12 mins ago" },
    { name: "Mandi Price Feed", type: "Agmarknet APMC Index", status: "OPERATIONAL", lastUpdated: "2 hours ago" },
    { name: "50,000+ Historical Crop Dataset", type: "Indexed Benchmark Records", status: "OPERATIONAL", lastUpdated: "Active" },
    { name: "Regional District Risk Map", type: "Geospatial Vector Feed", status: "OPERATIONAL", lastUpdated: "35 mins ago" },
    { name: "Gemini 2.5 Flash AI Engine", type: "Google Generative AI API", status: "OPERATIONAL", lastUpdated: "Live" }
  ];

  return (
    <Card className="border border-slate-200 bg-white p-6 shadow-sm">
      <CardTitle className="text-xl font-bold">{t("settings.tabData")}</CardTitle>
      <p className="mt-1 text-xs font-medium text-slate-500">
        Monitor real-time data pipeline health, dataset freshness, and AI service integration statuses.
      </p>

      <div className="mt-6 space-y-4">
        {services.map((item, idx) => (
          <div key={idx} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-crop/20 text-crop">
                <Database size={20} />
              </span>
              <div>
                <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                <p className="text-xs text-slate-500 font-medium">{item.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Clock size={14} /> {item.lastUpdated}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                <CheckCircle2 size={14} /> {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
