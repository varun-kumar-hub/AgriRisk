"use client";

import { useState, useEffect } from "react";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/i18n-context";
import {
  INDIAN_STATES_DISTRICTS,
  SOIL_TYPES,
  IRRIGATION_TYPES
} from "@/lib/data/india-regions";
import { MapPin, Sparkles, SlidersHorizontal, RefreshCw } from "lucide-react";

export function CustomInputPanel() {
  const { inputs, updateInputs, resetInputs } = useUserInput();
  const { t, getCropName } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const [selectedState, setSelectedState] = useState(inputs.stateName || "Andhra Pradesh");
  const [selectedDist, setSelectedDist] = useState(inputs.distName || "East Godavari");
  const [customStateText, setCustomStateText] = useState("");
  const [customDistText, setCustomDistText] = useState("");
  const [isCustomState, setIsCustomState] = useState(false);
  const [isCustomDist, setIsCustomDist] = useState(false);

  const stateList = Object.keys(INDIAN_STATES_DISTRICTS);
  const availableDistricts = INDIAN_STATES_DISTRICTS[selectedState] || [];

  // Update district when state changes
  const handleStateSelect = (state: string) => {
    if (state === "OTHER") {
      setIsCustomState(true);
      setSelectedState("OTHER");
    } else {
      setIsCustomState(false);
      setSelectedState(state);
      updateInputs({ stateName: state });

      const newDistList = INDIAN_STATES_DISTRICTS[state] || [];
      if (newDistList.length > 0) {
        const firstDist = newDistList[0];
        setSelectedDist(firstDist);
        setIsCustomDist(false);
        updateInputs({ distName: firstDist });
      }
    }
  };

  const handleDistSelect = (dist: string) => {
    if (dist === "OTHER") {
      setIsCustomDist(true);
      setSelectedDist("OTHER");
    } else {
      setIsCustomDist(false);
      setSelectedDist(dist);
      updateInputs({ distName: dist });
    }
  };

  // Quick preset filler for soil types
  const applySoilPreset = (soilType: string) => {
    let preset = { soilPh: 6.5, nitrogen: 20, phosphorus: 10, potassium: 15 };
    if (soilType.includes("Black")) {
      preset = { soilPh: 7.8, nitrogen: 30, phosphorus: 18, potassium: 25 };
    } else if (soilType.includes("Red")) {
      preset = { soilPh: 6.2, nitrogen: 22, phosphorus: 12, potassium: 15 };
    } else if (soilType.includes("Alluvial")) {
      preset = { soilPh: 7.0, nitrogen: 40, phosphorus: 25, potassium: 30 };
    } else if (soilType.includes("Clay")) {
      preset = { soilPh: 6.8, nitrogen: 25, phosphorus: 15, potassium: 20 };
    } else if (soilType.includes("Laterite")) {
      preset = { soilPh: 5.5, nitrogen: 15, phosphorus: 8, potassium: 10 };
    }
    updateInputs(preset);
  };

  if (!isOpen) {
    return (
      <div className="my-4 rounded-2xl border border-crop/30 bg-crop/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-crop" />
            {t("customInput.testingProfileActive")}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
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
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer p-1"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Farm Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.farmName")}
          </label>
          <input
            type="text"
            value={inputs.farmName}
            onChange={(e) => updateInputs({ farmName: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          />
        </div>

        {/* State Selection Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.stateName")} (State Dropdown)
          </label>
          <select
            value={isCustomState ? "OTHER" : selectedState}
            onChange={(e) => handleStateSelect(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          >
            {stateList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
            <option value="OTHER">✍️ Enter Custom State...</option>
          </select>
          {isCustomState && (
            <input
              type="text"
              placeholder="Type custom state name"
              value={customStateText}
              onChange={(e) => {
                setCustomStateText(e.target.value);
                updateInputs({ stateName: e.target.value });
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-sm"
            />
          )}
        </div>

        {/* District Selection Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.districtName")} (District Dropdown)
          </label>
          <select
            value={isCustomDist ? "OTHER" : selectedDist}
            onChange={(e) => handleDistSelect(e.target.value)}
            disabled={isCustomState}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            {availableDistricts.map((dst) => (
              <option key={dst} value={dst}>
                {dst}
              </option>
            ))}
            <option value="OTHER">✍️ Enter Custom District...</option>
          </select>
          {isCustomDist && (
            <input
              type="text"
              placeholder="Type custom district name"
              value={customDistText}
              onChange={(e) => {
                setCustomDistText(e.target.value);
                updateInputs({ distName: e.target.value });
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-sm"
            />
          )}
        </div>

        {/* Farm Area in Acres */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.areaAcres")}
          </label>
          <input
            type="number"
            min="0.1"
            step="0.5"
            value={inputs.areaAcres}
            onChange={(e) => updateInputs({ areaAcres: parseFloat(e.target.value) || 1 })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          />
        </div>

        {/* Soil Type Dropdown with Auto-Preset Fill */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Soil Classification
            </label>
          </div>
          <select
            value={inputs.soilType}
            onChange={(e) => {
              const val = e.target.value;
              updateInputs({ soilType: val });
              applySoilPreset(val);
            }}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          >
            {SOIL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Irrigation System Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Irrigation System
          </label>
          <select
            value={inputs.irrigationType}
            onChange={(e) => updateInputs({ irrigationType: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          >
            {IRRIGATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Soil pH */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.soilPh")}
          </label>
          <input
            type="number"
            step="0.1"
            min="3.0"
            max="11.0"
            value={inputs.soilPh}
            onChange={(e) => updateInputs({ soilPh: parseFloat(e.target.value) || 6.5 })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          />
        </div>

        {/* Soil Nitrogen N */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.nitrogen")}
          </label>
          <input
            type="number"
            value={inputs.nitrogen}
            onChange={(e) => updateInputs({ nitrogen: parseFloat(e.target.value) || 0 })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          />
        </div>

        {/* Soil Phosphorus P */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.phosphorus")}
          </label>
          <input
            type="number"
            value={inputs.phosphorus}
            onChange={(e) => updateInputs({ phosphorus: parseFloat(e.target.value) || 0 })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          />
        </div>

        {/* Soil Potassium K */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.potassium")}
          </label>
          <input
            type="number"
            value={inputs.potassium}
            onChange={(e) => updateInputs({ potassium: parseFloat(e.target.value) || 0 })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          />
        </div>

        {/* Water Availability */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.waterAvailability")}
          </label>
          <select
            value={inputs.waterAvailability}
            onChange={(e) => updateInputs({ waterAvailability: e.target.value as "Low" | "Moderate" | "High" })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          >
            <option value="Low">{t("common.low")}</option>
            <option value="Moderate">{t("common.moderate")}</option>
            <option value="High">{t("common.high")}</option>
          </select>
        </div>

        {/* Temperature °C */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.temperature")}
          </label>
          <input
            type="number"
            value={inputs.temperatureC}
            onChange={(e) => updateInputs({ temperatureC: parseFloat(e.target.value) || 25 })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          />
        </div>

        {/* Rainfall mm */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.rainfall")}
          </label>
          <input
            type="number"
            value={inputs.rainfallMm}
            onChange={(e) => updateInputs({ rainfallMm: parseFloat(e.target.value) || 500 })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
          />
        </div>

        {/* Target Crop */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t("customInput.targetCrop")}
          </label>
          <select
            value={inputs.selectedCrop}
            onChange={(e) => updateInputs({ selectedCrop: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20 capitalize"
          >
            <option value="rice">{getCropName("rice")}</option>
            <option value="maize">{getCropName("maize")}</option>
            <option value="chickpea">{getCropName("chickpea")}</option>
            <option value="groundnut">{getCropName("groundnut")}</option>
            <option value="cotton">{getCropName("cotton")}</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <button
          onClick={() => applySoilPreset(inputs.soilType)}
          className="flex items-center gap-1.5 text-xs font-bold text-crop hover:underline cursor-pointer"
        >
          <Sparkles size={14} /> Auto-fill Typical N-P-K & pH for {inputs.soilType}
        </button>

        <div className="flex gap-3">
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
      </div>
    </Card>
  );
}
