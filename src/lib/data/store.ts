import { getCropBenchmarkStats } from "./historical-dataset";
import type { Farm, CropRecommendation, CropRisk, CropCycle, CropHealth, Recommendation, Alert, RiskLevel } from "@/types/domain";

export interface CustomUserInputs {
  farmName: string;
  location: string;
  stateName: string;
  distName: string;
  areaAcres: number;
  soilType: string;
  soilPh: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  waterAvailability: "Low" | "Moderate" | "High";
  irrigationType: string;
  temperatureC: number;
  rainfallMm: number;
  selectedCrop: string;
  sowingDate: string;
}

export const defaultUserInputs: CustomUserInputs = {
  farmName: "My Custom Farm",
  location: "Durg, Chhattisgarh",
  stateName: "Chhattisgarh",
  distName: "Durg",
  areaAcres: 5,
  soilType: "Clay loam",
  soilPh: 6.5,
  nitrogen: 20,
  phosphorus: 10,
  potassium: 15,
  waterAvailability: "Moderate",
  irrigationType: "Canal irrigation",
  temperatureC: 25,
  rainfallMm: 1000,
  selectedCrop: "rice",
  sowingDate: "2026-06-15"
};

export const ALL_SUPPORTED_CROPS = [
  // Cereals
  "rice", "wheat", "maize", "sorghum", "pearl_millet", "finger_millet",
  // Pulses
  "chickpea", "pigeon_pea", "green_gram", "black_gram",
  // Oilseeds
  "groundnut", "mustard", "soybean", "sunflower", "sesame",
  // Cash Crops
  "cotton", "sugarcane", "jute",
  // Vegetables
  "tomato", "potato", "onion", "chilli", "brinjal", "okra", "garlic",
  // Fruits
  "mango", "banana", "papaya"
];

