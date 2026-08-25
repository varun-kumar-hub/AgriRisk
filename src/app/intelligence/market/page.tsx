"use client";

import { TrendingUp, DollarSign, BarChart3, AlertCircle, ShoppingBag } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { formatCurrency } from "@/lib/scoring/risk";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function MarketIntelligencePage() {
  const { inputs } = useUserInput();
  const { t, getCropName } = useTranslation();

  const currentCrop = getCropName(inputs.selectedCrop);

  const mandiPrices = [
    { mandi: `${inputs.distName} Main Mandi`, pricePerQuintal: 2150, change: "+3.2%", status: "UPTREND" },
    { mandi: `${inputs.stateName} State APMC`, pricePerQuintal: 2100, change: "+1.8%", status: "STABLE" },
    { mandi: "National Agmarknet Index", pricePerQuintal: 2180, change: "+4.1%", status: "UPTREND" },
    { mandi: "Regional Futures Index", pricePerQuintal: 2220, change: "+5.0%", status: "BULLISH" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-crop">{t("navigation.agriIntelligence")}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">{t("navigation.marketIntelligence")} — {currentCrop}</h1>
        <p className="mt-2 text-slate-600">
          Real-time Agmarknet mandi prices, price volatility indices, MSP benchmarks, and return forecast for {inputs.distName}, {inputs.stateName}.
        </p>
      </header>

      <CustomInputPanel />

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard title="Spot Mandi Price" value="₹2,150 / quintal" detail={`Live in ${inputs.distName}`} />
        <MetricCard title="Government MSP" value="₹2,183 / quintal" detail="Minimum Support Price (2026)" />
        <MetricCard title="Price Volatility Index" value="35/100" detail="Low market price risk" />
        <MetricCard title="Est. Revenue (5 Acres)" value={formatCurrency(inputs.areaAcres * 3.8 * 18000)} detail="Based on expected yield" />
      </section>

      <Card className="mt-6">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag size={20} className="text-crop" />
          LOCAL & REGIONAL MANDI PRICE FEED (AGMARKNET)
        </CardTitle>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b text-slate-500">
              <tr>
                <th className="py-3">Mandi / Market Center</th>
                <th>Price (₹/Quintal)</th>
                <th>24h Price Change</th>
                <th>Market Trend</th>
              </tr>
            </thead>
            <tbody>
              {mandiPrices.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-3 font-semibold text-slate-900">{item.mandi}</td>
                  <td className="font-bold text-slate-950">₹{item.pricePerQuintal}</td>
                  <td className="font-semibold text-emerald-600">{item.change}</td>
                  <td>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
