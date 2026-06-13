import type { PlaceCategory } from "@/features/place/repo/types";

import { Text, View } from "react-native";
import i18n from "@/i18n";

const DOT: Record<PlaceCategory, string> = {
  bar: "bg-place-bar",
  distillery: "bg-place-distillery",
  winery: "bg-place-winery",
  brewery: "bg-place-brewery",
  restaurant: "bg-place-restaurant",
  etc: "bg-place-etc",
};

export type PlaceCategoryChipProps = {
  category: PlaceCategory;
};

/**
 * Place category indicator: surface-sunken pill + place.* dot + label.
 * 안티패턴 회피 — chip 텍스트는 text-muted (place.* 위 직접 텍스트는
 * worst-case 4.5:1 미달 가능). 색 정체성은 좌측 dot 으로 부여.
 */
export function PlaceCategoryChip({ category }: PlaceCategoryChipProps) {
  return (
    <View className="flex-row items-center gap-1.5 self-start rounded-pill bg-surface-sunken px-2 py-0.5">
      <View className={`h-1.5 w-1.5 rounded-pill ${DOT[category]}`} />
      <Text className="font-text text-caption text-text-muted">
        {i18n.t(`placeCategory.${category}` as const)}
      </Text>
    </View>
  );
}
