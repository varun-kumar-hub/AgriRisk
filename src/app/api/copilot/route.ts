import { NextResponse } from "next/server";
import { cropRisk, recommendations } from "@/lib/mock/data";

export function POST() {
  return NextResponse.json({
    answer:
      "Your rice crop risk is high because rainfall deficit and rising temperatures are increasing water stress during the vegetative stage.",
    reasoning: cropRisk.factors,
    confidence: cropRisk.confidence,
    recommendedAction: recommendations[0],
    freshness: cropRisk.updatedAt
  });
}
