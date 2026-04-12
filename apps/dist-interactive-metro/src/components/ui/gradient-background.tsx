import type { ReactNode } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { StyleSheet } from "react-native";

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: "primary" | "plain";
}

const LIGHT_GRADIENT = {
  primary: ["#EFF6FF", "#E0E7FF"] as const, // blue-50 → indigo-100
  plain: ["#F9FAFB", "#F3F4F6"] as const, // gray-50 → gray-100
};

const DARK_GRADIENT = {
  primary: ["#111827", "#1E1B4B"] as const, // gray-900 → indigo-950
  plain: ["#030712", "#111827"] as const, // gray-950 → gray-900
};

export function GradientBackground({
  children,
  variant = "primary",
}: GradientBackgroundProps) {
  const { colorScheme } = useColorScheme();
  const colors =
    colorScheme === "dark" ? DARK_GRADIENT[variant] : LIGHT_GRADIENT[variant];

  return (
    <LinearGradient
      colors={[...colors]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
