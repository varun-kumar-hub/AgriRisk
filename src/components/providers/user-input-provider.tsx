"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
}

const UserInputContext = createContext<UserInputContextType | null>(null);

export function UserInputProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useState<CustomUserInputs>(defaultUserInputs);

  useEffect(() => {
    const saved = localStorage.getItem("agririsk_custom_inputs");
    if (saved) {
      try {
        setInputs((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to parse saved inputs:", e);
      }
    }
  }, []);

  const updateInputs = (newInputs: Partial<CustomUserInputs>) => {
    setInputs((prev) => {
      const updated = { ...prev, ...newInputs };
      localStorage.setItem("agririsk_custom_inputs", JSON.stringify(updated));
      return updated;
    });
  };

  const resetInputs = () => {
    setInputs(defaultUserInputs);
    localStorage.removeItem("agririsk_custom_inputs");
  };

  const farm = getDynamicFarm(inputs);
  const recommendations = calculateDynamicCropRecommendations(inputs);
  const activeCropCycle = getDynamicCropCycle(inputs);
  const cropRisk = getDynamicCropRisk(inputs);

  return (
    <UserInputContext.Provider value={{ inputs, updateInputs, resetInputs, farm, recommendations, activeCropCycle, cropRisk }}>
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
