"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import type { RiskLevel } from "@/types/domain";

interface RegionMarker {
  id: string;
  name: string;
  level: "District" | "State" | "Country";
  lat: number;
  lng: number;
  score: number;
  riskLevel: RiskLevel;
  drivers: string[];
  affectedCrops: string[];
}

const REGION_MARKERS: RegionMarker[] = [
  {
    id: "thanjavur",
    name: "Thanjavur, TN",
    level: "District",
    lat: 10.7867,
    lng: 79.1378,
    score: 72,
    riskLevel: "CRITICAL",
    drivers: ["Rainfall deficit", "Water stress", "Rice crop exposure"],
    affectedCrops: ["Rice", "Sugarcane"]
  },
  {
    id: "durg",
    name: "Durg, Chhattisgarh",
    level: "District",
    lat: 21.19,
    lng: 81.28,
    score: 54,
    riskLevel: "HIGH",
    drivers: ["Heat stress", "Variable rainfall"],
    affectedCrops: ["Rice", "Maize", "Chickpea"]
  },
  {
    id: "tn",
    name: "Tamil Nadu",
    level: "State",
    lat: 11.1271,
    lng: 78.6569,
    score: 68,
    riskLevel: "HIGH",
    drivers: ["Below-normal rainfall", "Heat stress"],
    affectedCrops: ["Rice", "Groundnut", "Cotton"]
  },
  {
    id: "cg",
    name: "Chhattisgarh",
    level: "State",
    lat: 21.2787,
    lng: 81.8661,
    score: 58,
    riskLevel: "MODERATE",
    drivers: ["Monsoon delay"],
    affectedCrops: ["Rice", "Pulse"]
  },
  {
    id: "india",
    name: "India",
    level: "Country",
    lat: 20.5937,
    lng: 78.9629,
    score: 49,
    riskLevel: "MODERATE",
    drivers: ["Monsoon variability", "Input cost inflation"],
    affectedCrops: ["Rice", "Wheat", "Pulses"]
  }
];

export function InteractiveRiskMap() {
  const [selectedRegion, setSelectedRegion] = useState<RegionMarker>(REGION_MARKERS[0]);

  return (
    <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <Card className="flex flex-col min-h-[460px]">
        <div className="flex items-center justify-between">
          <CardTitle>Interactive OpenStreetMap (100% Free - No API Key Needed)</CardTitle>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            OpenStreetMap Tiles
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Click any region marker to inspect real-time agricultural risk & climate drivers.
        </p>

        {/* Embedded Interactive Map View */}
        <div className="relative mt-4 flex-1 min-h-[360px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <iframe
            title="India Agricultural Risk Map"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "360px" }}
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedRegion.lng - 3}%2C${selectedRegion.lat - 3}%2C${selectedRegion.lng + 3}%2C${selectedRegion.lat + 3}&layer=mapnik&marker=${selectedRegion.lat}%2C${selectedRegion.lng}`}
          />

          {/* Map Region Quick Selector Floating Controls */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 rounded-lg bg-white/90 p-2 shadow-md backdrop-blur">
            {REGION_MARKERS.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                  selectedRegion.id === region.id
                    ? "bg-slate-950 text-white shadow"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Region Risk Inspector Panel */}
      <div className="space-y-4">
        <Card className="border-2 border-crop/40 bg-white shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{selectedRegion.level}</span>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{selectedRegion.name}</h2>
            </div>
            <RiskBadge level={selectedRegion.riskLevel} />
          </div>

          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500 font-medium">Agricultural Risk Score</p>
            <p className="mt-1 text-4xl font-extrabold text-slate-950">{selectedRegion.score}/100</p>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="font-bold text-slate-800">Primary Risk Drivers:</p>
              <ul className="mt-1 list-disc pl-5 text-slate-600">
                {selectedRegion.drivers.map((driver) => (
                  <li key={driver}>{driver}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-bold text-slate-800">Affected Crops:</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {selectedRegion.affectedCrops.map((crop) => (
                  <span key={crop} className="rounded-md bg-crop/10 px-2 py-0.5 text-xs font-semibold text-crop">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
