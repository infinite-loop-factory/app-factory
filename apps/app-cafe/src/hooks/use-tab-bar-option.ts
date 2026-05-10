import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

import { useMemo } from "react";
import { modernTabBarConfig } from "@/components/features/navigation/tab-bar/tab-bar-config-modern";
import { retroTabBarConfig } from "@/components/features/navigation/tab-bar/tab-bar-config-retro";
import { useThemeStore } from "@/hooks/use-theme";

export default function useTabBarOption(): BottomTabNavigationOptions {
  const { isTabBarRetro } = useThemeStore();
  const { mode } = useThemeStore();

  return useMemo(() => {
    return (isTabBarRetro ? retroTabBarConfig : modernTabBarConfig)({ mode });
  }, [isTabBarRetro, mode]);
}
