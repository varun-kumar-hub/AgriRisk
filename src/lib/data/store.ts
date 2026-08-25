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

export function calculateDynamicCropRecommendations(inputs: CustomUserInputs): CropRecommendation[] {
  const availableCrops = ["rice", "maize", "chickpea", "groundnut", "cotton"];

  return availableCrops.map((cropName) => {
    const stats = getCropBenchmarkStats(cropName);

    const avgYield = stats ? stats.avgYieldKgPerHa / 1000 : 3.5; // in tonnes/ha
    const targetN = stats ? stats.avgNReq : 20;
    const targetP = stats ? stats.avgPReq : 10;
    const targetK = stats ? stats.avgKReq : 15;
    const targetTemp = stats ? stats.avgTempC : 25;
    const targetRain = stats ? stats.avgRainfallMm : 900;

    // Soil score based on pH (ideal 6.0-7.0) and NPK sufficiency
    const phDiff = Math.abs(inputs.soilPh - (stats ? stats.avgPh : 6.5));
    const phScore = Math.max(50, 100 - phDiff * 20);

    const nRatio = Math.min(1, inputs.nitrogen / (targetN || 1));
    const pRatio = Math.min(1, inputs.phosphorus / (targetP || 1));
    const kRatio = Math.min(1, inputs.potassium / (targetK || 1));
    const npkScore = Math.round(((nRatio + pRatio + kRatio) / 3) * 100);

    const soilScore = Math.round((phScore + npkScore) / 2);

    // Climate score based on temp & rainfall
    const tempDiff = Math.abs(inputs.temperatureC - targetTemp);
    const tempScore = Math.max(40, 100 - tempDiff * 5);
    const rainRatio = Math.min(1.2, inputs.rainfallMm / (targetRain || 1));
    const rainScore = Math.min(100, Math.round(rainRatio * 90));

    const climateScore = Math.round((tempScore + rainScore) / 2);

    // Water score
    const waterFactor = inputs.waterAvailability === "High" ? 95 : inputs.waterAvailability === "Moderate" ? 75 : 50;
    const waterScore = waterFactor;

    // Production & Market score
    const productionScore = Math.round((soilScore * 0.4) + (climateScore * 0.4) + (waterScore * 0.2));
    const marketScore = 80;

    // Decision Score & Risk Score
    const decisionScore = Math.round(
      soilScore * 0.2 +
      climateScore * 0.2 +
      waterScore * 0.15 +
      marketScore * 0.15 +
      productionScore * 0.3
    );

    const riskScore = Math.max(10, Math.min(95, 100 - decisionScore));
    let riskLevel: RiskLevel = "MODERATE";
    if (riskScore < 30) riskLevel = "LOW";
    else if (riskScore > 65) riskLevel = "HIGH";
    else if (riskScore > 80) riskLevel = "CRITICAL";

    // Expected yield adjusted by decision score ratio
    const expectedYield = Math.round(avgYield * (decisionScore / 80) * 10) / 10;
    const expectedRevenue = Math.round(expectedYield * 18000 * inputs.areaAcres);
    const productionCost = Math.round(inputs.areaAcres * 9000);
    const estimatedProfit = expectedRevenue - productionCost;
    const riskAdjustedProfit = Math.round(estimatedProfit * (1 - riskScore / 150));

    const displayName = cropName.charAt(0).toUpperCase() + cropName.slice(1);

    return {
      crop: displayName,
      decisionScore,
      riskScore,
      riskLevel,
      confidence: 0.85,
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
      explanation: `${displayName} scored ${decisionScore}/100 based on your custom soil pH (${inputs.soilPh}), N-P-K levels (${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium}), temperature (${inputs.temperatureC}°C), and rainfall (${inputs.rainfallMm}mm).`,
      whyNot: `Lower score indicates ${displayName} is more constrained by your current ${inputs.waterAvailability.toLowerCase()} water availability or nutrient deficit.`
    };
  }).sort((a, b) => b.decisionScore - a.decisionScore);
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
  const selectedRec = recs.find((r) => r.crop.toLowerCase() === inputs.selectedCrop.toLowerCase()) || recs[0];

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
