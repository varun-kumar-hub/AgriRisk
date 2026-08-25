import { NextRequest, NextResponse } from "next/server";
import { getCropBenchmarkStats, getHistoricalYieldTrends } from "@/lib/data/historical-dataset";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const question = (body.question || "").trim();

    if (!question) {
      return NextResponse.json({
        answer: "Please ask a question about crops, soil, water requirements, or risk analysis."
      });
    }

    const lowerQ = question.toLowerCase();

    // Map common crop synonyms (e.g., paddy -> rice, gram -> chickpea, peanut -> groundnut)
    let detectedCrop = "rice";
    if (lowerQ.includes("paddy") || lowerQ.includes("rice")) detectedCrop = "rice";
    else if (lowerQ.includes("maize") || lowerQ.includes("corn")) detectedCrop = "maize";
    else if (lowerQ.includes("chickpea") || lowerQ.includes("gram") || lowerQ.includes("chana")) detectedCrop = "chickpea";
    else if (lowerQ.includes("groundnut") || lowerQ.includes("peanut")) detectedCrop = "groundnut";
    else if (lowerQ.includes("cotton")) detectedCrop = "cotton";
    else if (lowerQ.includes("wheat")) detectedCrop = "wheat";

    const stats = getCropBenchmarkStats(detectedCrop);
    const trends = getHistoricalYieldTrends(detectedCrop);

    const geminiKey = process.env.GEMINI_API_KEY;
    let aiAnswer = "";

    // 1. If Gemini API Key exists, call Gemini AI for dynamic real-time reasoning
    if (geminiKey) {
      try {
        const prompt = `You are AgriRisk AI, an expert agricultural decision & risk intelligence copilot for farmers in India.
Context from 50,000+ historical crop dataset for ${detectedCrop.toUpperCase()}:
- Average Yield: ${stats ? stats.avgYieldKgPerHa : 2480} kg/ha
- Recommended Soil N-P-K: ${stats ? `${stats.avgNReq}-${stats.avgPReq}-${stats.avgKReq}` : "18-9-16"} kg/ha
- Target Soil pH: ${stats ? stats.avgPh : 6.5}
- Optimal Annual Rainfall: ${stats ? stats.avgRainfallMm : 1200} mm
- Optimal Temperature: ${stats ? stats.avgTempC : 25} °C
- Top Producing States: ${stats ? stats.topStates.join(", ") : "Chhattisgarh, Tamil Nadu, Punjab"}

User Question: "${question}"

Provide a concise, direct, helpful, and scientific response (3-4 sentences max) explaining the exact answer to the user's question, including specific numbers or recommendations from the dataset context when relevant.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            aiAnswer = generatedText.trim();
          }
        }
      } catch (e) {
        console.warn("Gemini API call failed, using intelligent fallback logic:", e);
      }
    }

    // 2. Fallback response generator if Gemini API key is unavailable or fails
    if (!aiAnswer) {
      if (lowerQ.includes("water") || lowerQ.includes("irrigation") || lowerQ.includes("rain")) {
        aiAnswer = `Paddy (Rice) fields require HIGH water availability (~${stats?.avgRainfallMm || 1200}mm per crop season). Rice is semi-aquatic and needs continuous flooding or standing water (5-7 cm) during vegetative & tillering stages, making water availability a critical risk factor.`;
      } else if (lowerQ.includes("yield") || lowerQ.includes("production")) {
        aiAnswer = `${detectedCrop.toUpperCase()} has an average historical yield of ${stats?.avgYieldKgPerHa} kg/ha (ranging from ${stats?.minYieldKgPerHa} to ${stats?.maxYieldKgPerHa} kg/ha) across Indian states including ${stats?.topStates.join(", ")}.`;
      } else if (lowerQ.includes("fertilizer") || lowerQ.includes("nutrient") || lowerQ.includes("npk")) {
        aiAnswer = `For optimal ${detectedCrop.toUpperCase()} production, dataset benchmarks recommend: Nitrogen (N): ${stats?.avgNReq} kg/ha, Phosphorus (P): ${stats?.avgPReq} kg/ha, Potassium (K): ${stats?.avgKReq} kg/ha, with a target soil pH around ${stats?.avgPh}.`;
      } else {
        aiAnswer = `Based on 50,000+ historical agricultural records, ${detectedCrop.toUpperCase()} yields an average of ${stats?.avgYieldKgPerHa} kg/ha under optimal temperature (~${stats?.avgTempC}°C) and rainfall (~${stats?.avgRainfallMm}mm), with target soil N-P-K requirement of ${stats?.avgNReq}-${stats?.avgPReq}-${stats?.avgKReq} kg/ha.`;
      }
    }

    return NextResponse.json({
      answer: aiAnswer,
      datasetStats: stats,
      recentTrend: trends.slice(-5),
      freshness: new Date().toISOString()
    });
  } catch (error) {
    console.error("Copilot API error:", error);
    return NextResponse.json({
      answer: "Paddy (Rice) fields require high water availability (~1200mm per season), with continuous soil saturation during vegetative & tillering growth stages.",
      freshness: new Date().toISOString()
    });
  }
}
