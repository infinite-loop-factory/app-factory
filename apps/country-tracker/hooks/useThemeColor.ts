/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "nativewind";

import { COLORS } from "@/constants/colors";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof COLORS.light & keyof typeof COLORS.dark,
) {
  const { colorScheme = "light" } = useColorScheme();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return COLORS[colorScheme][colorName];
}
