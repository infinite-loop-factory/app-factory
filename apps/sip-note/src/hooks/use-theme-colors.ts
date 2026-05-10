import { useColorScheme } from "nativewind";
import {
  type ColorTokens,
  darkColors,
  lightColors,
} from "@/design-system/theme";

/**
 * Concrete hex color map for the active theme.
 *
 * Use this in places where NativeWind className is unavailable —
 * SVG `stroke` / `fill`, `placeholderTextColor`, dynamic inline `style`.
 * For className-driven styling prefer the tailwind tokens (`text-brand` etc.).
 */
export function useThemeColors(): ColorTokens {
  const { colorScheme } = useColorScheme();
  return colorScheme === "light" ? lightColors : darkColors;
}

const HEX_RE = /^#?([0-9a-f]{6})$/i;

/** Add alpha to a hex string. Returns `rgba(r,g,b,a)`. */
export function withAlpha(hex: string, alpha: number): string {
  const m = HEX_RE.exec(hex);
  const v = m?.[1];
  if (!v) return hex;
  const r = Number.parseInt(v.slice(0, 2), 16);
  const g = Number.parseInt(v.slice(2, 4), 16);
  const b = Number.parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
