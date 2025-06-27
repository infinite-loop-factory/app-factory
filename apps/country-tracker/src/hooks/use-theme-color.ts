import { themeAtom } from "@/atoms/theme.atom";
import { TOKENS } from "@/constants/color-tokens";
import { useAtomValue } from "jotai";

type ColorToken = keyof typeof TOKENS.light;
type ColorTokenName = ColorToken extends `--color-${infer R}` ? R : never;

export function useThemeColor(colorName: ColorTokenName): string;
export function useThemeColor(colorNames: ColorTokenName[]): string[];
export function useThemeColor(
  colorNames: ColorTokenName | ColorTokenName[],
): string | string[] {
  const savedTheme = useAtomValue(themeAtom);

  if (Array.isArray(colorNames)) {
    return colorNames.map((name) => {
      const tokenKey = `--color-${name}` as ColorToken;
      return TOKENS[savedTheme][tokenKey];
    });
  }

  const tokenKey = `--color-${colorNames}` as ColorToken;
  return TOKENS[savedTheme][tokenKey];
}
