import type { TastingCategory } from "@/db/schema";

import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import i18n from "@/i18n";
import { haptic } from "@/lib/haptics";

const CATEGORIES: TastingCategory[] = [
  "whiskey",
  "wine",
  "beer",
  "sake",
  "cocktail",
  "etc",
];

export type FilterBarProps = {
  query: string;
  onQueryChange: (next: string) => void;
  category: TastingCategory | undefined;
  onCategoryChange: (next: TastingCategory | undefined) => void;
};

export function FilterBar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <View>
      <View className="mx-6 flex-row items-center gap-2 rounded-pill border border-border-subtle bg-surface-sunken px-4 py-2">
        <Svg fill="none" height={14} viewBox="0 0 24 24" width={14}>
          <Path
            d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"
            stroke="rgb(var(--color-text-subtle))"
            strokeWidth={2}
          />
          <Path
            d="m20 20-3.5-3.5"
            stroke="rgb(var(--color-text-subtle))"
            strokeLinecap="round"
            strokeWidth={2}
          />
        </Svg>
        <TextInput
          accessibilityLabel={i18n.t("common.search")}
          className="flex-1 font-text text-bodySm text-text"
          onChangeText={onQueryChange}
          placeholder={i18n.t("tasting.feed.searchPlaceholder")}
          placeholderTextColor="rgb(var(--color-text-faint))"
          returnKeyType="search"
          value={query}
        />
      </View>

      <ScrollView
        className="mt-3"
        contentContainerClassName="px-6 gap-2"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <Chip
          active={category === undefined}
          dotColor="rgb(var(--color-brand))"
          label={i18n.t("tasting.feed.filterAll")}
          onPress={() => {
            haptic.selection();
            onCategoryChange(undefined);
          }}
        />
        {CATEGORIES.map((c) => (
          <Chip
            active={category === c}
            dotColor={`rgb(var(--color-cat-${c}))`}
            key={c}
            label={i18n.t(`category.${c}` as const)}
            onPress={() => {
              haptic.selection();
              onCategoryChange(category === c ? undefined : c);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type ChipProps = {
  label: string;
  dotColor: string;
  active: boolean;
  onPress: () => void;
};

function Chip({ label, dotColor, active, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={
        active
          ? "h-7 flex-row items-center gap-1.5 rounded-pill border border-brand bg-brand-soft px-3"
          : "h-7 flex-row items-center gap-1.5 rounded-pill border border-border-subtle bg-surface px-3"
      }
      onPress={onPress}
    >
      <View
        className="h-1.5 w-1.5 rounded-pill"
        style={{ backgroundColor: dotColor }}
      />
      <Text
        className={
          active
            ? "font-medium font-text text-brand text-caption"
            : "font-medium font-text text-caption text-text-muted"
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
