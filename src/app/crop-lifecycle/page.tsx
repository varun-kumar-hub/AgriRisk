"use client";

import { Calendar, CheckCircle2, Clock, Sprout, Milestone } from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { RiskBadge } from "@/components/ui/risk-badge";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function CropLifecyclePage() {
  const { farm, activeCropCycle, cropRisk, inputs } = useUserInput();
  const { language, t, getCropName, getGrowthStageLabel, getSeasonLabel, getIrrigationLabel } = useTranslation();

  const getStageDetails = (lang: string) => {
    if (lang === "te") {
      return [
        {
          stage: "విత్తనం / మొలకెత్తడం",
          days: "రోజులు 1-14",
          status: "పూర్తయింది",
          statusType: "COMPLETED",
          desc: "విత్తనం మొలకెత్తడం మరియు వేర్ల ప్రాథమిక వ్యవస్థ ఏర్పాటు.",
          milestone: "100% మొలకెత్తడం సాధించబడింది"
        },
        {
          stage: "శాకాహార ఎదుగుదల దశ (Vegetative)",
          days: "రోజులు 15-45",
          status: "ప్రస్తుతం క్రియాశీలకం",
          statusType: "ACTIVE",
          desc: "పిలకల తొడుగులు, కాండం పొడవు పెరుగుదల మరియు ఆకుల విస్తరణ.",
          milestone: `ప్రస్తుత దశ · ${activeCropCycle.ageDays}వ రోజు`
        },
        {
          stage: "పూత మరియు పొట్ట దశ (Flowering)",
          days: "రోజులు 46-75",
          status: "రాబోయే దశ",
          statusType: "UPCOMING",
          desc: "సరైన N-P-K ఎరువులు మరియు నీటి లభ్యత అవసరమయ్యే దశ.",
          milestone: "ఇంకా ~18 రోజుల్లో ప్రారంభం"
        },
        {
          stage: "గింజ పరిపక్వత దశ (Grain Filling)",
          days: "రోజులు 76-110",
          status: "రాబోయే దశ",
          statusType: "UPCOMING",
          desc: "పిండి పదార్థాల చేరిక, గింజ గట్టిపడటం మరియు పాలు పోసుకునే దశ.",
          milestone: "ఇంకా ~45 రోజుల్లో ప్రారంభం"
        },
        {
          stage: "పంట కోత మరియు నిల్వ (Harvest)",
          days: "రోజులు 111-120",
          status: "రాబోయే దశ",
          statusType: "UPCOMING",
          desc: "పంట కోత యంత్రాల ద్వారా కోయడం, తేమ శాతం తనిఖీ మరియు మార్కెట్ రవాణా.",
          milestone: "ఇంకా ~75 రోజుల్లో ప్రారంభం"
        }
      ];
    } else if (lang === "ta") {
      return [
        {
          stage: "விதைப்பு / முளைத்தல்",
          days: "நாட்கள் 1-14",
          status: "முடிவடைந்தது",
          statusType: "COMPLETED",
          desc: "விதை முளைத்தல் மற்றும் ஆரம்ப வேர் வளர்ச்சி.",
          milestone: "100% முளைப்புத்திறன் அடையப்பட்டது"
        },
        {
          stage: "வளர்ச்சி நிலை (Vegetative)",
          days: "நாட்கள் 15-45",
          status: "தற்போது செயல்படுகிறது",
          statusType: "ACTIVE",
          desc: "தூர் கட்டுதல், தண்டு நீட்சி மற்றும் இலைகள் அடர்த்தி பெறுதல்.",
          milestone: `தற்போதைய நிலை · நாள் ${activeCropCycle.ageDays}`
        },
        {
          stage: "பூக்கும் நிலை (Flowering)",
          days: "நாட்கள் 46-75",
          status: "வரவிருக்கும் நிலை",
          statusType: "UPCOMING",
          desc: "சீரான N-P-K உரம் மற்றும் நீர் மேலாண்மை தேவைப்படும் பருவம்.",
          milestone: "இன்னும் ~18 நாட்களில் எதிர்பார்க்கப்படுகிறது"
        },
        {
          stage: "கதிர் முதிர்ச்சி நிலை (Grain Filling)",
          days: "நாட்கள் 76-110",
          status: "வரவிருக்கும் நிலை",
          statusType: "UPCOMING",
          desc: "தானியம் திரளுதல் மற்றும் நீர் வடித்தல் தயாரிப்பு.",
          milestone: "இன்னும் ~45 நாட்களில் எதிர்பார்க்கப்படுகிறது"
        },
        {
          stage: "அறுவடை நிலை (Harvest)",
          days: "நாட்கள் 111-120",
          status: "வரவிருக்கும் நிலை",
          statusType: "UPCOMING",
          desc: "எந்திர அறுவடை, ஈரப்பதம் பரிசோதனை மற்றும் சந்தைக்குக் கொண்டு செல்லுதல்.",
          milestone: "இன்னும் ~75 நாட்களில் எதிர்பார்க்கப்படுகிறது"
        }
      ];
    } else if (lang === "hi") {
      return [
        {
          stage: "बुआई / अंकुरण अवस्था",
          days: "दिन 1-14",
          status: "पूर्ण",
          statusType: "COMPLETED",
          desc: "बीज अंकुरण और प्रारंभिक जड़ों का विकास।",
          milestone: "100% अंकुरण प्राप्त हुआ"
        },
        {
          stage: "वानस्पतिक वृद्धि अवस्था (Vegetative)",
          days: "दिन 15-45",
          status: "सक्रिय",
          statusType: "ACTIVE",
          desc: "कल्ले निकलना, तने की लंबाई और पत्तियों का फैलाव।",
          milestone: `वर्तमान चरण · दिन ${activeCropCycle.ageDays}`
        },
        {
          stage: "पुष्पन एवं गभोट अवस्था (Flowering)",
          days: "दिन 46-75",
          status: "आगामी",
          statusType: "UPCOMING",
          desc: "उचित N-P-K पोषक तत्व और जल प्रबंधन की आवश्यकता वाली अवस्था।",
          milestone: "~18 दिनों में अपेक्षित"
        },
        {
          stage: "दाना भरना एवं परिपक्वता (Grain Filling)",
          days: "दिन 76-110",
          status: "आगामी",
          statusType: "UPCOMING",
          desc: "दाने में स्टार्च का जमाव और पकने की तैयारी।",
          milestone: "~45 दिनों में अपेक्षित"
        },
        {
          stage: "कटाई एवं भंडारण (Harvest)",
          days: "दिन 111-120",
          status: "आगामी",
          statusType: "UPCOMING",
          desc: "कंबाइन हार्वेस्टिंग, नमी परीक्षण और मंडी परिवहन।",
          milestone: "~75 दिनों में अपेक्षित"
        }
      ];
    }

    return [
      {
        stage: "Sowing / Germination",
        days: "Days 1-14",
        status: "COMPLETED",
        statusType: "COMPLETED",
        desc: "Seed emergence and early root establishment.",
        milestone: "100% germination achieved"
      },
      {
        stage: "Vegetative Phase",
        days: "Days 15-45",
        status: "ACTIVE",
        statusType: "ACTIVE",
        desc: "Active tillering, stem elongation & leaf canopy biomass expansion.",
        milestone: `Current phase · Day ${activeCropCycle.ageDays}`
      },
      {
        stage: "Flowering & Panicle Initiation",
        days: "Days 46-75",
        status: "UPCOMING",
        statusType: "UPCOMING",
        desc: "Reproductive phase requiring optimal N-P-K nutrient balance and moisture.",
        milestone: "Expected in ~18 days"
      },
      {
        stage: "Grain Filling & Ripening",
        days: "Days 76-110",
        status: "UPCOMING",
        statusType: "UPCOMING",
        desc: "Starch accumulation, grain hardiness, and field drainage prep.",
        milestone: "Expected in ~45 days"
      },
      {
        stage: "Harvest & Post-Harvest",
        days: "Days 111-120",
        status: "UPCOMING",
        statusType: "UPCOMING",
        desc: "Combine harvesting, moisture content testing, and mandi transport.",
        milestone: "Expected in ~75 days"
      }
    ];
  };

  const stages = getStageDetails(language);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-crop">{t("navigation.cropManagement")}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">{t("navigation.cropLifecycle")} — {getCropName(activeCropCycle.crop)}</h1>
        <p className="mt-2 text-slate-600">
          {language === "te" ? "పంట ఎదుగుదల మైలురాళ్లు, విత్తే సమయం, క్రియాశీల దశ మరియు నిర్వహణ గడువులను చూడండి." :
           language === "ta" ? "பயிர் வளர்ச்சி மைல்கற்கள், விதைப்பு நாள் மற்றும் பராமரிப்பு காலவரிசையைக் கண்காணிக்கவும்." :
           language === "hi" ? "फसल वृद्धि के मील के पत्थर, बुआई की उम्र और प्रबंधन समय सीमा ट्रैक करें।" :
           "Track growth milestones, sowing age, active crop stage, and field intervention timelines."}
        </p>
      </header>

      <CustomInputPanel />

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard
          title={language === "te" ? "ప్రస్తుత దశ" : language === "ta" ? "தற்போதைய நிலை" : language === "hi" ? "वर्तमान चरण" : "Current Stage"}
          value={getGrowthStageLabel(activeCropCycle.stage)}
          detail={language === "te" ? `విత్తి ${activeCropCycle.ageDays} రోజులు అయింది` : `Day ${activeCropCycle.ageDays} since sowing`}
        />
        <MetricCard
          title={language === "te" ? "పంట కాలం" : language === "ta" ? "பருவம் & சுழற்சி" : language === "hi" ? "फसल सीजन" : "Season & Cycle"}
          value={getSeasonLabel(activeCropCycle.season)}
          detail={language === "te" ? `విత్తిన తేది: ${inputs.sowingDate}` : `Sown on ${inputs.sowingDate}`}
        />
        <MetricCard
          title={language === "te" ? "నేల తేమ" : language === "ta" ? "மண் ஈரப்பதம்" : language === "hi" ? "खेत नमी" : "Field Moisture"}
          value={inputs.waterAvailability}
          detail={getIrrigationLabel(farm.irrigationType)}
        />
        <MetricCard
          title={language === "te" ? "దశ వారీ ప్రమాదం" : language === "ta" ? "நிலை ஆபத்து" : language === "hi" ? "जोखिम स्तर" : "Stage Risk Level"}
          value={`${cropRisk.overallScore}/100`}
          detail="Dynamic risk evaluation"
        >
          <RiskBadge level={cropRisk.level} />
        </MetricCard>
      </section>

      <Card className="mt-6">
        <CardTitle className="flex items-center gap-2">
          <Milestone size={20} className="text-crop" />
          {language === "te" ? "పంట పెరుగుదల దశల కాలక్రమం & మైలురాళ్లు" :
           language === "ta" ? "பயிர் வளர்ச்சி காலவரிசை & மைல்கற்கள்" :
           language === "hi" ? "फसल वृद्धि समय सीमा और मील के पत्थर" :
           "CROP GROWTH STAGE TIMELINE & MILESTONES"}
        </CardTitle>

        <div className="mt-6 space-y-6">
          {stages.map((stg, idx) => (
            <div key={idx} className="relative flex items-start gap-4 pb-6 last:pb-0 border-l-2 border-slate-200 pl-6 last:border-l-0">
              <span className={`absolute -left-[17px] top-0 grid size-8 place-items-center rounded-full text-white shadow-md ${
                stg.statusType === "COMPLETED" ? "bg-emerald-600" : stg.statusType === "ACTIVE" ? "bg-crop ring-4 ring-crop/20" : "bg-slate-300"
              }`}>
                {stg.statusType === "COMPLETED" ? <CheckCircle2 size={16} /> : stg.statusType === "ACTIVE" ? <Sprout size={16} /> : <Clock size={16} />}
              </span>

              <div className="flex-1 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{stg.stage}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">{stg.days}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      stg.statusType === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : stg.statusType === "ACTIVE" ? "bg-crop/20 text-crop" : "bg-slate-200 text-slate-600"
                    }`}>
                      {stg.status}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-6">{stg.desc}</p>
                <p className="mt-3 text-xs font-bold text-slate-700 bg-white p-2 rounded-xl border border-slate-200 inline-block">
                  📌 {stg.milestone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
