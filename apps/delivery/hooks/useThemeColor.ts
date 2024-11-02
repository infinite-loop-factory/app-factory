import { useCustomColorScheme } from "@/components/ui/ColorSchemeProvider";
import * as schema from "@/components/ui/design-token/_index";
import type { defaultSchemaType } from "@/components/ui/design-token/light.schema";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const { colorScheme = "light" } = useColorScheme();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[colorScheme][colorName];
}

type CleanColorToken<T> = keyof T extends `--color-${infer V}` ? V : never;
type KebabToCamel<S extends string> = S extends `${infer T}-${infer U}`
  ? `${T}${Capitalize<KebabToCamel<U>>}`
  : S;

export function useColorToken<
  T extends Partial<
    Record<KebabToCamel<CleanColorToken<defaultSchemaType["token"]>>, boolean>
  >,
>(token: T): Record<keyof T, string> {
  const { colorScheme } = useCustomColorScheme();

  if (!colorScheme) throw new Error("Color scheme not available");

  const camelToKebab = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/([a-zA-Z])([0-9])/g, "$1-$2")
      .toLowerCase();
  };

  return Object.fromEntries(
    Object.keys(token)
      .filter((key) => token[key as keyof T])
      .map((key) => [
        key,
        schema[`${colorScheme}Schema`].token[
          `--color-${camelToKebab(key)}` as keyof defaultSchemaType["token"]
        ],
      ]),
  ) as Record<keyof T, string>;
}
