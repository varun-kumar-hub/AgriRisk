"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CropRisk } from "@/types/domain";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function CategoryBars({ risk }: { risk: CropRisk }) {
  const { t } = useTranslation();

  const getCategoryLabel = (category: string) => {
    switch (category.toLowerCase()) {
      case "weather": return t("risk.weatherRisk");
      case "water": return t("risk.waterAvailability");
      case "soil": return t("risk.soilRisk");
      case "market": return t("risk.marketVolatility");
      case "pest": return t("risk.pestVulnerability");
      case "production": return t("risk.yieldLossRisk");
      default: return category;
    }
  };

  const data = Object.entries(risk.categories).map(([category, score]) => ({
    category: getCategoryLabel(category),
    score
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="score" fill="#1f7a8c" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

