import { NextRequest, NextResponse } from "next/server";
import { predictActionRecommendationsWithGemini } from "@/lib/ai/gemini-predictor";
import { defaultUserInputs, type CustomUserInputs } from "@/lib/data/store";
import type { SupportedLanguage } from "@/lib/i18n/config";

function getLocalizedActionRecommendations(inputs: CustomUserInputs, language: SupportedLanguage) {
  const crop = inputs.selectedCrop || "Rice";
  const ph = inputs.soilPh || 6.5;
  const temp = inputs.temperatureC || 25;
  const rain = inputs.rainfallMm || 1000;
  const dist = inputs.distName || "Durg";

  if (language === "te") {
    return [
      {
        id: "rec-1",
        actionType: "ఎరువుల యాజమాన్యం",
        priority: "HIGH",
        title: `${crop} పంటకు యురియా & DAP ఎరువుల మోతాదు`,
        reason: `నేల pH ${ph} వద్ద నత్రజని లోపాన్ని నివారించడానికి ఎకరాకు 45 కిలోల యురియాను 3 విడతల్లో అందించండి.`,
        expectedBenefit: "దిగుబడి 18% పెరుగుతుంది",
        estimatedCost: 1800,
        expectedRiskReduction: 22
      },
      {
        id: "rec-2",
        actionType: "తెగుళ్ల నివారణ",
        priority: "MODERATE",
        title: `వేప నూనె (Neem Oil) పిచికారీ`,
        reason: `${dist} లో ఉష్ణోగ్రత (${temp}°C) వల్ల కాండం తొలుచు పురుగుల దాడి కాకుండా 5% వేప నూనెను పిచికారీ చేయండి.`,
        expectedBenefit: "పురుగుల దాడి 90% నివారింపబడుతుంది",
        estimatedCost: 650,
        expectedRiskReduction: 18
      },
      {
        id: "rec-3",
        actionType: "నీటి యాజమాన్యం",
        priority: "LOW",
        title: `AWD నీటి సేద్య పద్ధతి`,
        reason: `${rain}మి.మీ వర్షపాతం వద్ద నీటిని నిల్వ ఉంచుతూ 25% నీటిని పొదుపు చేయవచ్చు.`,
        expectedBenefit: "నీటి పొదుపు & వేర్ల ఆరోగ్యం",
        estimatedCost: 0,
        expectedRiskReduction: 12
      }
    ];
  } else if (language === "ta") {
    return [
      {
        id: "rec-1",
        actionType: "உர மேலாண்மை",
        priority: "HIGH",
        title: `${crop} பயிருக்கான யூரியா உரம் மேலாண்மை`,
        reason: `மண்ணின் pH ${ph} நிலவரப்படி நைட்ரஜன் சத்தை அதிகரிக்க ஏக்கருக்கு 45 கிலோ யூரியா இடவும்.`,
        expectedBenefit: "மகசூல் 18% அதிகரிக்கும்",
        estimatedCost: 1800,
        expectedRiskReduction: 22
      },
      {
        id: "rec-2",
        actionType: "பூச்சி மேலாண்மை",
        priority: "MODERATE",
        title: "இயற்கை வேப்ப எண்ணெய் தெளித்தல்",
        reason: `பூச்சித் தாக்குதலைத் தடுக்க 5% வேப்ப எண்ணெய் கரைசலை 10 நாட்களுக்கு ஒருமுறை தெளிக்கவும்.`,
        expectedBenefit: "பூச்சி பாதிப்பு 90% குறையும்",
        estimatedCost: 650,
        expectedRiskReduction: 18
      },
      {
        id: "rec-3",
        actionType: "பாசன மேலாண்மை",
        priority: "LOW",
        title: "சீரான நீர் மேலாண்மை",
        reason: `${rain}மி.மீ மழைப்பொழிவுக்கு ஏற்ப பாசனத்தைச் சீராக திட்டமிடவும்.`,
        expectedBenefit: "நீர் சேமிப்பு & வேர் வளர்ச்சி",
        estimatedCost: 0,
        expectedRiskReduction: 12
      }
    ];
  } else if (language === "hi") {
    return [
      {
        id: "rec-1",
        actionType: "उर्वरक प्रबंधन",
        priority: "HIGH",
        title: `${crop} के लिए यूरिया एवं DAP की संतुलित खुराक`,
        reason: `मिट्टी pH ${ph} पर नाइट्रोजन पूर्ति हेतु 45 किग्रा यूरिया प्रति एकड़ 3 किश्तों में दें।`,
        expectedBenefit: "पैदावार में 18% वृद्धि",
        estimatedCost: 1800,
        expectedRiskReduction: 22
      },
      {
        id: "rec-2",
        actionType: "कीट नियंत्रण",
        priority: "MODERATE",
        title: "जैविक नीम तेल छिड़काव",
        reason: `कीट आक्रमण रोकने के लिए 5% नीम तेल (5ml/L) का छिड़काव करें।`,
        expectedBenefit: "कीट प्रकोप में 90% कमी",
        estimatedCost: 650,
        expectedRiskReduction: 18
      },
      {
        id: "rec-3",
        actionType: "सिंचाई प्रबंधन",
        priority: "LOW",
        title: "AWD जल बचत तकनीक",
        reason: `${rain}मीमी वर्षा के अनुसार खेत में पानी की उचित निकासी रखें।`,
        expectedBenefit: "25% जल बचत एवं स्वस्थ फसल",
        estimatedCost: 0,
        expectedRiskReduction: 12
      }
    ];
  }

  return [
    {
      id: "rec-1",
      actionType: "FERTILIZER MANAGEMENT",
      priority: "HIGH",
      title: `Split Nitrogen Fertilizer Schedule for ${crop}`,
      reason: `Apply 45 kg/acre Urea split into 3 doses for optimal absorption at soil pH ${ph}.`,
      expectedBenefit: "Boosts crop yield by 18%",
      estimatedCost: 1800,
      expectedRiskReduction: 22
    },
    {
      id: "rec-2",
      actionType: "PEST MANAGEMENT",
      priority: "MODERATE",
      title: "Preventive Neem Oil Spray",
      reason: `Spray 5% Cold-Pressed Neem Oil (5ml/L) to prevent Stem Borer attack in ${dist}.`,
      expectedBenefit: "Reduces pest attack risk by 90%",
      estimatedCost: 650,
      expectedRiskReduction: 18
    },
    {
      id: "rec-3",
      actionType: "IRRIGATION MANAGEMENT",
      priority: "LOW",
      title: "Alternate Wetting and Drying (AWD)",
      reason: `Implement AWD irrigation to reduce water consumption by 25% for ${rain}mm rainfall.`,
      expectedBenefit: "Saves water & boosts root aeration",
      estimatedCost: 0,
      expectedRiskReduction: 12
    }
  ];
}

export async function GET() {
  return NextResponse.json({ recommendations: getLocalizedActionRecommendations(defaultUserInputs, "en") });
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
    const fallback = getLocalizedActionRecommendations(inputs, language);

    return NextResponse.json({
      recommendations: aiRecommendations.length > 0 ? aiRecommendations : fallback,
      inputs,
      language,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Action Recommendations API error:", error);
    const fallback = getLocalizedActionRecommendations(defaultUserInputs, "en");
    return NextResponse.json({ recommendations: fallback });
  }
}
