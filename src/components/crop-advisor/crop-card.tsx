import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { formatCurrency } from "@/lib/scoring/risk";
import type { CropRecommendation } from "@/types/domain";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { useUserInput } from "@/components/providers/user-input-provider";

export function CropCard({ crop }: { crop: CropRecommendation }) {
  const { t, getCropName } = useTranslation();
  const { inputs } = useUserInput();

  return (
    <Card className="flex h-full flex-col overflow-hidden p-4 sm:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">{t("cropAdvisor.recommendedCrop")}</p>
          <h2 className="mt-0.5 text-base sm:text-xl font-extrabold text-slate-950 break-words leading-tight">
            {getCropName(crop.crop)}
          </h2>
        </div>
        <div className="shrink-0">
          <RiskBadge level={crop.riskLevel} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs sm:text-sm">
        <div className="min-w-0">
          <p className="text-slate-500 font-medium text-[11px] sm:text-xs truncate">{t("cropAdvisor.decisionScore")}</p>
          <p className="text-sm sm:text-lg font-extrabold text-slate-900 truncate">{crop.decisionScore}</p>
        </div>
        <div className="min-w-0">
          <p className="text-slate-500 font-medium text-[11px] sm:text-xs truncate">{t("cropAdvisor.expectedYield")}</p>
          <p className="text-sm sm:text-lg font-extrabold text-slate-900 truncate">{crop.expectedYield} t/ha</p>
        </div>
        <div className="min-w-0">
          <p className="text-slate-500 font-medium text-[11px] sm:text-xs truncate">{t("cropAdvisor.market")}</p>
          <p className="text-sm sm:text-lg font-extrabold text-slate-900 truncate">{crop.marketScore}</p>
        </div>
        <div className="min-w-0">
          <p className="text-slate-500 font-medium text-[11px] sm:text-xs truncate">{t("cropAdvisor.riskAdjustedProfit")}</p>
          <p className="text-sm sm:text-lg font-extrabold text-crop truncate">{formatCurrency(crop.riskAdjustedProfit)}</p>
        </div>
      </div>

      <p className="mt-4 flex-1 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600 font-medium">
        {crop.explanation}
      </p>

      <Link
        className="mt-4 block rounded-xl bg-crop py-2.5 px-3 text-center text-xs sm:text-sm font-bold text-white shadow-md hover:bg-crop/90 active:scale-95 transition-all cursor-pointer truncate"
        href={`/crop-advisor/${crop.crop.toLowerCase()}`}
      >
        {t("cropAdvisor.viewDecisionDetail")}
      </Link>
    </Card>
  );
}
