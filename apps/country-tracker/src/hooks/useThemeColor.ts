import { themeAtom } from "@/atoms/theme.atom";
import { TOKENS } from "@/constants/color-tokens";
import { useAtomValue } from "jotai";

type ColorToken = keyof typeof TOKENS.light;
type ColorTokenName = ColorToken extends `--color-${infer R}` ? R : never;

export function useThemeColor(colorName: ColorTokenName): string {
  const savedTheme = useAtomValue(themeAtom);

  const tokenKey = `--color-${colorName}` as ColorToken;
  return TOKENS[savedTheme][tokenKey];
}
