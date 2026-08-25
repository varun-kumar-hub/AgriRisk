import type { RiskLevel } from "@/types/domain";

export const riskThresholds = [
  { min: 0, max: 29, level: "LOW" },
  { min: 30, max: 54, level: "MODERATE" },
  { min: 55, max: 74, level: "HIGH" },
  { min: 75, max: 100, level: "CRITICAL" }
] as const;

export const cropDecisionWeights = {
  soilSuitability: 20,
  climateSuitability: 20,
  waterCompatibility: 15,
  weatherRisk: 10,
  marketPotential: 15,
  productionPotential: 10,
  economicReturn: 10
};

export function classifyRisk(score: number): RiskLevel {
  const match = riskThresholds.find((threshold) => score >= threshold.min && score <= threshold.max);
  return (match?.level ?? "CRITICAL") as RiskLevel;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export interface PrePlantingRiskInput {
  crop: string;
  soilPh: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  rainfallMm: number;
  temperatureC: number;
  waterAvailability: "Low" | "Moderate" | "High";
}

export function calculatePrePlantingRisk(input: PrePlantingRiskInput) {
  const weatherRisk = Math.min(95, Math.max(10, Math.round(Math.abs(input.rainfallMm - 1000) / 15 + Math.abs(input.temperatureC - 25) * 3)));
  const soilRisk = Math.min(90, Math.max(10, Math.round(Math.abs(input.soilPh - 6.5) * 22 + (input.nitrogen < 15 ? 15 : 0))));
  const waterRisk = input.waterAvailability === "Low" ? 85 : input.waterAvailability === "Moderate" ? 45 : 18;
  const marketRisk = input.crop === "cotton" ? 78 : input.crop === "rice" ? 35 : 52;
  const yieldRisk = Math.min(92, Math.max(12, Math.round((weatherRisk + soilRisk + waterRisk) / 3)));
  const economicRisk = Math.min(95, Math.max(15, Math.round((marketRisk + yieldRisk) / 2)));

  const overallScore = Math.round(
    weatherRisk * 0.2 +
    soilRisk * 0.2 +
    waterRisk * 0.2 +
    marketRisk * 0.15 +
    yieldRisk * 0.15 +
    economicRisk * 0.1
  );

  return {
    overallScore,
    level: classifyRisk(overallScore),
    breakdown: {
      weatherRisk,
      soilRisk,
      waterRisk,
      marketRisk,
      yieldRisk,
      economicRisk
    }
  };
}

export interface FarmFieldRiskInput {
  crop: string;
  stage: string;
  temperatureC: number;
  rainfallMm: number;
  humidityPct?: number;
  waterAvailability: "Low" | "Moderate" | "High";
}

export function calculateFarmFieldRisk(input: FarmFieldRiskInput) {
  const humidity = input.humidityPct || 75;
  const heavyRainRisk = input.rainfallMm > 1200 ? 78 : input.rainfallMm < 400 ? 70 : 25;
  const heatStressRisk = input.temperatureC > 32 ? 85 : input.temperatureC > 28 ? 55 : 20;
  const waterStressRisk = input.waterAvailability === "Low" ? 85 : input.waterAvailability === "Moderate" ? 45 : 18;
  const diseaseRisk = humidity > 75 && input.temperatureC > 28 ? 80 : 30;
  const pestRisk = input.crop === "cotton" ? 82 : input.crop === "rice" ? 45 : 35;
  const yieldRisk = Math.min(95, Math.max(15, Math.round((heavyRainRisk + heatStressRisk + waterStressRisk) / 3)));

  const overallScore = Math.round(
    heavyRainRisk * 0.2 +
    heatStressRisk * 0.2 +
    waterStressRisk * 0.2 +
    diseaseRisk * 0.15 +
    pestRisk * 0.15 +
    yieldRisk * 0.1
  );

  return {
    overallScore,
    level: classifyRisk(overallScore),
    breakdown: {
      heavyRainRisk,
      heatStressRisk,
      waterStressRisk,
      diseaseRisk,
      pestRisk,
      yieldRisk
    }
  };
}