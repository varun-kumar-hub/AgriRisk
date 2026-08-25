"use client";

import { useState } from "react";
import { Globe, Check, Thermometer, DollarSign, Ruler } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/i18n/config";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

export default function LanguageSettingsPage() {
  const { language, setLanguage, t } = useTranslation();
  const toast = useToast();

  const [stateName, setStateName] = useState("Chhattisgarh");
  const [distName, setDistName] = useState("Durg");
  const [units, setUnits] = useState("Metric");
  const [tempUnit, setTempUnit] = useState("°C");
  const [currency, setCurrency] = useState("INR ₹");
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (code: SupportedLanguage) => {
    setLanguage(code);
    toast.success("Language Updated", `Application language switched.`);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ units, temperature_unit: tempUnit, currency })
      });
      toast.success("Regional Settings Saved", "Your regional measurement and localization preferences have been saved.");
    } catch (e) {
      toast.error("Save Failed", "Could not save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <CardTitle className="text-xl font-bold">{t("settings.tabLanguage")}</CardTitle>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Select your preferred application & AI language. UI strings and AI responses update instantly.
        </p>

        <div className="mt-6 space-y-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "border-crop bg-crop/10 text-crop shadow-sm ring-2 ring-crop/20"
                    : "border-slate-200 bg-slate-50/50 text-slate-800 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <p className="text-base font-bold">{lang.nativeName}</p>
                    <p className="text-xs font-normal text-slate-500">{lang.name}</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="grid size-6 place-items-center rounded-full bg-crop text-white shadow-xs">
                    <Check size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <CardTitle className="text-lg font-bold">Regional Units & Preferences</CardTitle>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Configure default measurement units, temperature scale, and currency for agricultural financial figures.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Measurement System
            </label>
            <div className="relative mt-1.5">
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
              >
                <option value="Metric">Metric (Hectares / kg)</option>
                <option value="Imperial">Imperial (Acres / lbs)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Temperature Scale
            </label>
            <div className="relative mt-1.5">
              <select
                value={tempUnit}
                onChange={(e) => setTempUnit(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
              >
                <option value="°C">Celsius (°C)</option>
                <option value="°F">Fahrenheit (°F)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Currency
            </label>
            <div className="relative mt-1.5">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
              >
                <option value="INR ₹">Indian Rupee (₹ INR)</option>
                <option value="USD $">US Dollar ($ USD)</option>
              </select>
            </div>
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
