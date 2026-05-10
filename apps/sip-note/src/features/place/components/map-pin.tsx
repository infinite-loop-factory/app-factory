import type { PlaceCategory } from "@/features/place/repo/types";

import { View } from "react-native";
import { GlassVessel } from "@/components/ui-domain/glass-vessel";

const FILL: Record<PlaceCategory, string> = {
  bar: "bg-place-bar",
  distillery: "bg-place-distillery",
  winery: "bg-place-winery",
  brewery: "bg-place-brewery",
  restaurant: "bg-place-restaurant",
  etc: "bg-place-etc",
};

const RING: Record<PlaceCategory, string> = {
  bar: "border-place-bar",
  distillery: "border-place-distillery",
  winery: "border-place-winery",
  brewery: "border-place-brewery",
  restaurant: "border-place-restaurant",
  etc: "border-place-etc",
};

export type MapPinProps = {
  category: PlaceCategory | null;
  isWishlist: boolean;
};

/**
 * Map pin — Phase 2 signature: 잔 글리프 미니 (visited) / 빈 핀 + dot (wishlist).
 * visited: place.* 채움 + 1px bg outline + 중앙 GlassVessel (Phase 1 시그니처 연장).
 * wishlist: bg 표면 + place.* 2px outline + 중앙 dot.
 */
export function MapPin({ category, isWishlist }: MapPinProps) {
  const c = category ?? "etc";

  if (isWishlist) {
    return (
      <View
        className={`h-7 w-7 items-center justify-center rounded-pill border-2 bg-bg ${RING[c]}`}
      >
        <View className={`h-2 w-2 rounded-pill ${FILL[c]}`} />
      </View>
    );
  }

  return (
    <View
      className={`h-7 w-7 items-center justify-center rounded-pill border border-bg ${FILL[c]}`}
    >
      <GlassVessel animate={false} fill={1} size={12} />
    </View>
  );
}
