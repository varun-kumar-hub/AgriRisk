"use client";

import { useState } from "react";
import { Bell, Moon, ShieldAlert, Check } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function NotificationsSettingsPage() {
  const toast = useToast();
  const { t } = useTranslation();

  const [toggles, setToggles] = useState({
    cropRisk: true,
    weather: true,
    pestDisease: true,
    market: true,
    irrigation: true,
    aiRecommendations: true,
    cropHealth: true,
    regionalRisk: true
  });

  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    push: false
  });

  const [quietHours, setQuietHours] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleItem = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/preferences/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...toggles, ...channels, quiet_hours_enabled: quietHours })
      });
      toast.success("Notification Preferences Saved", "Your notification channels and alert triggers have been updated.");
    } catch (e) {
      toast.error("Save Failed", "Could not update notifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <CardTitle className="text-xl font-bold">{t("settings.tabNotifications")}</CardTitle>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Configure which agricultural events trigger warnings, advisories, and recommendations.
        </p>

        <div className="mt-6 space-y-4">
          {Object.entries({
            cropRisk: "Crop Risk Anomalies & Threshold Violations",
            weather: "Severe Weather Warnings & Heavy Rainfall Alerts",
            pestDisease: "Pest & Disease Vulnerability Advisories",
            market: "Mandi Price Volatility & MSP Updates",
            irrigation: "Irrigation Scheduling & Soil Moisture Stress Reminders",
            aiRecommendations: "AI Intervention Recommendations",
            cropHealth: "Crop Health Canopy Vigour Changes",
            regionalRisk: "Regional District Risk Map Updates"
          }).map(([key, label]) => {
            const isChecked = (toggles as any)[key];
            return (
              <div key={key} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                <span className="text-sm font-semibold text-slate-800">{label}</span>
                <button
                  onClick={() => toggleItem(key as any)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isChecked ? "bg-crop" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isChecked ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <CardTitle className="text-lg font-bold">Delivery Channels & Quiet Hours</CardTitle>

        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={channels.inApp}
                onChange={(e) => setChannels({ ...channels, inApp: e.target.checked })}
                className="size-4 rounded text-crop focus:ring-crop"
              />
              <span className="text-sm font-bold text-slate-800">In-App Notifications</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={channels.email}
                onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                className="size-4 rounded text-crop focus:ring-crop"
              />
              <span className="text-sm font-bold text-slate-800">Email Digest</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={channels.push}
                onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                className="size-4 rounded text-crop focus:ring-crop"
              />
              <span className="text-sm font-bold text-slate-800">Push Notifications</span>
            </label>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-indigo-600" />
              <div>
                <p className="text-sm font-bold text-slate-900">Quiet Hours (10:00 PM – 06:00 AM)</p>
                <p className="text-xs text-slate-500 font-medium">Delay non-critical alerts during overnight hours</p>
              </div>
            </div>
            <button
              onClick={() => setQuietHours(!quietHours)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                quietHours ? "bg-crop" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  quietHours ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} loading={loading}>
            {t("settings.saveChanges")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
