import type { RiskLevel } from "@/types/domain";

export const riskThresholds = [
  { min: 0, max: 29, level: "LOW" },
  { min: 30, max: 49, level: "MODERATE" },
  { min: 50, max: 69, level: "HIGH" },
  { min: 70, max: 100, level: "CRITICAL" }
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
