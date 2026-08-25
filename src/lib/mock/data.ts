import type {
  Alert,
  CropCycle,
  CropHealth,
  CropRecommendation,
  CropRisk,
  Farm,
  Recommendation,
  RegionRisk,
  SimulationResult
} from "@/types/domain";

export const demoFarm: Farm = {
  id: "farm-thanjavur",
  name: "Thanjavur Rice Farm",
  location: "Thanjavur, Tamil Nadu",
  areaAcres: 5,
  latitude: 10.7867,
  longitude: 79.1378,
  soilType: "Clay loam",
  soilPh: 6.8,
  nitrogen: 72,
  phosphorus: 61,
  potassium: 68,
  organicMatter: "Good",
  moisture: "Moderate",
  salinity: "Low",
  irrigationType: "Canal irrigation",
  waterAvailability: "Moderate"
};

export const cropRecommendations: CropRecommendation[] = [
  {
    crop: "Rice",
    decisionScore: 88,
    riskScore: 31,
    riskLevel: "MODERATE",
    confidence: 0.89,
    expectedYield: 4.8,
    marketScore: 84,
    climateScore: 91,
    soilScore: 87,
    waterScore: 72,
    productionScore: 79,
    expectedRevenue: 86000,
    productionCost: 42000,
    estimatedProfit: 44000,
    riskAdjustedProfit: 37000,
    explanation:
      "Rice ranks highest because the clay loam soil, Kharif season, and regional production pattern are favorable. Moderate water availability increases irrigation dependency, so the recommendation includes active water monitoring.",
    whyNot:
      "Rice should be avoided only if irrigation reliability drops further, because rainfall deficit can quickly raise production risk during vegetative and flowering stages."
  },
  {
    crop: "Groundnut",
    decisionScore: 81,
    riskScore: 34,
    riskLevel: "MODERATE",
    confidence: 0.84,
    expectedYield: 2.6,
    marketScore: 82,
    climateScore: 83,
    soilScore: 78,
    waterScore: 88,
    productionScore: 74,
    expectedRevenue: 62000,
    productionCost: 28000,
    estimatedProfit: 34000,
    riskAdjustedProfit: 30500,
    explanation:
      "Groundnut is a strong lower-water alternative with positive market conditions, but soil suitability and regional yield potential are slightly lower than rice for this farm.",
    whyNot: "Groundnut ranks below rice because expected yield and regional production fit are weaker for this specific land profile."
  },
  {
    crop: "Maize",
    decisionScore: 74,
    riskScore: 46,
    riskLevel: "MODERATE",
    confidence: 0.8,
    expectedYield: 3.8,
    marketScore: 70,
    climateScore: 76,
    soilScore: 75,
    waterScore: 78,
    productionScore: 71,
    expectedRevenue: 56000,
    productionCost: 28000,
    estimatedProfit: 28000,
    riskAdjustedProfit: 23500,
    explanation:
      "Maize is viable, but the market outlook and expected return are weaker than rice and groundnut under the current season assumptions.",
    whyNot: "Maize has moderate economics and becomes more exposed if heat stress increases."
  },
  {
    crop: "Cotton",
    decisionScore: 63,
    riskScore: 58,
    riskLevel: "HIGH",
    confidence: 0.77,
    expectedYield: 1.9,
    marketScore: 68,
    climateScore: 62,
    soilScore: 64,
    waterScore: 61,
    productionScore: 59,
    expectedRevenue: 52000,
    productionCost: 33000,
    estimatedProfit: 19000,
    riskAdjustedProfit: 12500,
    explanation:
      "Cotton is possible but has higher pest exposure, weaker climate fit, and lower risk-adjusted profit than the top-ranked crops.",
    whyNot: "Cotton is less suitable because pest pressure and water stress could reduce returns during the season."
  }
];

export const activeCropCycle: CropCycle = {
  id: "cycle-rice-kharif-2026",
  farmId: demoFarm.id,
  crop: "Rice",
  season: "Kharif 2026",
  sowingDate: "2026-07-10",
  ageDays: 45,
  stage: "Vegetative"
};

