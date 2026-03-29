import type { UserSettings } from "@/types";

import { useCallback, useEffect, useState } from "react";
import { APP_CONFIG } from "@/constants/config";
import {
  clearUserSettings,
  getUserSettings,
  saveUserSettings,
} from "@/services/storage";

const DEFAULT_SETTINGS: UserSettings = {
  preferred_categories: ["한식", "중식", "일식", "양식"],
  min_rating: APP_CONFIG.DEFAULT_MIN_RATING,
  shake_sensitivity: APP_CONFIG.DEFAULT_SHAKE_THRESHOLD,
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드
  useEffect(() => {
    async function loadSettings() {
      try {
        const storedSettings = await getUserSettings();
        setSettings(storedSettings ?? DEFAULT_SETTINGS);
      } catch (error) {
        console.error("Failed to load settings:", error);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  // 설정 업데이트
  const updateSettings = useCallback(
    async (newSettings: Partial<UserSettings>) => {
      const updated = { ...settings, ...newSettings } as UserSettings;
      setSettings(updated);
      await saveUserSettings(updated);
    },
    [settings],
  );

  // 설정 초기화
  const resetSettings = useCallback(async () => {
    await clearUserSettings();
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
  };
}
