import type { CustomUserInputs } from "@/lib/data/store";
import type { CropRecommendation, Recommendation } from "@/types/domain";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/config";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export async function generateGeminiCropRecommendations(
  inputs: CustomUserInputs,
  targetLang: string = "en"
): Promise<CropRecommendation[] | null> {
  if (!apiKey) return null;

  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const prompt = `You are AgriRisk AI, an advanced agricultural risk & crop suitability prediction engine powered by Gemini 2.5 Flash for farmers in India.

Analyse the following real-time farm profile & soil parameters:
- Farm Location: ${inputs.distName}, ${inputs.stateName}
- Land Area: ${inputs.areaAcres} Acres
- Soil Type: ${inputs.soilType}
- Soil pH: ${inputs.soilPh}
- Crop Age: ${inputs.cropAge || 45} Days
- Water Availability: ${inputs.waterAvailability}
- Irrigation System: ${inputs.irrigationType}
- Annual Rainfall: ${inputs.rainfallMm} mm
- Average Temperature: ${inputs.temperatureC} °C
- Selected Crop: ${inputs.selectedCrop}

Task:
Evaluate suitability across ALL Indian agricultural crop categories including Cereals (Rice, Wheat, Maize, Sorghum, Bajra), Pulses (Chickpea, Pigeon Pea, Moong, Urad), Oilseeds (Groundnut, Mustard, Soybean, Sunflower, Sesame), Cash Crops (Cotton, Sugarcane, Jute), Vegetables (Tomato, Potato, Onion, Chilli, Brinjal, Okra, Garlic), and Fruits (Mango, Banana, Papaya, Watermelon) specifically for ${inputs.distName}, ${inputs.stateName}.

Generate an array of 6 top recommended crops from these diverse categories in JSON format matching this JSON schema:
[
  {
    "crop": "Crop Name (e.g. Tomato, Potato, Groundnut, Wheat, Rice, Cotton, Banana, Chickpea)",
    "decisionScore": 85,
    "riskScore": 25,
    "riskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
    "confidence": 0.88,
    "expectedYield": 4.2,
    "marketScore": 82,
    "climateScore": 88,
    "soilScore": 90,
    "waterScore": 75,
    "productionScore": 85,
    "explanation": "Detailed 2-sentence agronomic explanation in ${langInfo.name} (${langInfo.nativeName}) of why this crop fits the soil pH (${inputs.soilPh}), Crop Age (${inputs.cropAge || 45} Days), and ${inputs.rainfallMm}mm rainfall in ${inputs.distName}.",
    "whyNot": "Key agronomic risk or constraint for this crop in ${langInfo.name} (${langInfo.nativeName})."
  }
]

IMPORTANT:
- Ensure crop suitability scores, expected yield (t/ha), and risk levels accurately reflect the entered soil pH (${inputs.soilPh}), Crop Age (${inputs.cropAge || 45} Days), temperature (${inputs.temperatureC}°C), and rainfall (${inputs.rainfallMm}mm).
- Explanations MUST be written in ${langInfo.name} (${langInfo.nativeName}).
- Return ONLY valid JSON array without markdown backticks.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      })
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const rawJSON = JSON.parse(text);
    if (!Array.isArray(rawJSON)) return null;

    return rawJSON.map((item: any) => {
      const decisionScore = Math.min(98, Math.max(10, parseInt(item.decisionScore) || 75));
      const riskScore = Math.max(5, Math.min(95, 100 - decisionScore));
      const expectedYield = parseFloat(item.expectedYield) || 3.5;
      const expectedRevenue = Math.round(expectedYield * 18000 * inputs.areaAcres);
      const productionCost = Math.round(inputs.areaAcres * 9000);
      const estimatedProfit = expectedRevenue - productionCost;
      const riskAdjustedProfit = Math.round(estimatedProfit * (1 - riskScore / 150));

      return {
        crop: item.crop || "Rice",
        decisionScore,
        riskScore,
        riskLevel: item.riskLevel || (riskScore < 30 ? "LOW" : riskScore > 65 ? "HIGH" : "MODERATE"),
        confidence: parseFloat(item.confidence) || 0.88,
        expectedYield,
        marketScore: parseInt(item.marketScore) || 80,
        climateScore: parseInt(item.climateScore) || 85,
        soilScore: parseInt(item.soilScore) || 85,
        waterScore: parseInt(item.waterScore) || 75,
        productionScore: parseInt(item.productionScore) || 82,
        expectedRevenue,
        productionCost,
        estimatedProfit,
        riskAdjustedProfit,
        explanation: item.explanation || `${item.crop} is suitable for soil pH ${inputs.soilPh} and ${inputs.distName} weather conditions.`,
        whyNot: item.whyNot || ""
      };
    });
  } catch (err) {
    console.error("Gemini 2.5 Flash Crop Recommendation failed:", err);
    return null;
  }
}

export async function generateGeminiActionRecommendations(
  inputs: CustomUserInputs,
  targetLang: string = "en"
): Promise<Recommendation[] | null> {
  if (!apiKey) return null;

  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const prompt = `You are AgriRisk AI (Gemini 2.5 Flash), an agricultural field intervention engine for India.

Farm context:
- Crop: ${inputs.selectedCrop}
- Location: ${inputs.distName}, ${inputs.stateName}
- Area: ${inputs.areaAcres} Acres
- Soil pH: ${inputs.soilPh}
- Crop Age: ${inputs.cropAge || 45} Days
- Water Availability: ${inputs.waterAvailability}
- Temp / Rain: ${inputs.temperatureC}°C / ${inputs.rainfallMm}mm

Generate 4 prioritized agricultural field action recommendations in JSON format:
[
  {
    "id": "rec-1",
    "title": "Action Title in ${langInfo.name} (${langInfo.nativeName})",
    "category": "IRRIGATION" | "PEST_CONTROL" | "HARVEST" | "SOIL_AMENDMENT",
    "priority": "HIGH" | "MODERATE" | "LOW",
    "reason": "Detailed reason in ${langInfo.name} (${langInfo.nativeName})",
    "estimatedCost": 4500,
    "expectedRiskReduction": 20,
    "expectedBenefit": "Specific benefit description in ${langInfo.name} (${langInfo.nativeName}) addressing soil pH (${inputs.soilPh}) and Crop Age (${inputs.cropAge || 45} Days).",
    "confidence": 0.88
  }
]

IMPORTANT: Written in ${langInfo.name} (${langInfo.nativeName}). Return ONLY valid JSON array without markdown backticks.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      })
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const rawJSON = JSON.parse(text);
    if (!Array.isArray(rawJSON)) return null;

    return rawJSON.map((item: any, idx: number) => ({
      id: item.id || `rec-${idx + 1}`,
      priority: item.priority || "MODERATE",
      category: item.category || "CROP_MANAGEMENT",
      title: item.title || "Field Action Item",
      reason: item.reason || `Optimizes growing conditions for ${inputs.selectedCrop} at ${inputs.cropAge || 45} Days.`,
      estimatedCost: parseInt(item.estimatedCost) || Math.round(inputs.areaAcres * 1000),
      expectedRiskReduction: parseInt(item.expectedRiskReduction) || 15,
      expectedBenefit: item.expectedBenefit || "Enhances field productivity.",
      confidence: parseFloat(item.confidence) || 0.85
    }));
  } catch (err) {
    console.error("Gemini 2.5 Flash Action Recommendations failed:", err);
    return null;
  }
}

// Aliases for compatibility
export const predictCropRecommendationsWithGemini = generateGeminiCropRecommendations;
export const predictActionRecommendationsWithGemini = generateGeminiActionRecommendations;
