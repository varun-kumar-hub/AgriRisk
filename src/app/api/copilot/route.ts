import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/config";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const farmName = context?.farmName || "Custom Farm";
    const selectedCrop = context?.selectedCrop || "Rice";
    const soilPh = context?.soilPh || 6.5;
    const cropAge = context?.cropAge || 45;
    const district = context?.district || "Durg";
    const state = context?.state || "Chhattisgarh";
    const waterAvailability = context?.waterAvailability || "Moderate";
    const temperatureC = context?.temperatureC || 25;
    const rainfallMm = context?.rainfallMm || 650;
    const langCode = context?.language || "en";

    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0];

    const systemPrompt = `You are AgriRisk AI Copilot, an expert agricultural decision assistant powered by Gemini 2.5 Flash for farmers in India.

Real-Time Farmer Context:
- Farm Name: ${farmName}
- Location: ${district}, ${state}
- Target Crop: ${selectedCrop}
- Soil pH: ${soilPh}
- Crop Age: ${cropAge} Days
- Water Availability: ${waterAvailability}
- Current Weather: ${temperatureC}°C, ${rainfallMm}mm rainfall

Farmer Question: "${message}"

Instructions:
1. Provide a direct, highly accurate, practical agronomic answer tailored specifically to the crop (${selectedCrop}), soil pH (${soilPh}), crop age (${cropAge} days), and local weather in ${district}, ${state}.
2. Keep response concise (2 to 4 bullet points max) so it fits cleanly in a mobile AI assistant chat bubble.
3. Language Requirement: Respond FULLY in ${langInfo.name} (${langInfo.nativeName}).
4. Do not use generic disclaimers. Give actionable advice on fertilizers, irrigation, pest control, crop selection, or risk mitigation.`;

    if (!apiKey) {
      return NextResponse.json({
        reply: `[Demo Mode] For ${selectedCrop} at ${cropAge} days in ${district}: Maintain optimal soil moisture, monitor leaf color for nutrient needs, and ensure proper field drainage under ${waterAvailability} water availability.`
      });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      })
    });

    if (!res.ok) {
      return NextResponse.json({
        reply: `For ${selectedCrop} (Age: ${cropAge} days, Soil pH: ${soilPh}) in ${district}: Apply balanced irrigation, watch for seasonal pests, and consult local KVK agronomic guidelines.`
      });
    }

    const data = await res.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      reply: replyText || `Advice for ${selectedCrop} (${cropAge} days): Ensure proper soil pH management and regular field monitoring.`
    });
  } catch (error) {
    console.error("Copilot API error:", error);
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
  }
}
