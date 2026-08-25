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

export function getAgronomicConstraintReason(cropKey: string, inputs: CustomUserInputs): string[] {
  const stats = getCropBenchmarkStats(cropKey);
  const reasons: string[] = [];

  const targetTemp = stats?.avgTempC || 25;
  const targetPh = stats?.avgPh || 6.5;
  const targetRain = stats?.avgRainfallMm || 800;
  const targetN = stats?.avgNReq || 25;
  const cropName = stats?.crop || cropKey;

  // Temperature constraint
  if (Math.abs(inputs.temperatureC - targetTemp) > 4) {
    if (inputs.temperatureC > targetTemp) {
      reasons.push(`Heat Stress: Field temp is ${inputs.temperatureC}°C (Optimal for ${cropName} is ${targetTemp}°C). High heat accelerates evapotranspiration & causes heat sterility.`);
    } else {
      reasons.push(`Cold Stress: Field temp is ${inputs.temperatureC}°C (Optimal for ${cropName} is ${targetTemp}°C). Slows germination & vegetative biomass.`);
    }
  }

  // Soil pH constraint
  if (Math.abs(inputs.soilPh - targetPh) > 0.8) {
    if (inputs.soilPh > targetPh) {
      reasons.push(`Alkaline Soil Stress: Soil pH is ${inputs.soilPh} (Optimal is ${targetPh}). High alkalinity inhibits Iron & Zinc micronutrient uptake.`);
    } else {
      reasons.push(`Acidic Soil Stress: Soil pH is ${inputs.soilPh} (Optimal is ${targetPh}). Causes Phosphorus fixation & aluminum root toxicity.`);
    }
  }

  // Water & Rainfall constraint
  if (cropKey === "rice" || cropKey === "sugarcane" || cropKey === "banana" || cropKey === "jute") {
    if (inputs.waterAvailability === "Low" || inputs.rainfallMm < 700) {
      reasons.push(`Moisture Deficit: ${cropName} requires high water supply (>800mm rain or canal irrigation), but field moisture is Low (${inputs.rainfallMm}mm rain).`);
    }
  } else if (cropKey === "chickpea" || cropKey === "pearl_millet" || cropKey === "mustard" || cropKey === "sesame") {
    if (inputs.rainfallMm > 1000 || inputs.waterAvailability === "High") {
      reasons.push(`Waterlogging / Rot Risk: ${cropName} suffers root rot & wilt under excessive rainfall (${inputs.rainfallMm}mm rain).`);
    }
  }

  // Nitrogen deficit
  if (inputs.nitrogen < targetN * 0.6) {
    reasons.push(`Nitrogen Deficit: Soil N is ${inputs.nitrogen} kg/ha (Target demand for ${cropName} is ${targetN} kg/ha). Stunts leaf canopy growth.`);
  }

  if (reasons.length === 0) {
    reasons.push(`Minor weather or soil nutrient variation from benchmark averages in ${inputs.distName}.`);
  }

  return reasons;
}

export function calculateDynamicCropRecommendations(inputs: CustomUserInputs): CropRecommendation[] {
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

    const constraintReasons = getAgronomicConstraintReason(cropKey, inputs);

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
      explanation: `${displayName} (${stats?.category || "Crop"}) scored ${decisionScore}/100 based on your custom soil pH (${inputs.soilPh}), N-P-K (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}), temperature (${inputs.temperatureC}°C), and rainfall (${inputs.rainfallMm}mm) in ${inputs.distName}.`,
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

export function getDynamicCropRisk(inputs: CustomUserInputs): CropRisk {
  const recs = calculateDynamicCropRecommendations(inputs);
  const selectedRec = recs.find((r) => r.crop.toLowerCase().includes(inputs.selectedCrop.toLowerCase())) || recs[0];

  const constraintReasons = getAgronomicConstraintReason(inputs.selectedCrop, inputs);

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
      factor: `Agronomic Constraint #${idx + 1}`,
      category: "soil",
      severity: selectedRec.riskLevel === "LOW" ? "LOW" : selectedRec.riskLevel === "MODERATE" ? "MODERATE" : "HIGH",
      impact: 20,
      description: reason
    })),
    updatedAt: new Date().toISOString()
  };
}
