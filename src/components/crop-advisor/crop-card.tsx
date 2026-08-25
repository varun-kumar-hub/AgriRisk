import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { formatCurrency } from "@/lib/scoring/risk";
import type { CropRecommendation } from "@/types/domain";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function CropCard({ crop }: { crop: CropRecommendation }) {
  const { t, getCropName } = useTranslation();

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{t("cropAdvisor.recommendedCrop")}</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">{getCropName(crop.crop)}</h2>
        </div>
        <RiskBadge level={crop.riskLevel} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500">{t("cropAdvisor.decisionScore")}</p>
          <p className="text-xl font-semibold">{crop.decisionScore}</p>
        </div>
        <div>
          <p className="text-slate-500">{t("cropAdvisor.expectedYield")}</p>
          <p className="text-xl font-semibold">{crop.expectedYield} t/ha</p>
        </div>
        <div>
          <p className="text-slate-500">{t("cropAdvisor.market")}</p>
          <p className="text-xl font-semibold">{crop.marketScore}</p>
        </div>
        <div>
          <p className="text-slate-500">{t("cropAdvisor.riskAdjustedProfit")}</p>
          <p className="text-xl font-semibold">{formatCurrency(crop.riskAdjustedProfit)}</p>
        </div>
      </div>
      <p className="mt-5 flex-1 text-sm leading-6 text-slate-600">{crop.explanation}</p>
      <Link className="mt-5 rounded-md bg-crop px-4 py-2 text-center text-sm font-semibold text-white" href={`/crop-advisor/${crop.crop.toLowerCase()}`}>
        {t("cropAdvisor.viewDecisionDetail")}
      </Link>
    </Card>
  );
}

