import type { CustomUserInputs } from "@/lib/data/store";
import type { CropRecommendation, Recommendation, RiskLevel } from "@/types/domain";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/i18n/config";
import { calculateDynamicCropRecommendations } from "@/lib/data/store";

export async function predictCropRecommendationsWithGemini(
  inputs: CustomUserInputs,
  targetLang: SupportedLanguage = "en"
): Promise<CropRecommendation[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  const fallbackRecs = calculateDynamicCropRecommendations(inputs);

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. Using fallback dynamic benchmark engine.");
    return fallbackRecs;
  }

  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const prompt = `You are AgriRisk AI, an advanced agricultural risk & crop suitability prediction engine powered by Gemini 2.5 Flash for farmers in India.

Analyse the following real-time farm profile & soil parameters:
- Farm Location: ${inputs.distName}, ${inputs.stateName}
- Land Area: ${inputs.areaAcres} Acres
- Soil Type: ${inputs.soilType}
- Soil pH: ${inputs.soilPh}
- Soil N-P-K (kg/ha): N=${inputs.nitrogen}, P=${inputs.phosphorus}, K=${inputs.potassium}
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
    "decisionScore": 85, (integer 1-100)
    "riskScore": 25, (integer 1-100)
    "riskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
    "confidence": 0.88, (float 0.5-0.99)
    "expectedYield": 4.2, (tonnes per hectare, float)
    "marketScore": 82, (integer 1-100)
    "climateScore": 88, (integer 1-100)
    "soilScore": 90, (integer 1-100)
    "waterScore": 75, (integer 1-100)
    "productionScore": 85, (integer 1-100)
    "explanation": "Detailed 2-sentence agronomic explanation in ${langInfo.name} (${langInfo.nativeName}) of why this crop fits the soil pH (${inputs.soilPh}), N-P-K (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}), and ${inputs.rainfallMm}mm rainfall in ${inputs.distName}.",
    "whyNot": "Key agronomic risk or constraint for this crop in ${langInfo.name} (${langInfo.nativeName})."
  }
]

IMPORTANT:
- Ensure crop suitability scores, expected yield (t/ha), and risk levels accurately reflect the entered soil pH (${inputs.soilPh}), N-P-K (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}), temperature (${inputs.temperatureC}°C), and rainfall (${inputs.rainfallMm}mm).
- Explanations MUST be written in ${langInfo.name} (${langInfo.nativeName}).
- Return ONLY valid JSON array without markdown backticks.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json"
          }
        })
      }
    );

    if (!res.ok) {
      console.warn(`Gemini 2.5 Flash API error status ${res.status}. Falling back to benchmark engine.`);
      return fallbackRecs;
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) return fallbackRecs;

    const parsed: any[] = JSON.parse(rawText);

    return parsed.map((item) => {
      const expectedYield = typeof item.expectedYield === "number" ? item.expectedYield : 3.5;
      const expectedRevenue = Math.round(expectedYield * 18000 * inputs.areaAcres);
      const productionCost = Math.round(inputs.areaAcres * 9000);
      const estimatedProfit = expectedRevenue - productionCost;
      const riskScore = typeof item.riskScore === "number" ? item.riskScore : 30;
      const riskAdjustedProfit = Math.round(estimatedProfit * (1 - riskScore / 150));

      return {
        crop: item.crop || "Rice",
        decisionScore: item.decisionScore || 80,
        riskScore,
        riskLevel: (item.riskLevel || "MODERATE") as RiskLevel,
        confidence: item.confidence || 0.85,
        expectedYield,
        marketScore: item.marketScore || 80,
        climateScore: item.climateScore || 80,
        soilScore: item.soilScore || 80,
        waterScore: item.waterScore || 75,
        productionScore: item.productionScore || 80,
        expectedRevenue,
        productionCost,
        estimatedProfit,
        riskAdjustedProfit,
        explanation: item.explanation || `${item.crop} scored well based on your custom soil pH (${inputs.soilPh}) and climate.`,
        whyNot: item.whyNot || `Constrained by water or nutrient availability.`
      };
    }).sort((a, b) => b.decisionScore - a.decisionScore);
  } catch (err) {
    console.error("Gemini 2.5 Flash prediction failed:", err);
    return fallbackRecs;
  }
}

export async function predictActionRecommendationsWithGemini(
  inputs: CustomUserInputs,
  targetLang: SupportedLanguage = "en"
): Promise<Recommendation[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return [
      {
        id: "rec-1",
        priority: "HIGH",
        category: "FERTILIZER",
        title: "Apply Soil Nutrient Balancing (N-P-K Dosing)",
        reason: `Compensates N-P-K (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}) deficits for ${inputs.selectedCrop}.`,
        estimatedCost: Math.round(inputs.areaAcres * 1200),
        expectedRiskReduction: 18,
        expectedBenefit: `Enhance yield for ${inputs.selectedCrop} by compensating N-P-K deficits.`,
        confidence: 0.9
      },
      {
        id: "rec-2",
        priority: inputs.waterAvailability === "Low" ? "HIGH" : "MODERATE",
        category: "IRRIGATION",
        title: "Optimize Irrigation Moisture Protection",
        reason: `Maintains root-zone moisture during peak temperature (${inputs.temperatureC}°C).`,
        estimatedCost: Math.round(inputs.areaAcres * 800),
        expectedRiskReduction: 14,
        expectedBenefit: `Protect crop against moisture stress in ${inputs.distName}.`,
        confidence: 0.85
      }
    ];
  }

  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const prompt = `You are AgriRisk AI (Gemini 2.5 Flash), an agricultural field intervention engine for India.

