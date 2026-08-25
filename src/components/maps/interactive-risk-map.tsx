"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import type { RiskLevel } from "@/types/domain";

export interface StateAgriculturalProfile {
  id: string;
  name: string;
  lat: number;
  lng: number;
  score: number;
  riskLevel: RiskLevel;
  weather: {
    temperatureC: number;
    humidityPct: number;
    rainfallMm: number;
    windSpeedMs: number;
    solarRadiation: number;
    conditionSummary: string;
  };
  mainCropProduction: Array<{
    cropName: string;
    avgYieldKgPerHa: number;
    season: string;
    productionShare: string;
  }>;
  drivers: string[];
}

export const ALL_INDIAN_STATES: StateAgriculturalProfile[] = [
  {
    id: "chhattisgarh",
    name: "Chhattisgarh",
    lat: 21.2787,
    lng: 81.8661,
    score: 58,
    riskLevel: "MODERATE",
    weather: {
      temperatureC: 26.5,
      humidityPct: 78,
      rainfallMm: 1250,
      windSpeedMs: 2.1,
      solarRadiation: 18.2,
      conditionSummary: "Sub-humid tropical climate with monsoon-dependent rain"
    },
    mainCropProduction: [
      { cropName: "Rice", avgYieldKgPerHa: 2480, season: "Kharif", productionShare: "62%" },
      { cropName: "Maize", avgYieldKgPerHa: 1950, season: "Kharif", productionShare: "15%" },
      { cropName: "Chickpea", avgYieldKgPerHa: 920, season: "Rabi", productionShare: "12%" },
      { cropName: "Groundnut", avgYieldKgPerHa: 1450, season: "Kharif", productionShare: "6%" }
    ],
    drivers: ["Rainfall variability during vegetative stage", "Irrigation deficit in rainfed belts"]
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    lat: 11.1271,
    lng: 78.6569,
    score: 68,
    riskLevel: "HIGH",
    weather: {
      temperatureC: 29.2,
      humidityPct: 74,
      rainfallMm: 940,
      windSpeedMs: 3.4,
      solarRadiation: 21.5,
      conditionSummary: "Coastal tropical with North-East monsoon reliance"
    },
    mainCropProduction: [
      { cropName: "Rice", avgYieldKgPerHa: 3620, season: "Kharif & Rabi", productionShare: "48%" },
      { cropName: "Sugarcane", avgYieldKgPerHa: 102000, season: "Annual", productionShare: "22%" },
      { cropName: "Groundnut", avgYieldKgPerHa: 2180, season: "Kharif", productionShare: "14%" },
      { cropName: "Cotton", avgYieldKgPerHa: 1540, season: "Kharif", productionShare: "9%" }
    ],
    drivers: ["Water reservoir deficit", "Northeast monsoon uncertainty", "Heat stress"]
  },
  {
    id: "punjab",
    name: "Punjab",
    lat: 31.1471,
    lng: 75.3412,
    score: 42,
    riskLevel: "MODERATE",
    weather: {
      temperatureC: 24.1,
      humidityPct: 62,
      rainfallMm: 650,
      windSpeedMs: 2.8,
      solarRadiation: 19.8,
      conditionSummary: "Semiarid fertile plains with high tube-well canal density"
    },
    mainCropProduction: [
      { cropName: "Wheat", avgYieldKgPerHa: 4820, season: "Rabi", productionShare: "52%" },
      { cropName: "Rice", avgYieldKgPerHa: 4130, season: "Kharif", productionShare: "38%" },
      { cropName: "Cotton", avgYieldKgPerHa: 2210, season: "Kharif", productionShare: "6%" },
      { cropName: "Maize", avgYieldKgPerHa: 3450, season: "Kharif", productionShare: "4%" }
    ],
    drivers: ["Groundwater table depletion", "Soil fertility imbalance (high N usage)"]
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    lat: 19.7515,
    lng: 75.7139,
    score: 74,
    riskLevel: "CRITICAL",
    weather: {
      temperatureC: 28.4,
      humidityPct: 68,
      rainfallMm: 850,
      windSpeedMs: 3.2,
      solarRadiation: 20.4,
      conditionSummary: "Dry Deccan plateau with frequent dry spells in Marathwada"
    },
    mainCropProduction: [
      { cropName: "Sugarcane", avgYieldKgPerHa: 84000, season: "Annual", productionShare: "34%" },
      { cropName: "Cotton", avgYieldKgPerHa: 1320, season: "Kharif", productionShare: "28%" },
      { cropName: "Soybean", avgYieldKgPerHa: 1680, season: "Kharif", productionShare: "18%" },
      { cropName: "Chickpea", avgYieldKgPerHa: 1040, season: "Rabi", productionShare: "11%" }
    ],
    drivers: ["Drought in Marathwada/Vidarbha", "Pest outbreak risks (Pink bollworm)"]
  },
  {
    id: "gujarat",
    name: "Gujarat",
    lat: 22.2587,
    lng: 71.1924,
    score: 52,
    riskLevel: "MODERATE",
    weather: {
      temperatureC: 27.8,
      humidityPct: 65,
      rainfallMm: 780,
      windSpeedMs: 3.6,
      solarRadiation: 22.1,
      conditionSummary: "Semi-arid to arid coastal plains"
    },
    mainCropProduction: [
      { cropName: "Cotton", avgYieldKgPerHa: 2150, season: "Kharif", productionShare: "42%" },
      { cropName: "Groundnut", avgYieldKgPerHa: 2280, season: "Kharif", productionShare: "32%" },
      { cropName: "Castor", avgYieldKgPerHa: 1980, season: "Kharif", productionShare: "12%" },
      { cropName: "Wheat", avgYieldKgPerHa: 3120, season: "Rabi", productionShare: "9%" }
    ],
    drivers: ["Cyclone and coastal salinity risk", "Irregular rainfall distribution"]
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    score: 48,
    riskLevel: "MODERATE",
    weather: {
      temperatureC: 25.8,
      humidityPct: 71,
      rainfallMm: 980,
      windSpeedMs: 2.3,
      solarRadiation: 18.9,
      conditionSummary: "Gangetic alluvial fertile plains"
    },
    mainCropProduction: [
      { cropName: "Wheat", avgYieldKgPerHa: 3840, season: "Rabi", productionShare: "45%" },
      { cropName: "Sugarcane", avgYieldKgPerHa: 72000, season: "Annual", productionShare: "26%" },
      { cropName: "Rice", avgYieldKgPerHa: 2650, season: "Kharif", productionShare: "21%" },
      { cropName: "Potato", avgYieldKgPerHa: 24500, season: "Rabi", productionShare: "5%" }
    ],
    drivers: ["Flood in Eastern UP", "Fog and cold wave during wheat flowering"]
  },
  {
    id: "karnataka",
    name: "Karnataka",
    lat: 15.3173,
    lng: 75.7139,
    score: 64,
    riskLevel: "HIGH",
    weather: {
      temperatureC: 26.2,
      humidityPct: 75,
      rainfallMm: 1150,
      windSpeedMs: 3.1,
      solarRadiation: 20.8,
      conditionSummary: "Varied Western Ghats to dry Northern plains"
    },
    mainCropProduction: [
      { cropName: "Rice", avgYieldKgPerHa: 3180, season: "Kharif", productionShare: "35%" },
      { cropName: "Maize", avgYieldKgPerHa: 3620, season: "Kharif", productionShare: "25%" },
      { cropName: "Sugarcane", avgYieldKgPerHa: 91000, season: "Annual", productionShare: "20%" },
      { cropName: "Cotton", avgYieldKgPerHa: 1650, season: "Kharif", productionShare: "12%" }
    ],
    drivers: ["Dry spells in North Karnataka", "Soil erosion in hilly terrains"]
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    lat: 22.9868,
    lng: 87.855,
    score: 55,
    riskLevel: "MODERATE",
    weather: {
      temperatureC: 27.1,
      humidityPct: 84,
      rainfallMm: 1650,
      windSpeedMs: 2.7,
      solarRadiation: 17.5,
      conditionSummary: "Humid Gangetic delta with high monsoon rainfall"
    },
    mainCropProduction: [
      { cropName: "Rice", avgYieldKgPerHa: 3120, season: "Kharif & Boro", productionShare: "68%" },
      { cropName: "Jute", avgYieldKgPerHa: 2540, season: "Kharif", productionShare: "18%" },
      { cropName: "Potato", avgYieldKgPerHa: 28900, season: "Rabi", productionShare: "8%" },
      { cropName: "Maize", avgYieldKgPerHa: 4210, season: "Rabi", productionShare: "4%" }
    ],
    drivers: ["Cyclonic storm surges", "Waterlogging in coastal delta"]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    lat: 27.0238,
    lng: 74.2179,
    score: 72,
    riskLevel: "CRITICAL",
    weather: {
      temperatureC: 30.1,
      humidityPct: 48,
      rainfallMm: 450,
      windSpeedMs: 4.2,
      solarRadiation: 23.5,
      conditionSummary: "Arid Thar desert to semi-arid eastern plains"
    },
    mainCropProduction: [
      { cropName: "Mustard", avgYieldKgPerHa: 1680, season: "Rabi", productionShare: "38%" },
      { cropName: "Bajra (Pearl Millet)", avgYieldKgPerHa: 1120, season: "Kharif", productionShare: "30%" },
      { cropName: "Gram / Chickpea", avgYieldKgPerHa: 1050, season: "Rabi", productionShare: "18%" },
      { cropName: "Wheat", avgYieldKgPerHa: 3450, season: "Rabi", productionShare: "10%" }
    ],
    drivers: ["Extreme heatwaves (>45°C)", "Severe rainfall deficit and drought"]
  },
  {
    id: "madhya-pradesh",
    name: "Madhya Pradesh",
    lat: 22.9734,
    lng: 78.6569,
    score: 50,
    riskLevel: "MODERATE",
    weather: {
      temperatureC: 25.9,
      humidityPct: 66,
      rainfallMm: 1020,
      windSpeedMs: 2.5,
      solarRadiation: 19.5,
      conditionSummary: "Central plateau with black cotton soil"
    },
    mainCropProduction: [
      { cropName: "Soybean", avgYieldKgPerHa: 1540, season: "Kharif", productionShare: "38%" },
      { cropName: "Wheat", avgYieldKgPerHa: 3620, season: "Rabi", productionShare: "35%" },
      { cropName: "Chickpea", avgYieldKgPerHa: 1180, season: "Rabi", productionShare: "17%" },
      { cropName: "Maize", avgYieldKgPerHa: 2450, season: "Kharif", productionShare: "6%" }
    ],
    drivers: ["Frost damage in winter during chickpea flowering", "Monsoon dry spells"]
  },
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    lat: 15.9129,
    lng: 79.74,
    score: 62,
    riskLevel: "HIGH",
    weather: {
      temperatureC: 28.8,
      humidityPct: 76,
      rainfallMm: 980,
      windSpeedMs: 3.5,
      solarRadiation: 21.2,
      conditionSummary: "Coastal plains & Rayalaseema rain-shadow zone"
    },
    mainCropProduction: [
      { cropName: "Rice", avgYieldKgPerHa: 3820, season: "Kharif & Rabi", productionShare: "54%" },
      { cropName: "Groundnut", avgYieldKgPerHa: 1750, season: "Kharif", productionShare: "20%" },
      { cropName: "Cotton", avgYieldKgPerHa: 1980, season: "Kharif", productionShare: "14%" },
      { cropName: "Chilli", avgYieldKgPerHa: 3450, season: "Annual", productionShare: "8%" }
    ],
    drivers: ["Rayalaseema drought sensitivity", "Coastal cyclone landfall damage"]
  },
  {
    id: "telangana",
    name: "Telangana",
    lat: 18.1124,
    lng: 79.0193,
    score: 56,
    riskLevel: "MODERATE",
    weather: {
      temperatureC: 28.1,
      humidityPct: 69,
      rainfallMm: 910,
      windSpeedMs: 2.9,
      solarRadiation: 20.6,
      conditionSummary: "Semi-arid Deccan plateau"
    },
    mainCropProduction: [
      { cropName: "Cotton", avgYieldKgPerHa: 1850, season: "Kharif", productionShare: "44%" },
      { cropName: "Rice", avgYieldKgPerHa: 3450, season: "Kharif & Rabi", productionShare: "38%" },
      { cropName: "Maize", avgYieldKgPerHa: 3890, season: "Kharif", productionShare: "10%" },
      { cropName: "Red Gram (Pigeonpea)", avgYieldKgPerHa: 890, season: "Kharif", productionShare: "5%" }
    ],
    drivers: ["High temperature during grain filling", "Bollworm pest incidence"]
  },
  {
    id: "bihar",
    name: "Bihar",
    lat: 25.0961,
    lng: 85.3131,
    score: 66,
    riskLevel: "HIGH",
    weather: {
      temperatureC: 25.4,
      humidityPct: 79,
      rainfallMm: 1180,
      windSpeedMs: 2.2,
      solarRadiation: 18.1,
      conditionSummary: "Gangetic plains prone to North Bihar summer floods"
    },
    mainCropProduction: [
      { cropName: "Rice", avgYieldKgPerHa: 2450, season: "Kharif", productionShare: "46%" },
      { cropName: "Maize", avgYieldKgPerHa: 4120, season: "Kharif & Rabi", productionShare: "28%" },
      { cropName: "Wheat", avgYieldKgPerHa: 2890, season: "Rabi", productionShare: "18%" },
      { cropName: "Pulses", avgYieldKgPerHa: 890, season: "Rabi", productionShare: "5%" }
    ],
    drivers: ["Recurrent summer flooding in Kosi basin", "Low mechanization"]
  },
  {
    id: "haryana",
    name: "Haryana",
    lat: 29.0588,
    lng: 76.0856,
    score: 44,
    riskLevel: "MODERATE",
    weather: {
      temperatureC: 24.8,
      humidityPct: 61,
      rainfallMm: 580,
      windSpeedMs: 3.0,
      solarRadiation: 20.1,
      conditionSummary: "Indo-Gangetic plains with dense canal/tube-well network"
    },
    mainCropProduction: [
      { cropName: "Wheat", avgYieldKgPerHa: 4680, season: "Rabi", productionShare: "48%" },
      { cropName: "Rice (Basmati)", avgYieldKgPerHa: 3820, season: "Kharif", productionShare: "32%" },
      { cropName: "Mustard", avgYieldKgPerHa: 1950, season: "Rabi", productionShare: "12%" },
      { cropName: "Cotton", avgYieldKgPerHa: 1840, season: "Kharif", productionShare: "6%" }
    ],
    drivers: ["Falling water table", "High chemical fertilizer intensity"]
  },
  {
    id: "kerala",
    name: "Kerala",
    lat: 10.8505,
    lng: 76.2711,
    score: 46,
    riskLevel: "MODERATE",
    weather: {
      temperatureC: 27.3,
      humidityPct: 86,
      rainfallMm: 2950,
      windSpeedMs: 2.6,
      solarRadiation: 16.8,
      conditionSummary: "Humid tropical coastal belt with heavy double monsoon"
    },
    mainCropProduction: [
      { cropName: "Rubber", avgYieldKgPerHa: 1450, season: "Perennial", productionShare: "38%" },
      { cropName: "Coconut", avgYieldKgPerHa: 9800, season: "Perennial", productionShare: "32%" },
      { cropName: "Rice", avgYieldKgPerHa: 2850, season: "Virippu & Mundakan", productionShare: "15%" },
      { cropName: "Spices (Pepper/Cardamom)", avgYieldKgPerHa: 720, season: "Perennial", productionShare: "10%" }
    ],
    drivers: ["Landslides during heavy monsoon bursts", "Fungal disease in humid climate"]
  },
  {
    id: "odisha",
    name: "Odisha",
    lat: 20.9517,
    lng: 85.0985,
    score: 65,
    riskLevel: "HIGH",
    weather: {
      temperatureC: 26.8,
      humidityPct: 81,
      rainfallMm: 1450,
      windSpeedMs: 3.3,
      solarRadiation: 18.5,
      conditionSummary: "Eastern coastal state vulnerable to Bay of Bengal cyclones"
    },
    mainCropProduction: [
      { cropName: "Rice", avgYieldKgPerHa: 2180, season: "Kharif", productionShare: "76%" },
      { cropName: "Pulses", avgYieldKgPerHa: 680, season: "Rabi", productionShare: "12%" },
      { cropName: "Oilseeds (Sesame/Groundnut)", avgYieldKgPerHa: 980, season: "Kharif", productionShare: "7%" }
    ],
    drivers: ["Bay of Bengal cyclones during October-November", "Poor irrigation coverage"]
  },
  {
    id: "assam",
    name: "Assam",
    lat: 26.2006,
    lng: 92.9376,
    score: 60,
    riskLevel: "MODERATE",
    weather: {
      temperatureC: 23.9,
      humidityPct: 85,
      rainfallMm: 2450,
      windSpeedMs: 2.1,
      solarRadiation: 16.2,
      conditionSummary: "Subtropical humid Brahmaputra valley"
    },
    mainCropProduction: [
      { cropName: "Tea", avgYieldKgPerHa: 2150, season: "Perennial", productionShare: "48%" },
      { cropName: "Rice (Sali)", avgYieldKgPerHa: 2120, season: "Kharif", productionShare: "42%" },
      { cropName: "Jute", avgYieldKgPerHa: 2280, season: "Kharif", productionShare: "6%" }
    ],
    drivers: ["Brahmaputra river flooding", "Soil acidity in tea plantations"]
  }
];

