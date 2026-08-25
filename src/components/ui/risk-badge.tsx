"use client";

import type { RiskLevel } from "@/types/domain";
import { useTranslation } from "@/lib/i18n/i18n-context";

const styles: Record<RiskLevel, string> = {
  LOW: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  MODERATE: "bg-amber-50 text-amber-700 ring-amber-200",
  HIGH: "bg-orange-50 text-orange-700 ring-orange-200",
  CRITICAL: "bg-red-50 text-red-700 ring-red-200"
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const { getRiskLevelLabel } = useTranslation();
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[level]}`}>{getRiskLevelLabel(level)}</span>;
}

