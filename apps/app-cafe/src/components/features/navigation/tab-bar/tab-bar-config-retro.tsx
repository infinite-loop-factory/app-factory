import type { ThemeType } from "@/hooks/use-theme";

import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";

export const retroTabBarConfig = ({ mode }: { mode: ThemeType }) => {
  const isDark = mode === "dark";

  return {
    tabBarShowLabel: false,
    tabBarActiveBackgroundColor: "transparent",
    tabBarInactiveBackgroundColor: "transparent",

    tabBarActiveTintColor: isDark
      ? "rgba(255, 255, 255, 0.9)"
      : "rgba(255, 255, 255, 1)",

    tabBarBackground: () => (
      <View style={{ flex: 1, borderRadius: 20, overflow: "hidden" }}>
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={Platform.OS === "android" ? 3 : 30}
          style={StyleSheet.absoluteFill}
          tint={isDark ? "dark" : "light"}
        />

        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? "rgba(28, 26, 23, 0.6)"
                : "rgba(80, 59, 50, 0.6)",
            },
          ]}
        />
      </View>
    ),

    tabBarInactiveTintColor: isDark ? "rgba(255, 255, 255, 0.4)" : "#8E8E93",

    tabBarStyle: {
      // ✅ [핵심 수정] 여기는 무조건 투명이어야 아이콘과 충돌 안 함
      backgroundColor: "transparent",
      position: "absolute" as const,
      bottom: 20,
      height: 60,
      borderRadius: 20,

      borderWidth: isDark ? 0 : 1,
      borderTopWidth: isDark ? 0 : 1, // 상단 선 제거 (깔끔하게)
      borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",

      // ✅ [중요] Android에서 블러가 튀어나오는 문제 방지 (그림자 제거)
      elevation: 0,

      // iOS 그림자 (iOS는 문제 없음)
      shadowColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#000",
      shadowOffset: { width: 0, height: isDark ? 0 : 2 },
      shadowOpacity: isDark ? 0.04 : 0.03,
      shadowRadius: 20,
      marginHorizontal: 30,
      paddingHorizontal: 0,
      paddingBottom: 0,
      paddingTop: 0,
    },
    tabBarItemStyle: {
      height: 70,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    tabBarIconStyle: {
      marginBottom: 0,
      marginTop: 0,
      top: 10,
    },
  };
};
