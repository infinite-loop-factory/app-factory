import * as schema from "@/components/ui/design-token/_index";
import type { defaultSchemaType } from "@/components/ui/design-token/light.schema";
import { Colors } from "@/features/shared/constants/Colors";
import { useColorSchemaStore } from "@/features/shared/store/colorScheme.store";
import { kebabCase } from "es-toolkit";
import type { CamelCase } from "type-fest";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const { colorScheme = "light" } = useColorSchemaStore();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[colorScheme][colorName];
}

type CleanColorToken<T> = keyof T extends `--color-${infer V}` ? V : never;

export function useColorToken<
  T extends Partial<
    Record<CamelCase<CleanColorToken<defaultSchemaType["token"]>>, boolean>
  >,
>(token: T): Record<keyof T, string> {
  const { colorScheme } = useColorSchemaStore();

  if (!colorScheme) throw new Error("Color scheme not available");

  return Object.fromEntries(
    Object.keys(token)
      .filter((key) => token[key as keyof T])
      .map((key) => [
        key,
        schema[`${colorScheme}Schema`].token[
          `--color-${kebabCase(key)}` as keyof defaultSchemaType["token"]
        ],
      ]),
  ) as Record<keyof T, string>;
}
