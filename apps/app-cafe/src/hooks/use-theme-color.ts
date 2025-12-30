import { COLORS } from "@/constants/colors";
import { useThemeStore } from "@/hooks/use-theme";

export function useThemeColor(
  colorName: keyof typeof COLORS.light & keyof typeof COLORS.dark,
) {
  const mode = useThemeStore((state) => state.mode);
  return COLORS[mode][colorName];
}