export function getAgronomicConstraintReason(cropKey: string, inputs: CustomUserInputs, language: string = "en"): string[] {
  const stats = getCropBenchmarkStats(cropKey);
  const reasons: string[] = [];

  const targetTemp = stats?.avgTempC || 25;
  const targetPh = stats?.avgPh || 6.5;
  const targetN = stats?.avgNReq || 25;
  const cropName = stats?.crop || cropKey;

  // Temperature constraint
  if (Math.abs(inputs.temperatureC - targetTemp) > 4) {
    if (inputs.temperatureC > targetTemp) {
      if (language === "ta") {
        reasons.push(`வெப்ப அழுத்தக் கட்டுப்பாடு: வயல் வெப்பநிலை ${inputs.temperatureC}°C (${cropName} பயிருக்கான உகந்த அளவு ${targetTemp}°C). அதிக வெப்பம் மகசூலைக் குறைக்கும்.`);
      } else if (language === "te") {
        reasons.push(`వేడి ఒత్తిడి ప్రతిబంధకం: పొలం ఉష్ణోగ్రత ${inputs.temperatureC}°C (${cropName} కి అనుకూలమైనది ${targetTemp}°C). అధిక వేడి గింజ తయారీని దెబ్బతీస్తుంది.`);
      } else if (language === "kn") {
        reasons.push(`ಉಷ್ಣತೆಯ ಒತ್ತಡ: ಹೊಲದ ತಾಪಮಾನ ${inputs.temperatureC}°C (${cropName} ಬೆಳೆಗೆ ಸೂಕ್ತ ತಾಪಮಾನ ${targetTemp}°C). ಹೆಚ್ಚಿನ ತಾಪಮಾನ ಇಳುವರಿಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.`);
      } else if (language === "hi") {
        reasons.push(`तापमान तनाव: खेत का तापमान ${inputs.temperatureC}°C है (${cropName} के लिए अनुकूल ${targetTemp}°C)। उच्च तापमान पैदावार को प्रभावित करता है।`);
      } else {
        reasons.push(`Heat Stress: Field temp is ${inputs.temperatureC}°C (Optimal for ${cropName} is ${targetTemp}°C). High heat accelerates evapotranspiration & causes heat sterility.`);
      }
    } else {
      if (language === "ta") {
        reasons.push(`குளிர்ந்த காலநிலை கட்டுப்பாடு: வயல் வெப்பநிலை ${inputs.temperatureC}°C (${cropName} பயிருக்கு உகந்த அளவு ${targetTemp}°C).`);
      } else if (language === "te") {
        reasons.push(`చలి ఒత్తిడి: పొలం ఉష్ణోగ్రత ${inputs.temperatureC}°C (${cropName} కి అనుకూలమైనది ${targetTemp}°C).`);
      } else if (language === "hi") {
        reasons.push(`ठंड का तनाव: खेत का तापमान ${inputs.temperatureC}°C है (${cropName} के लिए अनुकूल ${targetTemp}°C)।`);
      } else {
        reasons.push(`Cold Stress: Field temp is ${inputs.temperatureC}°C (Optimal for ${cropName} is ${targetTemp}°C). Slows germination & vegetative biomass.`);
      }
    }
  }

  // Soil pH constraint
  if (Math.abs(inputs.soilPh - targetPh) > 0.8) {
    if (inputs.soilPh > targetPh) {
      if (language === "ta") {
        reasons.push(`கார மண் கட்டுப்பாடு: மண்ணின் pH ${inputs.soilPh} (உகந்த அளவு ${targetPh}). அதிக காரத்தன்மை ஊட்டச்சத்து உறிஞ்சுதலைத் தடுக்கும்.`);
      } else if (language === "te") {
        reasons.push(`క్షార నేల ప్రతిబంధకం: నేల pH ${inputs.soilPh} (అనుకూలమైనది ${targetPh}). అధిక క్షారత జింక్ మరియు ఇనుము పోషకాల గ్రహణాన్ని అడ్డుకుంటుంది.`);
      } else if (language === "kn") {
        reasons.push(`ಕ್ಷಾರೀಯ ಮಣ್ಣಿನ ಒತ್ತಡ: ಮಣ್ಣಿನ pH ${inputs.soilPh} (ಸೂಕ್ತ ಪ್ರಮಾಣ ${targetPh}). ಹೆಚ್ಚಿನ ಕ್ಷಾರತೆ ಪೋಷಕಾಂಶಗಳ ಲಭ್ಯತೆಯನ್ನು ತಡೆಯುತ್ತದೆ.`);
      } else if (language === "hi") {
        reasons.push(`क्षारीय मिट्टी तनाव: मिट्टी का pH ${inputs.soilPh} है (अनुकूल ${targetPh})। उच्च क्षारीयता पोषक तत्वों के अवशोषण को रोकती है।`);
      } else {
        reasons.push(`Alkaline Soil Stress: Soil pH is ${inputs.soilPh} (Optimal is ${targetPh}). High alkalinity inhibits Iron & Zinc micronutrient uptake.`);
      }
    } else {
      if (language === "ta") {
        reasons.push(`அமில மண் கட்டுப்பாடு: மண்ணின் pH ${inputs.soilPh} (உகந்த அளவு ${targetPh}).`);
      } else if (language === "te") {
        reasons.push(`ఆమ్ల నేల ప్రతిబంధకం: నేల pH ${inputs.soilPh} (అనుకూలమైనది ${targetPh}).`);
      } else if (language === "hi") {
        reasons.push(`अम्लीय मिट्टी तनाव: मिट्टी का pH ${inputs.soilPh} है (अनुकूल ${targetPh})।`);
      } else {
        reasons.push(`Acidic Soil Stress: Soil pH is ${inputs.soilPh} (Optimal is ${targetPh}). Causes Phosphorus fixation & aluminum root toxicity.`);
      }
    }
  }

  // Water & Rainfall constraint
  if (cropKey === "rice" || cropKey === "sugarcane" || cropKey === "banana" || cropKey === "jute") {
    if (inputs.waterAvailability === "Low" || inputs.rainfallMm < 700) {
      if (language === "ta") {
        reasons.push(`நீர் பற்றாக்குறை: ${cropName} பயிருக்கு அதிக நீர் தேவை, ஆனால் உங்கள் வயலில் நீர் அளவு குறைவாக உள்ளது (${inputs.rainfallMm}மிமீ மழை).`);
      } else if (language === "te") {
        reasons.push(`నీటి కొరత: ${cropName} పంటకు అధిక నీరు అవసరం, కానీ మీ పొలంలో నీటి లభ్యత తక్కువగా ఉంది (${inputs.rainfallMm}మి.మీ వర్షపాతం).`);
      } else if (language === "hi") {
        reasons.push(`जल की कमी: ${cropName} फसल को अधिक पानी की आवश्यकता है, लेकिन आपके खेत में नमी कम है (${inputs.rainfallMm}मीमी बारिश)।`);
      } else {
        reasons.push(`Moisture Deficit: ${cropName} requires high water supply (>800mm rain or canal irrigation), but field moisture is Low (${inputs.rainfallMm}mm rain).`);
      }
    }
  } else if (cropKey === "chickpea" || cropKey === "pearl_millet" || cropKey === "mustard" || cropKey === "sesame") {
    if (inputs.rainfallMm > 1000 || inputs.waterAvailability === "High") {
      if (language === "ta") {
        reasons.push(`தேங்கு நீர் ஆபத்து: அதிக மழையினால் (${inputs.rainfallMm}மிமீ) வேர் அழுகல் நோய் ஏற்பட வாய்ப்புள்ளது.`);
      } else if (language === "te") {
        reasons.push(`నీరు నిలిచే ముప్పు: అధిక వర్షపాతం (${inputs.rainfallMm}మి.మీ) వల్ల వేరు కుళ్ళు తెగులు వచ్చే అవకాశం ఉంది.`);
      } else if (language === "hi") {
        reasons.push(`जलजमाव का जोखिम: अत्यधिक वर्षा (${inputs.rainfallMm}मीमी) से जड़ सड़न रोग होने का खतरा है।`);
      } else {
        reasons.push(`Waterlogging / Rot Risk: ${cropName} suffers root rot & wilt under excessive rainfall (${inputs.rainfallMm}mm rain).`);
      }
    }
  }

  // Nitrogen deficit
  if (inputs.nitrogen < targetN * 0.6) {
    if (language === "ta") {
      reasons.push(`நைட்ரஜன் பற்றாக்குறை: மண்ணில் நைட்ரஜன் அளவு (${inputs.nitrogen} கிலோ/ஏக்கர்) குறைவாக உள்ளது.`);
    } else if (language === "te") {
      reasons.push(`నత్రజని కొరత: నేలలో నత్రజని లభ్యత (${inputs.nitrogen} కిలోలు/ఎకరా) తక్కువగా ఉంది.`);
    } else if (language === "hi") {
      reasons.push(`नाइट्रोजन की कमी: मिट्टी में नाइट्रोजन की मात्रा (${inputs.nitrogen} किग्रा/एकड़) कम है।`);
    } else {
      reasons.push(`Nitrogen Deficit: Soil N is ${inputs.nitrogen} kg/ha (Target demand for ${cropName} is ${targetN} kg/ha). Stunts leaf canopy growth.`);
    }
  }

  if (reasons.length === 0) {
    if (language === "ta") reasons.push(`${inputs.distName} பகுதியில் உள்ள தட்பவெப்பநிலை மாற்றங்கள்.`);
    else if (language === "te") reasons.push(`${inputs.distName} ప్రాంతంలో స్వల్ప వాతావరణ మార్పులు.`);
    else if (language === "hi") reasons.push(`${inputs.distName} क्षेत्र में मामूली मौसम परिवर्तन।`);
    else reasons.push(`Minor weather or soil nutrient variation from benchmark averages in ${inputs.distName}.`);
  }

  return reasons;
}

