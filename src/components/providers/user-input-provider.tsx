"use client";

import { createContext, useContext, useEffect, useMemo, useState, startTransition } from "react";
import { useAuth } from "@/components/providers/auth-provider";
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
  const { user } = useAuth();
  const userId = user?.id || "guest";
  const storageKey = `agririsk_inputs_${userId}`;

  const [inputs, setInputs] = useState<CustomUserInputs>(() => {
    return {
      ...defaultUserInputs,
      farmName: user?.email ? `${user.email.split("@")[0]}'s Farm` : defaultUserInputs.farmName
    };
  });

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
  const recommendations = useMemo(() => calculateDynamicCropRecommendations(inputs), [inputs]);
  const activeCropCycle = useMemo(() => getDynamicCropCycle(inputs), [inputs]);
  const cropRisk = useMemo(() => getDynamicCropRisk(inputs), [inputs]);

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
