import { NextResponse } from "next/server";
import { getCropBenchmarkStats } from "@/lib/data/historical-dataset";
import { cropRecommendations } from "@/lib/mock/data";

export function POST() {
  const enrichedRecommendations = cropRecommendations.map((rec) => {
    const stats = getCropBenchmarkStats(rec.crop);
    if (!stats) return rec;

    return {
      ...rec,
      expectedYield: stats.avgYieldKgPerHa ? Math.round((stats.avgYieldKgPerHa / 1000) * 10) / 10 : rec.expectedYield,
      historicalStats: {
        totalRecords: stats.recordCount,
        avgYieldKgPerHa: stats.avgYieldKgPerHa,
        optimalTempC: stats.avgTempC,
        optimalRainfallMm: stats.avgRainfallMm,
        nReq: stats.avgNReq,
        pReq: stats.avgPReq,
        kReq: stats.avgKReq
      }
    };
  });

  return NextResponse.json({ recommendations: enrichedRecommendations });
}
