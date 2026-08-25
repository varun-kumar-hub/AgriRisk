import { NextRequest, NextResponse } from "next/server";
import { predictCropRecommendationsWithGemini } from "@/lib/ai/gemini-predictor";
import { defaultUserInputs, type CustomUserInputs } from "@/lib/data/store";
import type { SupportedLanguage } from "@/lib/i18n/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const inputs: CustomUserInputs = {
      ...defaultUserInputs,
      ...(body.inputs || body)
    };
    const language: SupportedLanguage = body.language || "en";

    const recommendations = await predictCropRecommendationsWithGemini(inputs, language);

    return NextResponse.json({
      recommendations,
      inputs,
      language,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Crop Advisor API error:", error);
    return NextResponse.json({ error: "Failed to generate dynamic crop recommendations" }, { status: 500 });
  }
}
