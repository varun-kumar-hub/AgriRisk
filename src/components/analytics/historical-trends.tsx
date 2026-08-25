"use client";

import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardTitle } from "@/components/ui/card";
import type { CropBenchmarkStats } from "@/lib/data/historical-dataset";

interface HistoricalTrendsProps {
  initialStats?: CropBenchmarkStats | null;
  trendsData?: Array<{ year: number; avgYield: number; avgRainfall: number }>;
}

export function HistoricalTrendsVisualizer({ initialStats, trendsData = [] }: HistoricalTrendsProps) {
  const [selectedCrop, setSelectedCrop] = useState("rice");

  return (
    <Card className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Historical Yield & Climate Benchmarks (1966–Present)</CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            Analysis powered by {initialStats?.recordCount.toLocaleString() || "50,000+"} historical crop yield and climate records.
          </p>
        </div>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-crop"
        >
          <option value="rice">Rice</option>
          <option value="maize">Maize</option>
          <option value="chickpea">Chickpea</option>
        </select>
      </div>

      {initialStats && (
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">Avg Yield</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{initialStats.avgYieldKgPerHa} kg/ha</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">Optimal N-P-K</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {initialStats.avgNReq}-{initialStats.avgPReq}-{initialStats.avgKReq} kg/ha
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">Avg Rainfall</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{initialStats.avgRainfallMm} mm</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">Optimal Temp</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{initialStats.avgTempC} °C</p>
          </div>
        </div>
      )}

      {trendsData.length > 0 && (
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendsData}>
              <XAxis dataKey="year" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="avgYield" name="Yield (kg/ha)" stroke="#1f7a8c" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="avgRainfall" name="Rainfall (mm)" stroke="#0284c7" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
