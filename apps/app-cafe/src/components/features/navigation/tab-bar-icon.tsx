import type { ViewStyle } from "react-native";

import { useMemo } from "react";
import { TAB_BAR_ICON } from "@/constants/tab-bar.ts";
import { useThemeStore } from "@/hooks/use-theme";

export function TabBarIcon({
  name,
  color,
  focused,
  size = 24,
  style,
}: {
  name: keyof typeof TAB_BAR_ICON;
  color?: string;
  size?: number;
  style?: ViewStyle;
  focused: boolean;
}) {
  const { isDark, isTabBarRetro } = useThemeStore();

  const iconStyle = useMemo(() => {
    return isDark && isTabBarRetro
      ? {
          shadowColor: "#FFFFFF",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 15,
          elevation: 10,
        }
      : undefined;
  }, [isDark, isTabBarRetro]);

  const Component = TAB_BAR_ICON[name][focused ? "focused" : "basic"];
  return (
    <Component color={color} size={size} style={{ ...iconStyle, ...style }} />
  );
}