Farm context:
- Crop: ${inputs.selectedCrop}
- Location: ${inputs.distName}, ${inputs.stateName}
- Area: ${inputs.areaAcres} Acres
- Soil pH: ${inputs.soilPh}
- N-P-K (kg/ha): ${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}
- Water Availability: ${inputs.waterAvailability}
- Temp / Rain: ${inputs.temperatureC}°C / ${inputs.rainfallMm}mm

Generate 4 prioritized agricultural field action recommendations in JSON format:
[
  {
    "id": "rec-1",
    "title": "Action Title in ${langInfo.name} (${langInfo.nativeName})",
    "category": "FERTILIZER" | "IRRIGATION" | "PEST_CONTROL" | "HARVEST" | "SOIL_AMENDMENT",
    "priority": "HIGH" | "MODERATE" | "LOW",
    "reason": "Detailed reason in ${langInfo.name} (${langInfo.nativeName})",
    "estimatedCost": 4500, (in Indian Rupees ₹)
    "expectedRiskReduction": 20, (points drop in risk)
    "expectedBenefit": "Specific benefit description in ${langInfo.name} (${langInfo.nativeName}) addressing soil pH (${inputs.soilPh}) and N-P-K (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}).",
    "confidence": 0.88
  }
]

IMPORTANT: Written in ${langInfo.name} (${langInfo.nativeName}). Return ONLY valid JSON array without markdown backticks.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json"
          }
        })
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return [];

    const parsed: any[] = JSON.parse(rawText);
    return parsed.map((item, idx) => ({
      id: `rec-ai-${idx + 1}`,
      priority: item.priority || "MODERATE",
      category: item.category || "FERTILIZER",
      title: item.title || "Field Action",
      reason: item.reason || item.expectedBenefit || "Optimizes crop growth.",
      estimatedCost: item.estimatedCost || 3000,
      expectedRiskReduction: item.expectedRiskReduction || 15,
      expectedBenefit: item.expectedBenefit || "Optimizes crop yield.",
      confidence: item.confidence || 0.85
    }));
  } catch (err) {
    console.error("Gemini 2.5 Flash action recommendation failed:", err);
    return [];
  }
}
