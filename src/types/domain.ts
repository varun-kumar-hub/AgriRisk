export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type CropStage =
  | "Planning"
  | "Sowing"
  | "Germination"
  | "Vegetative"
  | "Flowering"
  | "Grain Filling"
  | "Harvest";

export type RiskCategory =
  | "weather"
  | "soil"
  | "pest"
  | "disease"
  | "water"
  | "market"
  | "production";

export type Farm = {
  id: string;
  name: string;
  location: string;
  areaAcres: number;
  latitude: number;
  longitude: number;
  soilType: string;
  soilPh: number;
  cropAge: number;
  organicMatter: string;
  moisture: string;
  salinity: string;
  irrigationType: string;
  waterAvailability: string;
};

export type CropRecommendation = {
  crop: string;
  decisionScore: number;
  riskScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  expectedYield: number;
  marketScore: number;
  climateScore: number;
  soilScore: number;
  waterScore: number;
  productionScore: number;
  expectedRevenue: number;
  productionCost: number;
  estimatedProfit: number;
  riskAdjustedProfit: number;
  explanation: string;
  whyNot?: string;
};

export type CropCycle = {
  id: string;
  farmId: string;
  crop: string;
  season: string;
  sowingDate: string;
  ageDays: number;
  stage: CropStage;
};

export type RiskFactor = {
  factor: string;
  category: RiskCategory;
  impact: number;
  severity: RiskLevel;
  description: string;
};

export type CropRisk = {
  overallScore: number;
  level: RiskLevel;
  confidence: number;
  updatedAt: string;
  categories: Record<RiskCategory, number>;
  factors: RiskFactor[];
};

export type CropHealth = {
  score: number;
  label: string;
  updatedAt: string;
  factors: Record<string, number>;
};

export type Recommendation = {
  id: string;
  priority: RiskLevel;
  category: string;
  title: string;
  reason: string;
  estimatedCost: number;
  expectedRiskReduction: number;
  expectedBenefit: string;
  confidence: number;
};

export type Alert = {
  id: string;
  severity: RiskLevel;
  type: string;
  title: string;
  description: string;
  timeframe: string;
  status: "active" | "acknowledged";
  currentRisk: number;
  projectedRisk: number;
};

export type RegionRisk = {
  region: string;
  level: "district" | "state" | "country";
  score: number;
  riskLevel: RiskLevel;
  drivers: string[];
  affectedCrops: string[];
};

export type SimulationResult = {
  baselineRisk: number;
  simulatedRisk: number;
  baselineYield: number;
  simulatedYield: number;
  estimatedRevenue: number;
  estimatedLoss: number;
  explanation: string;
};