export function calculateDynamicCropRecommendations(inputs: CustomUserInputs, language: string = "en"): CropRecommendation[] {
  const evaluated = ALL_SUPPORTED_CROPS.map((cropKey) => {
    const stats = getCropBenchmarkStats(cropKey);

    const displayName = stats ? stats.crop : cropKey;
    const avgYield = stats ? stats.avgYieldKgPerHa / 1000 : 3.5;
    const targetN = stats ? stats.avgNReq : 25;
    const targetP = stats ? stats.avgPReq : 15;
    const targetK = stats ? stats.avgKReq : 15;
    const targetPh = stats ? stats.avgPh : 6.5;
    const targetTemp = stats ? stats.avgTempC : 25;
    const targetRain = stats ? stats.avgRainfallMm : 800;

    // 1. Soil pH Suitability
    const phDiff = Math.abs(inputs.soilPh - targetPh);
    const soilPhScore = Math.max(10, Math.min(100, Math.round(100 - phDiff * 32)));

    // 2. N-P-K Nutrients Fit
    const nScore = Math.min(100, Math.round((inputs.nitrogen / Math.max(1, targetN)) * 100));
    const pScore = Math.min(100, Math.round((inputs.phosphorus / Math.max(1, targetP)) * 100));
    const kScore = Math.min(100, Math.round((inputs.potassium / Math.max(1, targetK)) * 100));
    const npkScore = Math.round((nScore * 0.45) + (pScore * 0.25) + (kScore * 0.30));

    // Soil Type Affinity
    let soilTypeBonus = 0;
    if (cropKey === "cotton" && inputs.soilType.includes("Black")) soilTypeBonus = 18;
    if (cropKey === "groundnut" && inputs.soilType.includes("Red")) soilTypeBonus = 18;
    if (cropKey === "rice" && inputs.soilType.includes("Clay")) soilTypeBonus = 15;
    if (cropKey === "potato" && inputs.soilType.includes("loam")) soilTypeBonus = 15;
    if (cropKey === "tomato" && inputs.soilType.includes("loam")) soilTypeBonus = 12;

    const soilScore = Math.min(100, Math.max(10, Math.round((soilPhScore * 0.5) + (npkScore * 0.5) + soilTypeBonus)));

    // 3. Water & Rainfall Requirements
    let waterScore = 70;
    if (cropKey === "rice" || cropKey === "sugarcane" || cropKey === "banana" || cropKey === "jute") {
      if (inputs.waterAvailability === "High" || inputs.rainfallMm > 950) waterScore = 95;
      else if (inputs.waterAvailability === "Moderate" && inputs.rainfallMm > 650) waterScore = 70;
      else waterScore = 20;
    } else if (cropKey === "pearl_millet" || cropKey === "sorghum" || cropKey === "chickpea" || cropKey === "sesame" || cropKey === "mustard") {
      if (inputs.waterAvailability === "Low" || inputs.rainfallMm < 650) waterScore = 95;
      else if (inputs.rainfallMm > 1100) waterScore = 40;
      else waterScore = 70;
    } else if (cropKey === "potato" || cropKey === "wheat" || cropKey === "garlic") {
      if (inputs.temperatureC <= 22) waterScore = 90;
      else waterScore = 45;
    } else {
      if (inputs.rainfallMm >= 500 && inputs.rainfallMm <= 950) waterScore = 88;
      else waterScore = 60;
    }

    // 4. Climate Temperature Fit
    const tempDiff = Math.abs(inputs.temperatureC - targetTemp);
    const climateScore = Math.max(10, Math.min(100, Math.round(100 - tempDiff * 6)));

    // Market Demand Score
    const marketScore = (stats?.category === "Vegetable" || stats?.category === "Fruit") ? 88 : 80;

    // Production & Decision Score
    const productionScore = Math.round((soilScore * 0.4) + (waterScore * 0.4) + (climateScore * 0.2));

    const decisionScore = Math.min(98, Math.max(10, Math.round(
      (soilScore * 0.30) +
      (waterScore * 0.30) +
      (climateScore * 0.20) +
      (marketScore * 0.20)
    )));

    const riskScore = Math.max(5, Math.min(95, 100 - decisionScore));
    let riskLevel: RiskLevel = "MODERATE";
    if (riskScore < 30) riskLevel = "LOW";
    else if (riskScore > 65) riskLevel = "HIGH";
    else if (riskScore > 80) riskLevel = "CRITICAL";

    const yieldFactor = decisionScore / 80;
    const expectedYield = Math.max(0.4, Math.round(avgYield * yieldFactor * 10) / 10);
    const expectedRevenue = Math.round(expectedYield * 18000 * inputs.areaAcres);
    const productionCost = Math.round(inputs.areaAcres * 9000);
    const estimatedProfit = expectedRevenue - productionCost;
    const riskAdjustedProfit = Math.round(estimatedProfit * (1 - riskScore / 150));

    const constraintReasons = getAgronomicConstraintReason(cropKey, inputs, language);

    let explanation = `${displayName} scored ${decisionScore}/100 based on soil pH ${inputs.soilPh}, N-P-K ${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}, and weather in ${inputs.distName}.`;
    if (language === "ta") explanation = `${displayName} பயிர் உங்கள் மண்ணின் pH ${inputs.soilPh}, N-P-K (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}) மற்றும் ${inputs.distName} வானிலைக்கு ஏற்ப ${decisionScore}/100 மதிப்பெண் பெற்றது.`;
    else if (language === "te") explanation = `${displayName} పంట మీ నేల pH ${inputs.soilPh}, N-P-K (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}) మరియు ${inputs.distName} వాతావరణానికి అనుగుణంగా ${decisionScore}/100 స్కోరు సాధించింది.`;
    else if (language === "kn") explanation = `${displayName} ಬೆಳೆ ನಿಮ್ಮ ಮಣ್ಣಿನ pH ${inputs.soilPh} ಮತ್ತು ${inputs.distName} ಹವಾಮಾನಕ್ಕೆ ಅನುಗುಣವಾಗಿ ${decisionScore}/100 ಅಂಕ ಪಡೆದಿದೆ.`;
    else if (language === "hi") explanation = `${displayName} फसल आपकी मिट्टी pH ${inputs.soilPh}, N-P-K (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}) और ${inputs.distName} के मौसम के अनुसार ${decisionScore}/100 स्कोर करती है।`;

    return {
      crop: displayName,
      decisionScore,
      riskScore,
      riskLevel,
      confidence: 0.88,
      expectedYield,
      marketScore,
      climateScore,
      soilScore,
      waterScore,
      productionScore,
      expectedRevenue,
      productionCost,
      estimatedProfit,
      riskAdjustedProfit,
      explanation,
      whyNot: constraintReasons.join(" ")
    };
  });

  // Sort all 28 crops by decisionScore descending
  const sorted = evaluated.sort((a, b) => b.decisionScore - a.decisionScore);

  // Take top 5 recommendations
  const topList = sorted.slice(0, 5);

  // Ensure target selected crop is ALWAYS present in recommendations list if selected by user
  const selectedKeyNorm = (inputs.selectedCrop || "rice").toLowerCase().trim();
  const selectedInTop = topList.some((item) => item.crop.toLowerCase().includes(selectedKeyNorm));

  if (!selectedInTop) {
    const selectedItem = sorted.find((item) => item.crop.toLowerCase().includes(selectedKeyNorm));
    if (selectedItem) {
      topList.push(selectedItem);
    }
  }

  return topList;
}

