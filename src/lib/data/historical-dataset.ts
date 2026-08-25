import fs from "fs";
import path from "path";

export interface HistoricalCropRecord {
  distCode: number;
  year: number;
  stateCode: number;
  stateName: string;
  distName: string;
  crop: string;
  areaHa: number;
  yieldKgPerHa: number;
  nReqKgPerHa: number;
  pReqKgPerHa: number;
  kReqKgPerHa: number;
  totalN: number;
  totalP: number;
  totalK: number;
  temperatureC: number;
  humidityPct: number;
  ph: number;
  rainfallMm: number;
  windSpeedMs: number;
  solarRadiation: number;
}

export interface CropBenchmarkStats {
  crop: string;
  recordCount: number;
  avgYieldKgPerHa: number;
  minYieldKgPerHa: number;
  maxYieldKgPerHa: number;
  avgNReq: number;
  avgPReq: number;
  avgKReq: number;
  avgTempC: number;
  avgHumidityPct: number;
  avgPh: number;
  avgRainfallMm: number;
  topStates: string[];
}

let cachedRecords: HistoricalCropRecord[] | null = null;

export function loadHistoricalDataset(): HistoricalCropRecord[] {
  if (cachedRecords) return cachedRecords;

  const csvPath = path.join(process.cwd(), "Custom_Crops_yield_Historical_Dataset.csv");
  if (!fs.existsSync(csvPath)) {
    return [];
  }

  try {
    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const lines = fileContent.split(/\r?\n/);
    const records: HistoricalCropRecord[] = [];

    // Header is line 0
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(",");
      if (cols.length < 20) continue;

      records.push({
        distCode: parseInt(cols[0], 10) || 0,
        year: parseInt(cols[1], 10) || 0,
        stateCode: parseInt(cols[2], 10) || 0,
        stateName: cols[3].trim(),
        distName: cols[4].trim(),
        crop: cols[5].trim().toLowerCase(),
        areaHa: parseFloat(cols[6]) || 0,
        yieldKgPerHa: parseFloat(cols[7]) || 0,
        nReqKgPerHa: parseFloat(cols[8]) || 0,
        pReqKgPerHa: parseFloat(cols[9]) || 0,
        kReqKgPerHa: parseFloat(cols[10]) || 0,
        totalN: parseFloat(cols[11]) || 0,
        totalP: parseFloat(cols[12]) || 0,
        totalK: parseFloat(cols[13]) || 0,
        temperatureC: parseFloat(cols[14]) || 0,
        humidityPct: parseFloat(cols[15]) || 0,
        ph: parseFloat(cols[16]) || 0,
        rainfallMm: parseFloat(cols[17]) || 0,
        windSpeedMs: parseFloat(cols[18]) || 0,
        solarRadiation: parseFloat(cols[19]) || 0
      });
    }

    cachedRecords = records;
    return records;
  } catch (error) {
    console.error("Failed to read historical dataset:", error);
    return [];
  }
}

export function getCropBenchmarkStats(cropName: string): CropBenchmarkStats | null {
  const records = loadHistoricalDataset();
  const normalizedCrop = cropName.toLowerCase().trim();
  const filtered = records.filter((r) => r.crop === normalizedCrop);

  if (filtered.length === 0) return null;

  let totalYield = 0;
  let minYield = Infinity;
  let maxYield = -Infinity;
  let totalN = 0;
  let totalP = 0;
  let totalK = 0;
  let totalTemp = 0;
  let totalHum = 0;
  let totalPh = 0;
  let totalRain = 0;

  const stateCounts: Record<string, number> = {};

  filtered.forEach((r) => {
    totalYield += r.yieldKgPerHa;
    if (r.yieldKgPerHa < minYield) minYield = r.yieldKgPerHa;
    if (r.yieldKgPerHa > maxYield) maxYield = r.yieldKgPerHa;

    totalN += r.nReqKgPerHa;
    totalP += r.pReqKgPerHa;
    totalK += r.kReqKgPerHa;
    totalTemp += r.temperatureC;
    totalHum += r.humidityPct;
    totalPh += r.ph;
    totalRain += r.rainfallMm;

    stateCounts[r.stateName] = (stateCounts[r.stateName] || 0) + 1;
  });

  const count = filtered.length;
  const topStates = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([state]) => state);

  return {
    crop: cropName,
    recordCount: count,
    avgYieldKgPerHa: Math.round((totalYield / count) * 100) / 100,
    minYieldKgPerHa: Math.round(minYield * 100) / 100,
    maxYieldKgPerHa: Math.round(maxYield * 100) / 100,
    avgNReq: Math.round((totalN / count) * 100) / 100,
    avgPReq: Math.round((totalP / count) * 100) / 100,
    avgKReq: Math.round((totalK / count) * 100) / 100,
    avgTempC: Math.round((totalTemp / count) * 10) / 10,
    avgHumidityPct: Math.round((totalHum / count) * 10) / 10,
    avgPh: Math.round((totalPh / count) * 100) / 100,
    avgRainfallMm: Math.round((totalRain / count) * 10) / 10,
    topStates
  };
}

export function getHistoricalYieldTrends(cropName: string, stateName?: string) {
  const records = loadHistoricalDataset();
  const normalizedCrop = cropName.toLowerCase().trim();

  let filtered = records.filter((r) => r.crop === normalizedCrop);
  if (stateName) {
    filtered = filtered.filter((r) => r.stateName.toLowerCase() === stateName.toLowerCase());
  }

  const yearlyMap: Record<number, { totalYield: number; count: number; totalRainfall: number }> = {};

  filtered.forEach((r) => {
    if (!yearlyMap[r.year]) {
      yearlyMap[r.year] = { totalYield: 0, count: 0, totalRainfall: 0 };
    }
    yearlyMap[r.year].totalYield += r.yieldKgPerHa;
    yearlyMap[r.year].totalRainfall += r.rainfallMm;
    yearlyMap[r.year].count += 1;
  });

  return Object.entries(yearlyMap)
    .map(([yearStr, data]) => ({
      year: parseInt(yearStr, 10),
      avgYield: Math.round(data.totalYield / data.count),
      avgRainfall: Math.round(data.totalRainfall / data.count)
    }))
    .sort((a, b) => a.year - b.year);
}
