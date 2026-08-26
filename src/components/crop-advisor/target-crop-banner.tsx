"use client";

import { useUserInput } from "@/components/providers/user-input-provider";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { getAgronomicConstraintReason } from "@/lib/data/store";
import { RiskBadge } from "@/components/ui/risk-badge";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

export function TargetCropStatusBanner() {
  const { inputs, recommendations, updateInputs } = useUserInput();
  const { language, t, getCropName } = useTranslation();

  const selectedCropName = inputs.selectedCrop || "rice";
  const targetRec = recommendations.find((r) => r.crop.toLowerCase().includes(selectedCropName.toLowerCase())) || recommendations[0];

  const topRec = recommendations[0];
  const isTargetRecommended = targetRec.decisionScore >= 75 && (targetRec.riskLevel === "LOW" || targetRec.riskLevel === "MODERATE");

  const constraintReasons = getAgronomicConstraintReason(selectedCropName, inputs, language);

  const getLabel = (key: string) => {
    if (language === "ta") {
      if (key === "activeTarget") return "தேர்ந்தெடுக்கப்பட்ட பயிர்:";
      if (key === "suitability") return "பொருத்தம்:";
      if (key === "recommended") return `✅ ${getCropName(targetRec.crop)} பயிர் உங்கள் மண்ணின் pH (${inputs.soilPh}), பயிர் வயது (${inputs.cropAge || 45} நாட்கள்) மற்றும் ${inputs.distName} தட்பவெப்பநிலைக்கு உகந்தது.`;
      if (key === "notRecommended") return `⚠️ ${getCropName(targetRec.crop)} பயிர் உங்கள் தற்போதைய நிலவரத்திற்கு உகந்தது அல்ல. வேளாண் காரணங்கள்:`;
      if (key === "alternative") return "சிறந்த மாற்று பயிர்";
      if (key === "switch") return `மாற்று பயிருக்கு மாறவும்`;
    } else if (language === "te") {
      if (key === "activeTarget") return "ఎంచుకున్న పంట:";
      if (key === "suitability") return "అనుకూలత:";
      if (key === "recommended") return `✅ ${getCropName(targetRec.crop)} పంట మీ నేల pH (${inputs.soilPh}), పంట వయస్సు (${inputs.cropAge || 45} రోజులు) మరియు ${inputs.distName} వాతావరణానికి బాగా అనుకూలం.`;
      if (key === "notRecommended") return `⚠️ ${getCropName(targetRec.crop)} పంట మీ ప్రస్తుత వివరాలకు అనుకూలమైనది కాదు. వ్యవసాయ ప్రతిబంధకాలు:`;
      if (key === "alternative") return "ఉత్తమ ప్రత్యామ్నాయ పంట";
      if (key === "switch") return `మార్చండి`;
    } else if (language === "kn") {
      if (key === "activeTarget") return "ಆಯ್ಕೆಮಾಡಿದ ಬೆಳೆ:";
      if (key === "suitability") return "ಸೂಕ್ತತೆ:";
      if (key === "recommended") return `✅ ${getCropName(targetRec.crop)} ಬೆಳೆ ನಿಮ್ಮ ಮಣ್ಣಿನ pH (${inputs.soilPh}) ಮತ್ತು ${inputs.distName} ಹವಾಮಾನಕ್ಕೆ ಸೂಕ್ತವಾಗಿದೆ.`;
      if (key === "notRecommended") return `⚠️ ${getCropName(targetRec.crop)} ಬೆಳೆ ನಿಮ್ಮ ಸದ್ಯದ ಪರಿಸ್ಥಿತಿಗೆ ಸೂಕ್ತವಲ್ಲ. ಕೃಷಿ ಕಾರಣಗಳು:`;
      if (key === "alternative") return "ಉತ್ತಮ ಪರ್ಯಾಯ ಬೆಳೆ";
      if (key === "switch") return `ಬದಲಾಯಿಸಿ`;
    } else if (language === "hi") {
      if (key === "activeTarget") return "चयनित फसल:";
      if (key === "suitability") return "उपयुक्तता:";
      if (key === "recommended") return `✅ ${getCropName(targetRec.crop)} फसल आपकी मिट्टी pH (${inputs.soilPh}) और ${inputs.distName} के मौसम के लिए बिल्कुल अनुकूल है।`;
      if (key === "notRecommended") return `⚠️ ${getCropName(targetRec.crop)} फसल आपके वर्तमान इनपुट के तहत अनुशंसित नहीं है। विस्तृत कृषि कारण:`;
      if (key === "alternative") return "उत्कृष्ट वैकल्पिक फसल";
      if (key === "switch") return `बदलें`;
    }
    if (key === "activeTarget") return "Active Target Crop:";
    if (key === "suitability") return "Suitability Fit:";
    if (key === "recommended") return `✅ ${getCropName(targetRec.crop)} is well suited for your soil pH (${inputs.soilPh}), Crop Age (${inputs.cropAge || 45} Days), temperature (${inputs.temperatureC}°C), and water supply in ${inputs.distName}, ${inputs.stateName}.`;
    if (key === "notRecommended") return `⚠️ ${getCropName(targetRec.crop)} is NOT recommended under your current farm inputs. Detailed agronomic constraints:`;
    if (key === "alternative") return "Better Alternative";
    if (key === "switch") return `Switch to`;
    return "";
  };

  return (
    <div className={`my-6 rounded-2xl border p-5 shadow-sm transition-all ${
      isTargetRecommended
        ? "border-emerald-300 bg-emerald-50/70"
        : "border-amber-300 bg-amber-50/80"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`grid size-10 place-items-center rounded-xl shrink-0 text-white shadow-sm ${
            isTargetRecommended ? "bg-emerald-600" : "bg-amber-600"
          }`}>
            {isTargetRecommended ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {getLabel("activeTarget")}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 capitalize">
                {getCropName(targetRec.crop)}
              </h3>
              <RiskBadge level={targetRec.riskLevel} />
              <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-md border">
                {getLabel("suitability")} {targetRec.decisionScore}/100
              </span>
            </div>

            {isTargetRecommended ? (
              <p className="mt-2 text-sm text-emerald-900 font-medium">
                {getLabel("recommended")}
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                <p className="text-sm font-bold text-amber-950">
                  {getLabel("notRecommended")}
                </p>
                <ul className="space-y-1.5 text-xs text-amber-900 font-medium pl-1">
                  {constraintReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-white/70 p-2 rounded-lg border border-amber-200">
                      <span className="text-amber-600 font-bold shrink-0">❌</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {!isTargetRecommended && topRec && topRec.crop !== targetRec.crop && (
          <div className="mt-3 sm:mt-0 shrink-0 rounded-xl bg-white p-3 border border-amber-200 text-right">
            <p className="text-[11px] font-bold uppercase text-slate-400">{getLabel("alternative")}</p>
            <p className="text-sm font-bold text-slate-900">{getCropName(topRec.crop)} ({topRec.decisionScore}/100)</p>
            <button
              onClick={() => updateInputs({ selectedCrop: topRec.crop.toLowerCase().split(" ")[0] })}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-crop px-3 py-1.5 text-xs font-bold text-white hover:bg-crop/90 cursor-pointer"
            >
              {getLabel("switch")} {getCropName(topRec.crop)} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
