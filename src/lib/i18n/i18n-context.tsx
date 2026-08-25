"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  CROP_TRANSLATIONS,
  RISK_LEVEL_TRANSLATIONS,
  SOIL_TYPE_TRANSLATIONS,
  IRRIGATION_TRANSLATIONS,
  GROWTH_STAGE_TRANSLATIONS,
  SEASON_TRANSLATIONS,
  type SupportedLanguage,
} from "./config";
import en from "./locales/en.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import kn from "./locales/kn.json";
import hi from "./locales/hi.json";

const dictionaries: Record<SupportedLanguage, any> = { en, ta, te, kn, hi };

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getCropName: (cropId: string) => string;
  getRiskLevelLabel: (riskLevel: string) => string;
  getSoilTypeLabel: (soilType: string) => string;
  getIrrigationLabel: (irrigationType: string) => string;
  getGrowthStageLabel: (stage: string) => string;
  getSeasonLabel: (season: string) => string;
  isPending: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "agririsk_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lang") as SupportedLanguage;
      if (urlLang && SUPPORTED_LANGUAGES.some((l) => l.code === urlLang)) {
        setLanguageState(urlLang);
        localStorage.setItem(STORAGE_KEY, urlLang);
        return;
      }

      const savedLang = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
        setLanguageState(savedLang);
        return;
      }

      fetch("/api/profile/language")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.language && SUPPORTED_LANGUAGES.some((l) => l.code === data.language)) {
            setLanguageState(data.language);
            localStorage.setItem(STORAGE_KEY, data.language);
          }
        })
        .catch(() => {});
    }
  }, []);

  const changeLanguage = (newLang: SupportedLanguage) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === newLang)) return;

    startTransition(() => {
      setLanguageState(newLang);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, newLang);
        
        const url = new URL(window.location.href);
        url.searchParams.set("lang", newLang);
        window.history.replaceState({}, "", url.toString());
      }

      fetch("/api/profile/language", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLang }),
      }).catch((e) => console.warn("Failed to persist language preference:", e));
    });
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let current: any = dictionaries[language] || dictionaries[DEFAULT_LANGUAGE];
    
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        let fallback: any = dictionaries[DEFAULT_LANGUAGE];
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== "string") {
      return key;
    }

    if (params) {
      let result = current;
      Object.entries(params).forEach(([pKey, pVal]) => {
        result = result.replace(new RegExp(`{\\s*${pKey}\\s*}`, "g"), String(pVal));
      });
      return result;
    }

    return current;
  };

  const getCropName = (cropId: string): string => {
    const lower = cropId.toLowerCase().trim();
    if (CROP_TRANSLATIONS[lower]) {
      return CROP_TRANSLATIONS[lower][language] || CROP_TRANSLATIONS[lower][DEFAULT_LANGUAGE];
    }
    return cropId;
  };

  const getRiskLevelLabel = (riskLevel: string): string => {
    const upper = riskLevel.toUpperCase().trim();
    if (RISK_LEVEL_TRANSLATIONS[upper]) {
      return (
        RISK_LEVEL_TRANSLATIONS[upper][language] ||
        RISK_LEVEL_TRANSLATIONS[upper][DEFAULT_LANGUAGE]
      );
    }
    return riskLevel;
  };

  const getSoilTypeLabel = (soilType: string): string => {
    const lower = soilType.toLowerCase().trim();
    if (SOIL_TYPE_TRANSLATIONS[lower]) {
      return SOIL_TYPE_TRANSLATIONS[lower][language] || SOIL_TYPE_TRANSLATIONS[lower][DEFAULT_LANGUAGE];
    }
    return soilType;
  };

  const getIrrigationLabel = (irrigationType: string): string => {
    const lower = irrigationType.toLowerCase().trim();
    if (IRRIGATION_TRANSLATIONS[lower]) {
      return IRRIGATION_TRANSLATIONS[lower][language] || IRRIGATION_TRANSLATIONS[lower][DEFAULT_LANGUAGE];
    }
    return irrigationType;
  };

  const getGrowthStageLabel = (stage: string): string => {
    const lower = stage.toLowerCase().trim();
    if (GROWTH_STAGE_TRANSLATIONS[lower]) {
      return GROWTH_STAGE_TRANSLATIONS[lower][language] || GROWTH_STAGE_TRANSLATIONS[lower][DEFAULT_LANGUAGE];
    }
    return stage;
  };

  const getSeasonLabel = (season: string): string => {
    const lower = season.toLowerCase().trim();
    if (SEASON_TRANSLATIONS[lower]) {
      return SEASON_TRANSLATIONS[lower][language] || SEASON_TRANSLATIONS[lower][DEFAULT_LANGUAGE];
    }
    return season;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
        getCropName,
        getRiskLevelLabel,
        getSoilTypeLabel,
        getIrrigationLabel,
        getGrowthStageLabel,
        getSeasonLabel,
        isPending,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

