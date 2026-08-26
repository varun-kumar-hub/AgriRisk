"use client";

import { createContext, useContext, useEffect, useMemo, useState, startTransition } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { defaultUserInputs, CustomUserInputs, calculateDynamicCropRecommendations, getDynamicFarm, getDynamicCropCycle, getDynamicCropRisk } from "@/lib/data/store";
import type { Farm, CropRecommendation, CropCycle, CropRisk } from "@/types/domain";

interface UserInputContextType {
  inputs: CustomUserInputs;
  updateInputs: (newInputs: Partial<CustomUserInputs>) => void;
  resetInputs: () => void;
  farm: Farm;
  recommendations: CropRecommendation[];
  activeCropCycle: CropCycle;
  cropRisk: CropRisk;
  loadingAi: boolean;
  refreshAiPredictions: () => Promise<void>;
}

const UserInputContext = createContext<UserInputContextType | null>(null);

export function UserInputProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { language } = useTranslation();
  const userId = user?.id || "guest";
  const storageKey = `agririsk_inputs_${userId}`;

  const [inputs, setInputs] = useState<CustomUserInputs>(() => {
    return {
      ...defaultUserInputs,
      farmName: user?.email ? `${user.email.split("@")[0]}'s Farm` : defaultUserInputs.farmName
    };
  });

  const [aiRecommendations, setAiRecommendations] = useState<CropRecommendation[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  // Re-load user-isolated inputs whenever user changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setInputs({ ...defaultUserInputs, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse user isolated inputs:", e);
      }
    } else if (user?.email) {
      setInputs({
        ...defaultUserInputs,
        farmName: `${user.email.split("@")[0]}'s Farm`
      });
    }
  }, [userId, user?.email, storageKey]);

  const refreshAiPredictions = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/crop-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs, language })
      });
      const data = await res.json();
      if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        setAiRecommendations(data.recommendations);
      }
    } catch (e) {
      console.warn("Failed to fetch AI crop predictions:", e);
    } finally {
      setLoadingAi(false);
    }
  };

  // Fetch AI predictions when inputs or language change
  useEffect(() => {
    refreshAiPredictions();
  }, [inputs, language]);

  const updateInputs = (newInputs: Partial<CustomUserInputs>) => {
    startTransition(() => {
      setInputs((prev) => {
        const updated = { ...prev, ...newInputs };
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    });
  };

  const resetInputs = () => {
    startTransition(() => {
      const resetState = {
        ...defaultUserInputs,
        farmName: user?.email ? `${user.email.split("@")[0]}'s Farm` : defaultUserInputs.farmName
      };
      setInputs(resetState);
      localStorage.removeItem(storageKey);
    });
  };

  const farm = useMemo(() => getDynamicFarm(inputs), [inputs]);
  const fallbackRecommendations = useMemo(() => calculateDynamicCropRecommendations(inputs, language), [inputs, language]);
  const activeCropCycle = useMemo(() => getDynamicCropCycle(inputs), [inputs]);
  const cropRisk = useMemo(() => getDynamicCropRisk(inputs, language), [inputs, language]);

  const mergedRecommendations = useMemo(() => {
    return aiRecommendations.length > 0 ? aiRecommendations : fallbackRecommendations;
  }, [aiRecommendations, fallbackRecommendations]);

  return (
    <UserInputContext.Provider value={{
      inputs,
      updateInputs,
      resetInputs,
      farm,
      recommendations: mergedRecommendations,
      activeCropCycle,
      cropRisk,
      loadingAi,
      refreshAiPredictions
    }}>
      {children}
    </UserInputContext.Provider>
  );
}

export function useUserInput() {
  const context = useContext(UserInputContext);
  if (!context) {
    throw new Error("useUserInput must be used within a UserInputProvider");
  }
  return context;
}