export function getDynamicFarm(inputs: CustomUserInputs): Farm {
  return {
    id: "custom-farm-1",
    name: inputs.farmName,
    location: `${inputs.distName}, ${inputs.stateName}`,
    areaAcres: inputs.areaAcres,
    latitude: 21.19,
    longitude: 81.28,
    soilType: inputs.soilType,
    soilPh: inputs.soilPh,
    nitrogen: inputs.nitrogen,
    phosphorus: inputs.phosphorus,
    potassium: inputs.potassium,
    organicMatter: "Good",
    moisture: inputs.waterAvailability,
    salinity: "Low",
    irrigationType: inputs.irrigationType,
    waterAvailability: inputs.waterAvailability
  };
}

export function getDynamicCropCycle(inputs: CustomUserInputs): CropCycle {
  const cropName = inputs.selectedCrop.charAt(0).toUpperCase() + inputs.selectedCrop.slice(1);
  return {
    id: "cycle-custom-1",
    farmId: "custom-farm-1",
    crop: cropName,
    season: "Kharif 2026",
    sowingDate: inputs.sowingDate,
    stage: "Vegetative",
    ageDays: 42
  };
}

export function getDynamicCropRisk(inputs: CustomUserInputs, language: string = "en"): CropRisk {
  const recs = calculateDynamicCropRecommendations(inputs, language);
  const selectedRec = recs.find((r) => r.crop.toLowerCase().includes(inputs.selectedCrop.toLowerCase())) || recs[0];

  const constraintReasons = getAgronomicConstraintReason(inputs.selectedCrop, inputs, language);

  return {
    overallScore: selectedRec.riskScore,
    level: selectedRec.riskLevel,
    confidence: 0.88,
    categories: {
      weather: Math.round(100 - selectedRec.climateScore),
      water: Math.round(100 - selectedRec.waterScore),
      soil: Math.round(100 - selectedRec.soilScore),
      market: Math.round(100 - selectedRec.marketScore),
      pest: 25,
      disease: 15,
      production: Math.round(100 - selectedRec.productionScore)
    },
    factors: constraintReasons.map((reason, idx) => ({
      factor: language === "ta" ? `வேளாண் காரணி #${idx + 1}` : language === "te" ? `వ్యవసాయ అంశం #${idx + 1}` : language === "hi" ? `कृषि कारक #${idx + 1}` : `Agronomic Factor #${idx + 1}`,
      category: "soil",
      severity: selectedRec.riskLevel === "LOW" ? "LOW" : selectedRec.riskLevel === "MODERATE" ? "MODERATE" : "HIGH",
      impact: 20,
      description: reason
    })),
    updatedAt: new Date().toISOString()
  };
}
