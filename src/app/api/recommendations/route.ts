import { NextRequest, NextResponse } from "next/server";
import { predictActionRecommendationsWithGemini } from "@/lib/ai/gemini-predictor";
import { defaultUserInputs, type CustomUserInputs } from "@/lib/data/store";
import type { SupportedLanguage } from "@/lib/i18n/config";
import { recommendations as fallbackRecs } from "@/lib/mock/data";

export async function GET() {
  return NextResponse.json({ recommendations: fallbackRecs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const inputs: CustomUserInputs = {
      ...defaultUserInputs,
      ...(body.inputs || body)
    };
    const language: SupportedLanguage = body.language || "en";

    const aiRecommendations = await predictActionRecommendationsWithGemini(inputs, language);

    return NextResponse.json({
      recommendations: aiRecommendations.length > 0 ? aiRecommendations : fallbackRecs,
      inputs,
      language,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Action Recommendations API error:", error);
    return NextResponse.json({ recommendations: fallbackRecs });
  }
}