export const cropRisk: CropRisk = {
  overallScore: 64,
  level: "HIGH",
  confidence: 0.86,
  updatedAt: "2026-08-25T08:30:00+05:30",
  categories: {
    weather: 71,
    water: 67,
    pest: 54,
    disease: 41,
    soil: 48,
    market: 52,
    production: 61
  },
  factors: [
    {
      factor: "Rainfall deficit",
      category: "weather",
      impact: 18,
      severity: "HIGH",
      description: "Rainfall is 23% below the historical average for this growth stage."
    },
    {
      factor: "Temperature anomaly",
      category: "weather",
      impact: 14,
      severity: "HIGH",
      description: "Daytime temperatures are trending above the normal vegetative-stage range."
    },
    {
      factor: "Soil moisture deficit",
      category: "soil",
      impact: 11,
      severity: "MODERATE",
      description: "Soil moisture remains adequate but is declining faster than expected."
    },
    {
      factor: "Pest-favorable humidity",
      category: "pest",
      impact: 8,
      severity: "MODERATE",
      description: "Current humidity and temperature conditions are becoming favorable for pest activity."
    }
  ]
};

export const cropHealth: CropHealth = {
  score: 76,
  label: "GOOD",
  updatedAt: "2026-08-25T08:20:00+05:30",
  factors: {
    vegetation: 82,
    soil: 71,
    water: 68,
    weather: 63,
    nutrients: 74,
    pest: 70,
    disease: 81
  }
};

export const recommendations: Recommendation[] = [
  {
    id: "rec-irrigation",
    priority: "HIGH",
    category: "Irrigation",
    title: "Increase irrigation monitoring",
    reason: "Rainfall deficit is the largest contributor to the current crop risk.",
    estimatedCost: 2000,
    expectedRiskReduction: 11,
    expectedBenefit: "Stabilizes soil moisture during vegetative growth.",
    confidence: 0.84
  },
  {
    id: "rec-pest",
    priority: "MODERATE",
    category: "Pest",
    title: "Inspect field edges for pest activity",
    reason: "Temperature and humidity are becoming favorable for pest spread.",
    estimatedCost: 800,
    expectedRiskReduction: 6,
    expectedBenefit: "Early detection before visible crop stress.",
    confidence: 0.76
  },
  {
    id: "rec-nutrient",
    priority: "MODERATE",
    category: "Nutrients",
    title: "Review nitrogen availability",
    reason: "Vegetative-stage rice requires stable nutrient availability.",
    estimatedCost: 1200,
    expectedRiskReduction: 5,
    expectedBenefit: "Supports growth continuity and yield potential.",
    confidence: 0.72
  }
];

export const simulationResult: SimulationResult = {
  baselineRisk: 64,
  simulatedRisk: 79,
  baselineYield: 4.3,
  simulatedYield: 3.6,
  estimatedRevenue: 72000,
  estimatedLoss: 14000,
  explanation:
    "A 20% rainfall reduction and 2 C temperature increase raise water and weather risk sharply. Additional irrigation partially offsets the stress but does not fully protect yield."
};

export const alerts: Alert[] = [
  {
    id: "alert-drought",
    severity: "CRITICAL",
    type: "Drought",
    title: "Drought risk escalation",
    description: "Drought risk is expected to increase across Thanjavur if rainfall remains below normal.",
    timeframe: "10-14 days",
    status: "active",
    currentRisk: 61,
    projectedRisk: 78
  },
  {
    id: "alert-pest",
    severity: "HIGH",
    type: "Pest",
    title: "Pest conditions becoming favorable",
    description: "Humidity and temperature are moving toward a pest-favorable range.",
    timeframe: "5-7 days",
    status: "active",
    currentRisk: 54,
    projectedRisk: 66
  }
];

export const regionalRisks: RegionRisk[] = [
  {
    region: "Thanjavur",
    level: "district",
    score: 72,
    riskLevel: "CRITICAL",
    drivers: ["Rainfall deficit", "Water stress", "Rice crop exposure"],
    affectedCrops: ["Rice", "Sugarcane"]
  },
  {
    region: "Tamil Nadu",
    level: "state",
    score: 68,
    riskLevel: "HIGH",
    drivers: ["Below-normal rainfall", "Heat stress"],
    affectedCrops: ["Rice", "Groundnut", "Cotton"]
  },
  {
    region: "India",
    level: "country",
    score: 49,
    riskLevel: "MODERATE",
    drivers: ["Regional rainfall variability", "Market volatility"],
    affectedCrops: ["Rice", "Wheat", "Maize"]
  }
];

export const riskTrend = [
  { date: "Aug 01", risk: 48, health: 84 },
  { date: "Aug 08", risk: 52, health: 82 },
  { date: "Aug 15", risk: 57, health: 80 },
  { date: "Aug 22", risk: 61, health: 78 },
  { date: "Aug 25", risk: 64, health: 76 }
];
