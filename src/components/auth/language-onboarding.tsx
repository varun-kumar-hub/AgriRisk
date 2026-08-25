"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sprout, Check, ArrowRight, Tractor } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/i18n/config";
import { useAuth } from "@/components/providers/auth-provider";

const ONBOARDING_KEY = "agririsk_onboarding_completed";

export function LanguageOnboardingModal() {
  const { user, loading } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"language" | "workflow">("language");

  useEffect(() => {
    if (loading) return;

    // Only prompt for language & workflow selection AFTER user has signed in
    if (user) {
      const userKey = `agririsk_onboarding_${user.id}`;
      const completed = localStorage.getItem(userKey) || localStorage.getItem(ONBOARDING_KEY);
      if (!completed) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  }, [user, loading]);

  const handleLanguageSelect = (code: SupportedLanguage) => {
    setLanguage(code);
  };

  const handleContinue = () => {
    setStep("workflow");
  };

  const handleFinish = () => {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem(`agririsk_onboarding_${user.id}`, "true");
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
    setIsOpen(false);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {step === "language" ? (
          <div>
            <div className="text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-crop/20 text-crop shadow-sm">
                <Sprout size={28} />
              </span>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
                {t("auth.welcomeOnboarding")}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {t("auth.chooseLanguage")}
              </p>
            </div>

            <div className="mt-6 space-y-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "border-crop bg-crop/10 text-crop shadow-sm ring-2 ring-crop/20"
                        : "border-slate-200 bg-slate-50/50 text-slate-800 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <p className="text-base leading-none font-bold">{lang.nativeName}</p>
                        <p className="text-xs font-normal text-slate-500 mt-1">{lang.name}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="grid size-6 place-items-center rounded-full bg-crop text-white shadow-xs">
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleContinue}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-crop py-3.5 text-base font-bold text-white shadow-lg hover:bg-crop/90 active:scale-95 transition-all cursor-pointer"
            >
              <span>{t("common.save")}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-crop/20 text-crop shadow-sm">
                <Sprout size={28} />
              </span>
              <h2 className="mt-4 text-xl font-extrabold text-slate-900">
                {t("auth.whatNext")}
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/crop-advisor"
                onClick={handleFinish}
                className="flex items-center gap-4 rounded-2xl border-2 border-crop/30 bg-crop/5 p-4 transition-all hover:border-crop hover:bg-crop/10 cursor-pointer group"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-crop text-white shadow-sm group-hover:scale-105 transition-transform">
                  <Sprout size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t("auth.planCrop")}</h3>
                  <p className="text-xs text-slate-500 font-medium">Select crops based on soil & weather risk intelligence</p>
                </div>
              </Link>

              <Link
                href="/farms"
                onClick={handleFinish}
                className="flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-slate-300 hover:bg-slate-100 cursor-pointer group"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-800 text-white shadow-sm group-hover:scale-105 transition-transform">
                  <Tractor size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t("auth.manageCrop")}</h3>
                  <p className="text-xs text-slate-500 font-medium">Monitor active crop health & diagnostic alerts</p>
                </div>
              </Link>
            </div>

            <button
              onClick={handleFinish}
              className="mt-6 w-full rounded-2xl border border-slate-300 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              {t("navigation.dashboard")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

