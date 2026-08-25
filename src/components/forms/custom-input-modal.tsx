"use client";

import { useState } from "react";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function CustomInputPanel() {
  const { inputs, updateInputs, resetInputs } = useUserInput();
  const { t, getCropName } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="my-4 rounded-xl border border-crop/30 bg-crop/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">{t("customInput.testingProfileActive")}</h3>
          <p className="text-sm text-slate-600">
            {t("customInput.testing")}: <strong>{inputs.farmName}</strong> ({inputs.distName}, {inputs.stateName}) · {t("common.crop")}: <strong className="capitalize">{getCropName(inputs.selectedCrop)}</strong> · {t("customInput.soilPh")}: {inputs.soilPh} · NPK: {inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium}
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          {t("customInput.customizeMyInputs")}
        </Button>
      </div>
    );
  }

  return (
    <Card className="my-6 border-2 border-crop/40 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <CardTitle>{t("customInput.modalTitle")}</CardTitle>
          <p className="text-sm text-slate-600">{t("customInput.modalSubtitle")}</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.farmName")}</label>
          <input
            type="text"
            value={inputs.farmName}
            onChange={(e) => updateInputs({ farmName: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.stateName")}</label>
          <input
            type="text"
            value={inputs.stateName}
            onChange={(e) => updateInputs({ stateName: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.districtName")}</label>
          <input
            type="text"
            value={inputs.distName}
            onChange={(e) => updateInputs({ distName: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.areaAcres")}</label>
          <input
            type="number"
            value={inputs.areaAcres}
            onChange={(e) => updateInputs({ areaAcres: parseFloat(e.target.value) || 1 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.soilPh")}</label>
          <input
            type="number"
            step="0.1"
            value={inputs.soilPh}
            onChange={(e) => updateInputs({ soilPh: parseFloat(e.target.value) || 6.5 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.nitrogen")}</label>
          <input
            type="number"
            value={inputs.nitrogen}
            onChange={(e) => updateInputs({ nitrogen: parseFloat(e.target.value) || 0 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.phosphorus")}</label>
          <input
            type="number"
            value={inputs.phosphorus}
            onChange={(e) => updateInputs({ phosphorus: parseFloat(e.target.value) || 0 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.potassium")}</label>
          <input
            type="number"
            value={inputs.potassium}
            onChange={(e) => updateInputs({ potassium: parseFloat(e.target.value) || 0 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.waterAvailability")}</label>
          <select
            value={inputs.waterAvailability}
            onChange={(e) => updateInputs({ waterAvailability: e.target.value as "Low" | "Moderate" | "High" })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value="Low">{t("common.low")}</option>
            <option value="Moderate">{t("common.moderate")}</option>
            <option value="High">{t("common.high")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.temperature")}</label>
          <input
            type="number"
            value={inputs.temperatureC}
            onChange={(e) => updateInputs({ temperatureC: parseFloat(e.target.value) || 25 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.rainfall")}</label>
          <input
            type="number"
            value={inputs.rainfallMm}
            onChange={(e) => updateInputs({ rainfallMm: parseFloat(e.target.value) || 500 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">{t("customInput.targetCrop")}</label>
          <select
            value={inputs.selectedCrop}
            onChange={(e) => updateInputs({ selectedCrop: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm capitalize"
          >
            <option value="rice">{getCropName("rice")}</option>
            <option value="maize">{getCropName("maize")}</option>
            <option value="chickpea">{getCropName("chickpea")}</option>
            <option value="groundnut">{getCropName("groundnut")}</option>
            <option value="cotton">{getCropName("cotton")}</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={resetInputs}
        >
          {t("customInput.resetDefaults")}
        </Button>
        <Button
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          {t("customInput.saveApply")}
        </Button>
      </div>
    </Card>
  );
}

