import type { ReactNode } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: "primary" | "plain";
}

const GRADIENT_COLORS = {
  primary: ["#EFF6FF", "#E0E7FF"] as const, // blue-50 → indigo-100
  plain: ["#F9FAFB", "#F3F4F6"] as const, // gray-50 → gray-100
};

export function GradientBackground({
  children,
  variant = "primary",
}: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={[...GRADIENT_COLORS[variant]]}
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
