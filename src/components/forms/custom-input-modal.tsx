"use client";

import { useState } from "react";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";

export function CustomInputPanel() {
  const { inputs, updateInputs, resetInputs } = useUserInput();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="my-4 rounded-xl border border-crop/30 bg-crop/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">Custom Testing Profile Active</h3>
          <p className="text-sm text-slate-600">
            Testing: <strong>{inputs.farmName}</strong> ({inputs.distName}, {inputs.stateName}) · Crop: <strong className="capitalize">{inputs.selectedCrop}</strong> · Soil pH: {inputs.soilPh} · NPK: {inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg bg-crop px-4 py-2 text-sm font-semibold text-white shadow hover:bg-crop/90 transition-all"
        >
          Customize My Inputs
        </button>
      </div>
    );
  }

  return (
    <Card className="my-6 border-2 border-crop/40 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <CardTitle>Enter Your Custom Farm & Soil Inputs</CardTitle>
          <p className="text-sm text-slate-600">Update values to test recommendations and risk scores live.</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Farm Name</label>
          <input
            type="text"
            value={inputs.farmName}
            onChange={(e) => updateInputs({ farmName: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">State Name</label>
          <input
            type="text"
            value={inputs.stateName}
            onChange={(e) => updateInputs({ stateName: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">District Name</label>
          <input
            type="text"
            value={inputs.distName}
            onChange={(e) => updateInputs({ distName: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Area (Acres)</label>
          <input
            type="number"
            value={inputs.areaAcres}
            onChange={(e) => updateInputs({ areaAcres: parseFloat(e.target.value) || 1 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Soil pH</label>
          <input
            type="number"
            step="0.1"
            value={inputs.soilPh}
            onChange={(e) => updateInputs({ soilPh: parseFloat(e.target.value) || 6.5 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Nitrogen N (kg/ha)</label>
          <input
            type="number"
            value={inputs.nitrogen}
            onChange={(e) => updateInputs({ nitrogen: parseFloat(e.target.value) || 0 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Phosphorus P (kg/ha)</label>
          <input
            type="number"
            value={inputs.phosphorus}
            onChange={(e) => updateInputs({ phosphorus: parseFloat(e.target.value) || 0 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Potassium K (kg/ha)</label>
          <input
            type="number"
            value={inputs.potassium}
            onChange={(e) => updateInputs({ potassium: parseFloat(e.target.value) || 0 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Water Availability</label>
          <select
            value={inputs.waterAvailability}
            onChange={(e) => updateInputs({ waterAvailability: e.target.value as "Low" | "Moderate" | "High" })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Temperature (°C)</label>
          <input
            type="number"
            value={inputs.temperatureC}
            onChange={(e) => updateInputs({ temperatureC: parseFloat(e.target.value) || 25 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Rainfall (mm)</label>
          <input
            type="number"
            value={inputs.rainfallMm}
            onChange={(e) => updateInputs({ rainfallMm: parseFloat(e.target.value) || 500 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Target Crop</label>
          <select
            value={inputs.selectedCrop}
            onChange={(e) => updateInputs({ selectedCrop: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm capitalize"
          >
            <option value="rice">Rice</option>
            <option value="maize">Maize</option>
            <option value="chickpea">Chickpea</option>
            <option value="groundnut">Groundnut</option>
            <option value="cotton">Cotton</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t pt-3">
        <button
          onClick={resetInputs}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Reset Defaults
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-md bg-crop px-5 py-1.5 text-xs font-semibold text-white shadow hover:bg-crop/90"
        >
          Save & Apply
        </button>
      </div>
    </Card>
  );
}
