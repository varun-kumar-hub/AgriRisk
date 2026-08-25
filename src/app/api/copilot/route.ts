import { NextRequest, NextResponse } from "next/server";
import { getCropBenchmarkStats, getHistoricalYieldTrends } from "@/lib/data/historical-dataset";
import { SUPPORTED_LANGUAGES, CROP_TRANSLATIONS, type SupportedLanguage } from "@/lib/i18n/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const question = (body.question || "").trim();
    const targetLang: SupportedLanguage = (body.language && ["en", "ta", "te", "kn", "hi"].includes(body.language))
      ? body.language
      : "en";
    const farmContext = body.farmContext || {};

    if (!question) {
      return NextResponse.json({
        answer: targetLang === "ta"
          ? "தயவுசெய்து பயிர்கள், மண், உரம், பூச்சி மேலாண்மை அல்லது அரசு திட்டங்கள் பற்றிய கேள்வியைக் கேளுங்கள்."
          : targetLang === "te"
          ? "దయచేసి పంటలు, నేల, ఎరువులు, తెగుళ్ళ నివారణ లేదా ప్రభుత్వ పథకాల గురించి ప్రశ్న అడగండి."
          : targetLang === "kn"
          ? "ದಯವಿಟ್ಟು ಬೆಳೆಗಳು, ಮಣ್ಣು, ಗೊಬ್ಬರ, ಕೀಟ ನಿಯಂತ್ರಣ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ."
          : targetLang === "hi"
          ? "कृपया फसलों, मिट्टी, उर्वरक, कीट प्रबंधन या सरकारी योजनाओं के बारे में प्रश्न पूछें।"
          : "Please ask any question about crops, soil health, fertilizers, pest control, irrigation, or government schemes."
      });
    }

    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

    // Detect crop from question or fallback to active selected crop
    const lowerQ = question.toLowerCase();
    let detectedCrop = farmContext.selectedCrop || "rice";
    if (lowerQ.includes("paddy") || lowerQ.includes("rice") || lowerQ.includes("நெல்") || lowerQ.includes("వరి") || lowerQ.includes("భತ್ತ") || lowerQ.includes("धान")) detectedCrop = "rice";
    else if (lowerQ.includes("wheat") || lowerQ.includes("கோதுமை") || lowerQ.includes("గోధుమ") || lowerQ.includes("गेहूं")) detectedCrop = "wheat";
    else if (lowerQ.includes("maize") || lowerQ.includes("corn") || lowerQ.includes("மக்காச்சோளம்") || lowerQ.includes("మొక్కజొన్న") || lowerQ.includes("मक्का")) detectedCrop = "maize";
    else if (lowerQ.includes("cotton") || lowerQ.includes("பருத்தி") || lowerQ.includes("ప్రత్తి") || lowerQ.includes("कपास")) detectedCrop = "cotton";
    else if (lowerQ.includes("tomato") || lowerQ.includes("தக்காளி") || lowerQ.includes("టమోటా") || lowerQ.includes("टमाटर")) detectedCrop = "tomato";

    const stats = getCropBenchmarkStats(detectedCrop);
    const trends = getHistoricalYieldTrends(detectedCrop);
    const geminiKey = process.env.GEMINI_API_KEY;
    let aiAnswer = "";

    if (geminiKey) {
      try {
        const prompt = `You are AgriRisk AI Copilot, a premier, world-class agricultural expert assistant for farmers, agronomists, and agricultural researchers in India.

TARGET LANGUAGE: ${langInfo.name} (${langInfo.nativeName}). You MUST respond in ${langInfo.name} (${langInfo.nativeName}).

Active Farmer Context:
- Location: ${farmContext.distName || "Durg"}, ${farmContext.stateName || "Chhattisgarh"}
- Target Crop: ${farmContext.selectedCrop || "Rice"}
- Soil Parameters: Soil Type: ${farmContext.soilType || "Clay loam"}, pH: ${farmContext.soilPh || 6.5}, N-P-K Ratio: ${farmContext.nitrogen || 20}-${farmContext.phosphorus || 10}-${farmContext.potassium || 15} kg/ha
- Climate Parameters: Temperature: ${farmContext.temperatureC || 25}°C, Rainfall: ${farmContext.rainfallMm || 1000}mm, Water Supply: ${farmContext.waterAvailability || "Moderate"}

User Question: "${question}"

Instructions:
1. Answer ANY agriculture-related question comprehensively, scientifically, and practical for Indian farming conditions (Soil Health, NPK Dosage, Pest & Disease Diagnosis, Organic Farming, Irrigation, Harvesting, APMC Mandi Prices, Government Subsidies PM-KISAN/PMFBY).
2. Incorporate the farmer's active location (${farmContext.distName || "India"}) and soil/climate context if relevant to the question.
3. Structure your response clearly using bullet points, numbered action steps, and bold headings for high readability on mobile devices.
4. Keep technical terms clear and farmer-friendly in ${langInfo.name} (${langInfo.nativeName}).
5. End with 2 suggested follow-up questions the farmer can ask next.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
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
        console.warn("Gemini API call failed in Copilot:", e);
      }
    }

    if (!aiAnswer) {
      // Localized fallback response if Gemini key is missing
      if (targetLang === "ta") {
        aiAnswer = `**வேளாண் வழிகாட்டுதல் (${farmContext.distName || "மண்டலம்"}):**\n\n• **மண் pH (${farmContext.soilPh || 6.5}):** உங்கள் மண் அளவுக்கு ஏற்ற உர அளவைப் பயன்படுத்துங்கள்.\n• **நீர் மேலாண்மை:** பாசனத்தை காலநிலைக்கேற்ப திட்டமிடுங்கள்.\n• **பயிர் பாதுகாப்பு:** பூச்சித் தாக்குதலைத் தடுக்க இயற்கை வேப்ப எண்ணெய் கரைசலைத் தெளிக்கவும்.`;
      } else if (targetLang === "te") {
        aiAnswer = `**వ్యవసాయ సూచన (${farmContext.distName || "ప్రాంతం"}):**\n\n• **నేల pH (${farmContext.soilPh || 6.5}):** మీ నేల స్వభావానికి అనుగుణంగా ఎరువులను వాడండి.\n• **నీటి యాజమాన్యం:** వర్షపాతం ఆధారంగా సకాలంలో నీటిని అందించండి.\n• **పంట రక్షణ:** నింబోలి ఆర్కా లేదా వేప నూనెను పిచికారీ చేయండి.`;
      } else if (targetLang === "hi") {
        aiAnswer = `**कृषि सलाह (${farmContext.distName || "क्षेत्र"}):**\n\n• **मिट्टी pH (${farmContext.soilPh || 6.5}):** अपनी मिट्टी के आधार पर N-P-K खाद की सही मात्रा डालें।\n• **सिंचाई प्रबंधन:** तापमान (${farmContext.temperatureC || 25}°C) और वर्षा के अनुसार सिंचाई करें।\n• **कीट नियंत्रण:** नीम के तेल का छिड़काव करें।`;
      } else {
        aiAnswer = `**Agricultural Advisory for ${farmContext.distName || "your farm"} (${farmContext.selectedCrop || "Crop"}):**\n\n• **Soil & NPK Management:** Based on your soil pH (${farmContext.soilPh || 6.5}) and N-P-K levels (${farmContext.nitrogen || 20}-${farmContext.phosphorus || 10}-${farmContext.potassium || 15}), balance nitrogen application with organic compost.\n• **Irrigation:** Maintain optimal moisture for ${farmContext.temperatureC || 25}°C temperature in ${farmContext.distName || "your district"}.\n• **Pest Control:** Use neem oil sprays (5ml/L) as a preventive measure against sucking pests.`;
      }
    }

    // Generate smart follow-up prompts
    const followUps = [
      `What is the best fertilizer dose for ${farmContext.selectedCrop || "this crop"}?`,
      `How to prevent pest attacks in ${farmContext.distName || "my region"}?`,
      `What government schemes apply to ${farmContext.stateName || "my state"}?`
    ];

    return NextResponse.json({
      answer: aiAnswer,
      followUps,
      language: targetLang,
      datasetStats: stats,
      recentTrend: trends.slice(-5),
      freshness: new Date().toISOString()
    });
  } catch (error) {
    console.error("Copilot API error:", error);
    return NextResponse.json({
      answer: "AgriRisk AI Copilot is online. Please ask any farming question regarding soil, crops, fertilizers, pests, or government schemes.",
      followUps: ["How to improve soil pH?", "Best crops for Kharif season?"],
      language: "en",
      freshness: new Date().toISOString()
    });
  }
}
