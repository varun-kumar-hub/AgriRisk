"use client";

import { useState } from "react";
import { Tractor, Sprout, Calendar, Droplets } from "lucide-react";
import { useUserInput } from "@/components/providers/user-input-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function FarmSettingsPage() {
  const { inputs, updateInputs } = useUserInput();
  const toast = useToast();
  const { t } = useTranslation();

  const [defaultCrop, setDefaultCrop] = useState(inputs.selectedCrop);
  const [defaultSeason, setDefaultSeason] = useState("Kharif");
  const [defaultIrrigation, setDefaultIrrigation] = useState(inputs.irrigationType);
  const [waterAvailability, setWaterAvailability] = useState(inputs.waterAvailability);

  const handleSave = () => {
    updateInputs({
      selectedCrop: defaultCrop,
      irrigationType: defaultIrrigation,
      waterAvailability: waterAvailability as any
    });
    toast.success("Farm Preferences Saved", "Your default farm context has been updated across AgriRisk.");
  };

  return (
    <Card className="border border-slate-200 bg-white p-6 shadow-sm">
      <CardTitle className="text-xl font-bold">{t("settings.tabFarm")}</CardTitle>
      <p className="mt-1 text-xs font-medium text-slate-500">
        Configure default agricultural context used for Dashboard, Risk Intelligence, and Copilot.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Default Target Crop
          </label>
          <select
            value={defaultCrop}
            onChange={(e) => setDefaultCrop(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          >
            <option value="rice">Rice (Paddy)</option>
            <option value="maize">Maize (Corn)</option>
            <option value="chickpea">Chickpea (Gram)</option>
            <option value="groundnut">Groundnut (Peanut)</option>
            <option value="cotton">Cotton</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Default Season
            </label>
            <select
              value={defaultSeason}
              onChange={(e) => setDefaultSeason(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
            >
              <option value="Kharif">Kharif (Monsoon)</option>
              <option value="Rabi">Rabi (Winter)</option>
              <option value="Zaid">Zaid (Summer)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Irrigation System
            </label>
            <select
              value={defaultIrrigation}
              onChange={(e) => setDefaultIrrigation(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
            >
              <option value="Canal irrigation">Canal Irrigation</option>
              <option value="Drip irrigation">Drip Irrigation</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Rainfed">Rainfed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Water Availability Level
          </label>
          <select
            value={waterAvailability}
            onChange={(e) => setWaterAvailability(e.target.value as any)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          >
            <option value="Low">Low (Water Deficit Risk)</option>
            <option value="Moderate">Moderate (Standard Supply)</option>
            <option value="High">High (Abundant Supply)</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
        <Button onClick={handleSave}>
          {t("settings.saveChanges")}
        </Button>
      </div>
    </Card>
  );
}
