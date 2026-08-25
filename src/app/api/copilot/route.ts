import { NextRequest, NextResponse } from "next/server";
import { getCropBenchmarkStats, getHistoricalYieldTrends } from "@/lib/data/historical-dataset";
import { cropRisk, recommendations } from "@/lib/mock/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const question = (body.question || "").toLowerCase();

    // Check if the user is asking about specific crops in the dataset
    let detectedCrop = "rice";
    if (question.includes("maize")) detectedCrop = "maize";
    else if (question.includes("chickpea") || question.includes("gram")) detectedCrop = "chickpea";
    else if (question.includes("groundnut") || question.includes("peanut")) detectedCrop = "groundnut";
    else if (question.includes("cotton")) detectedCrop = "cotton";
    else if (question.includes("wheat")) detectedCrop = "wheat";

    const stats = getCropBenchmarkStats(detectedCrop);
    const trends = getHistoricalYieldTrends(detectedCrop);

    let answer = `Your ${detectedCrop} crop risk is currently monitored. Based on historical data (${stats ? stats.recordCount : 0} historical entries), average historical yield for ${detectedCrop} is ${stats ? stats.avgYieldKgPerHa : 1200} kg/ha with recommended N-P-K nutrient intake of ${stats ? `${stats.avgNReq}-${stats.avgPReq}-${stats.avgKReq}` : "20-10-15"} kg/ha under optimal temperature (~${stats ? stats.avgTempC : 25}°C) and rainfall (~${stats ? stats.avgRainfallMm : 1000}mm).`;

    if (question.includes("yield") || question.includes("production")) {
      answer = `Based on historical crop records across India, ${detectedCrop} has an average yield of ${stats?.avgYieldKgPerHa} kg/ha (ranging from ${stats?.minYieldKgPerHa} to ${stats?.maxYieldKgPerHa} kg/ha). Top producing regions include ${stats?.topStates.join(", ")}.`;
    } else if (question.includes("fertilizer") || question.includes("nutrient") || question.includes("npk")) {
      answer = `For optimal ${detectedCrop} growth, historical data recommends: Nitrogen (N): ${stats?.avgNReq} kg/ha, Phosphorus (P): ${stats?.avgPReq} kg/ha, Potassium (K): ${stats?.avgKReq} kg/ha, with a target soil pH around ${stats?.avgPh}.`;
    }

    return NextResponse.json({
      answer,
      reasoning: cropRisk.factors,
      confidence: cropRisk.confidence,
      recommendedAction: recommendations[0],
      datasetStats: stats,
      recentTrend: trends.slice(-5),
      freshness: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      answer: "Your crop risk is monitored using historical yield & climate benchmarks.",
      reasoning: cropRisk.factors,
      confidence: cropRisk.confidence,
      recommendedAction: recommendations[0],
      freshness: cropRisk.updatedAt
    });
  }
}
