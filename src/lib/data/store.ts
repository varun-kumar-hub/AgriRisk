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

    // 1. Soil pH Suitability (Penalize heavily for acidic/alkaline misalignment)
    const phDiff = Math.abs(inputs.soilPh - targetPh);
    const soilPhScore = Math.max(10, Math.min(100, Math.round(100 - phDiff * 32)));

    // 2. N-P-K Nutrients Fit
    const nScore = Math.min(100, Math.round((inputs.nitrogen / Math.max(1, targetN)) * 100));
    const pScore = Math.min(100, Math.round((inputs.phosphorus / Math.max(1, targetP)) * 100));
    const kScore = Math.min(100, Math.round((inputs.potassium / Math.max(1, targetK)) * 100));
    const npkScore = Math.round((nScore * 0.45) + (pScore * 0.25) + (kScore * 0.30));

    // Soil Type Affinity Bonuses
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
      // High water requirement crops
      if (inputs.waterAvailability === "High" || inputs.rainfallMm > 950) waterScore = 95;
      else if (inputs.waterAvailability === "Moderate" && inputs.rainfallMm > 650) waterScore = 70;
      else waterScore = 20; // Severe penalty for low moisture
    } else if (cropKey === "pearl_millet" || cropKey === "sorghum" || cropKey === "chickpea" || cropKey === "sesame" || cropKey === "mustard") {
      // Dryland / drought-tolerant crops
      if (inputs.waterAvailability === "Low" || inputs.rainfallMm < 650) waterScore = 95;
      else if (inputs.rainfallMm > 1100) waterScore = 40;
      else waterScore = 70;
    } else if (cropKey === "potato" || cropKey === "wheat" || cropKey === "garlic") {
      // Cool rabi season crops
      if (inputs.temperatureC <= 22) waterScore = 90;
      else waterScore = 50;
    } else {
      // General crops
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
      whyNot: decisionScore < 60
        ? `High risk constraint for ${displayName} under current ${inputs.waterAvailability.toLowerCase()} water availability and temperature ${inputs.temperatureC}°C.`
        : `Minor nutrient or weather fluctuation constraint.`
    };
  });

  // Return top 6 best-fitting crops sorted by decisionScore descending
  return evaluated.sort((a, b) => b.decisionScore - a.decisionScore).slice(0, 6);
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
    factors: [
      {
        factor: "Soil Nutrient Status",
        category: "soil",
        severity: inputs.nitrogen < 15 ? "HIGH" : "MODERATE",
        impact: 20,
        description: `Current N-P-K (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}) compared to crop demand.`
      },
      {
        factor: "Irrigation Reliability",
        category: "water",
        severity: inputs.waterAvailability === "Low" ? "HIGH" : "LOW",
        impact: 15,
        description: `Water availability is recorded as ${inputs.waterAvailability}.`
      }
    ],
    updatedAt: new Date().toISOString()
  };
}
