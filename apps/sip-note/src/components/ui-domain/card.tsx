import type { TastingCategory } from "@/db/schema";

import { Image, Pressable, Text, View } from "react-native";
import i18n from "@/i18n";
import { CategoryGlyph } from "./category-glyph";
import { ScoreStars } from "./score-stars";

export type CardProps = {
  photoUri?: string | null;
  name: string;
  category: TastingCategory;
  placeName?: string | null;
  tags?: string[];
  score?: number | null;
  onPress?: () => void;
};

export function Card({
  photoUri,
  name,
  category,
  placeName,
  tags = [],
  score,
  onPress,
}: CardProps) {
  const categoryLabel = i18n.t(`category.${category}` as const);

  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row gap-3 rounded-lg border border-border-subtle bg-surface p-4 active:opacity-80"
      onPress={onPress}
    >
      <View className="h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-md bg-surface-sunken">
        {photoUri ? (
          <Image className="h-full w-full" source={{ uri: photoUri }} />
        ) : (
          <CategoryGlyph category={category} size={32} />
        )}
      </View>

      <View className="min-w-0 flex-1 gap-1">
        <Text
          className="font-semibold font-text text-h3 text-text"
          numberOfLines={1}
        >
          {name}
        </Text>

        <View className="flex-row items-center gap-1">
          <View
            className="h-1.5 w-1.5 rounded-pill"
            style={{
              backgroundColor: `rgb(var(--color-cat-${category}))`,
            }}
          />
          <Text
            className="font-text text-caption text-text-subtle"
            numberOfLines={1}
          >
            {categoryLabel}
            {placeName ? ` · ${placeName}` : ""}
          </Text>
        </View>

        {tags.length > 0 && (
          <View className="mt-0.5 flex-row flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => (
              <View
                className="rounded-pill bg-surface-sunken px-2 py-0.5"
                key={t}
              >
                <Text className="font-text text-overline text-text-muted">
                  #{t}
                </Text>
              </View>
            ))}
          </View>
        )}

        {score != null && (
          <View className="mt-1 flex-row items-center justify-between">
            <ScoreStars score={score} size={14} />
            <Text className="font-display font-semibold text-brand text-h3">
              {score.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
