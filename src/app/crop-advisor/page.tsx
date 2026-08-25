import { CropCard } from "@/components/crop-advisor/crop-card";
import { Card, CardTitle } from "@/components/ui/card";
import { cropRecommendations, demoFarm } from "@/lib/mock/data";

export default function CropAdvisorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-crop">Before planting</p>
        <h1 className="mt-1 text-3xl font-bold">Crop Advisor</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          AgriRisk evaluates your soil, water, season, weather, market, yield, and economic context to answer what you should grow.
        </p>
      </header>
      <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_2fr]">
        <Card>
          <CardTitle>Farm Inputs</CardTitle>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Farm</dt><dd className="font-medium">{demoFarm.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Area</dt><dd className="font-medium">{demoFarm.areaAcres} acres</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Soil</dt><dd className="font-medium">{demoFarm.soilType}, pH {demoFarm.soilPh}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Water</dt><dd className="font-medium">{demoFarm.waterAvailability}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Season</dt><dd className="font-medium">Kharif 2026</dd></div>
          </dl>
          <p className="mt-5 rounded-md bg-slate-100 p-3 text-sm text-slate-600">
            Decision score weights are configurable and ready to be replaced by future ML output.
          </p>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {cropRecommendations.map((crop) => <CropCard key={crop.crop} crop={crop} />)}
        </div>
      </section>
    </div>
  );
}