export function InteractiveRiskMap() {
  const [selectedState, setSelectedState] = useState<StateAgriculturalProfile>(ALL_INDIAN_STATES[0]);
  const [mapEngine, setMapEngine] = useState<"google" | "osm">("google");

  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Map & State Selector View */}
      <Card className="flex flex-col min-h-[500px] shadow-lg border border-slate-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3">
          <div>
            <CardTitle>India Regional Risk Map</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Select any Indian State to view real weather parameters & main crop production data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Map Engine Toggle */}
            <div className="flex rounded-lg border border-slate-300 p-0.5 bg-slate-100 text-xs font-semibold">
              <button
                onClick={() => setMapEngine("google")}
                className={`px-2 py-1 rounded-md transition-all ${mapEngine === "google" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                Google Maps
              </button>
              <button
                onClick={() => setMapEngine("osm")}
                className={`px-2 py-1 rounded-md transition-all ${mapEngine === "osm" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                OpenStreetMap
              </button>
            </div>

            {/* State Dropdown Selector */}
            <select
              id="state-select"
              value={selectedState.id}
              onChange={(e) => {
                const found = ALL_INDIAN_STATES.find((s) => s.id === e.target.value);
                if (found) setSelectedState(found);
              }}
              className="rounded-lg border-2 border-crop/40 bg-white px-3 py-1.5 text-sm font-bold text-slate-900 shadow-sm focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
            >
              {ALL_INDIAN_STATES.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name} ({state.riskLevel})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Embedded Interactive Map View */}
        <div className="relative mt-4 flex-1 min-h-[380px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner">
          <iframe
            title={`${selectedState.name} Agricultural Risk Map`}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "380px" }}
            loading="lazy"
            src={
              mapEngine === "google" && googleApiKey
                ? `https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${encodeURIComponent(selectedState.name + ", India")}&zoom=7`
                : `https://www.openstreetmap.org/export/embed.html?bbox=${selectedState.lng - 2.5}%2C${selectedState.lat - 2.5}%2C${selectedState.lng + 2.5}%2C${selectedState.lat + 2.5}&layer=mapnik&marker=${selectedState.lat}%2C${selectedState.lng}`
            }
          />

          {/* Floating Map Badge */}
          <div className="absolute top-3 left-3 z-10 rounded-lg bg-white/95 px-3 py-1.5 shadow-md backdrop-blur border border-slate-200">
            <p className="text-xs font-bold text-slate-900">{selectedState.name}</p>
            <p className="text-[11px] text-slate-500">
              Engine: {mapEngine === "google" ? "Google Maps API" : "OpenStreetMap"} · Lat: {selectedState.lat.toFixed(2)}° N
            </p>
          </div>
        </div>
      </Card>

      {/* State Weather & Crop Production Detail Inspector */}
      <div className="space-y-4">
        <Card className="border-2 border-crop/40 bg-white shadow-xl">
          <div className="flex items-start justify-between border-b pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-crop">State Overview</span>
              <h2 className="mt-0.5 text-2xl font-bold text-slate-950">{selectedState.name}</h2>
            </div>
            <RiskBadge level={selectedState.riskLevel} />
          </div>

          {/* Risk Score Metric */}
          <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Agricultural Risk Index</p>
              <p className="mt-0.5 text-3xl font-extrabold text-slate-950">{selectedState.score}/100</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Monsoon & Climate Fit</span>
              <p className="text-sm font-semibold text-slate-800">{selectedState.weather.conditionSummary}</p>
            </div>
          </div>

          {/* Weather Conditions Grid */}
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Weather & Climate Conditions</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-sky-50 p-2.5 border border-sky-100">
                <span className="text-slate-500">Average Temp</span>
                <p className="mt-0.5 text-base font-bold text-sky-950">{selectedState.weather.temperatureC} °C</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2.5 border border-emerald-100">
                <span className="text-slate-500">Annual Rainfall</span>
                <p className="mt-0.5 text-base font-bold text-emerald-950">{selectedState.weather.rainfallMm} mm</p>
              </div>
              <div className="rounded-lg bg-indigo-50 p-2.5 border border-indigo-100">
                <span className="text-slate-500">Relative Humidity</span>
                <p className="mt-0.5 text-base font-bold text-indigo-950">{selectedState.weather.humidityPct} %</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-2.5 border border-amber-100">
                <span className="text-slate-500">Solar Radiation</span>
                <p className="mt-0.5 text-base font-bold text-amber-950">{selectedState.weather.solarRadiation} MJ/m²</p>
              </div>
            </div>
          </div>

          {/* Main Crop Production Breakdown */}
          <div className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Main Crop Production</h3>
            <div className="mt-2 space-y-2">
              {selectedState.mainCropProduction.map((crop) => (
                <div key={crop.cropName} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{crop.cropName}</p>
                    <p className="text-xs text-slate-500">{crop.season} season · {crop.productionShare} production share</p>
                  </div>
                  <span className="rounded-md bg-crop/15 px-2.5 py-1 text-xs font-bold text-crop">
                    {crop.avgYieldKgPerHa.toLocaleString()} kg/ha
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Risk Drivers */}
          <div className="mt-5 border-t pt-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Primary Regional Risk Drivers</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc pl-4">
              {selectedState.drivers.map((driver) => (
                <li key={driver}>{driver}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
}
