import { themeAtom } from "@/atoms/theme.atom";
import { COLORS } from "@/constants/colors";
import { useAtomValue } from "jotai";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof COLORS.light & keyof typeof COLORS.dark,
) {
  const savedTheme = useAtomValue(themeAtom);
  const colorFromProps = props[savedTheme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return COLORS[savedTheme][colorName];
}
