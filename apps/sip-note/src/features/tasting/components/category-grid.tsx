import type { TastingCategory } from "@/db/schema";

import { Pressable, Text, View } from "react-native";
import { CategoryGlyph } from "@/components/ui-domain";
import i18n from "@/i18n";

const CATEGORIES: TastingCategory[] = [
  "whiskey",
  "wine",
  "beer",
  "sake",
  "cocktail",
  "etc",
];

export type CategoryGridProps = {
  value: TastingCategory | null;
  onChange: (next: TastingCategory) => void;
};

export function CategoryGrid({ value, onChange }: CategoryGridProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const active = value === c;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            className={
              active
                ? "h-20 w-[31.5%] items-center justify-center gap-1 rounded-md border border-brand bg-brand-soft"
                : "h-20 w-[31.5%] items-center justify-center gap-1 rounded-md border border-border-subtle bg-surface"
            }
            key={c}
            onPress={() => onChange(c)}
          >
            <CategoryGlyph category={c} size={28} />
            <Text
              className={
                active
                  ? "font-medium font-text text-brand text-caption"
                  : "font-medium font-text text-caption text-text-muted"
              }
            >
              {i18n.t(`category.${c}` as const)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
