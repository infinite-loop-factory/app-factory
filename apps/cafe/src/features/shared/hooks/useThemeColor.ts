import type { CamelCase } from "type-fest";
import type { defaultSchemaType } from "@/components/ui/design-token/light.schema";

import { kebabCase } from "es-toolkit";
import { darkSchema, lightSchema } from "@/components/ui/design-token/_index";
import { Colors } from "@/features/shared/constants/Colors";
import { useColorSchemaStore } from "@/features/shared/store/colorScheme.store";

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

  const schemaMap = { dark: darkSchema, light: lightSchema };
  const currentSchema = schemaMap[colorScheme];

  return Object.fromEntries(
    Object.keys(token)
      .filter((key) => token[key as keyof T])
      .map((key) => [
        key,
        currentSchema.token[
          `--color-${kebabCase(key)}` as keyof defaultSchemaType["token"]
        ],
      ]),
  ) as Record<keyof T, string>;
}
