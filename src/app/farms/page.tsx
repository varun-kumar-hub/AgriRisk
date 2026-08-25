"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";

export default function FarmsPage() {
  const { farm, activeCropCycle, cropRisk, inputs } = useUserInput();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-crop">After planting</p>
          <h1 className="mt-1 text-3xl font-bold">My Farms</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-crop px-4 py-2 text-sm font-semibold text-white">
          <Plus size={16} /> Add farm
        </button>
      </header>

      <CustomInputPanel />

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardTitle>Farm Profile</CardTitle>
          <h2 className="mt-4 text-2xl font-semibold">{farm.name}</h2>
          <p className="mt-1 text-slate-600">{farm.location}</p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Area</dt><dd>{farm.areaAcres} acres</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Soil</dt><dd>{farm.soilType} (pH {farm.soilPh})</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Soil N-P-K</dt><dd>{inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium} kg/ha</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Irrigation</dt><dd>{farm.irrigationType}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Water</dt><dd>{farm.waterAvailability}</dd></div>
          </dl>
          <Link href={`/farms/${farm.id}`} className="mt-6 block rounded-md bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white">
            Open farm
          </Link>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Active Crop" value={activeCropCycle.crop} detail={`${activeCropCycle.season} · ${activeCropCycle.stage}`} />
          <MetricCard title="Crop Age" value={`${activeCropCycle.ageDays} days`} detail="Since sowing" />
          <MetricCard title="Crop Risk" value={`${cropRisk.overallScore}/100`} detail="Dynamic risk score"><RiskBadge level={cropRisk.level} /></MetricCard>
        </div>
      </section>
    </div>
  );
}

