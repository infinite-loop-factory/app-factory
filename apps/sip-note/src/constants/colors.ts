/**
 * Legacy `COLORS` map kept for Expo Router / `useThemeColor` consumers.
 * Values derive from semantic tokens in `@/design-system/theme`.
 */
import { darkColors, lightColors } from "@/design-system/theme";

export const COLORS = {
  light: {
    text: lightColors.text,
    background: lightColors.bg,
    tint: lightColors.brand,
    icon: lightColors.textSubtle,
    tabIconDefault: lightColors.textSubtle,
    tabIconSelected: lightColors.brand,
  },
  dark: {
    text: darkColors.text,
    background: darkColors.bg,
    tint: darkColors.brand,
    icon: darkColors.textSubtle,
    tabIconDefault: darkColors.textSubtle,
    tabIconSelected: darkColors.brand,
  },
};
