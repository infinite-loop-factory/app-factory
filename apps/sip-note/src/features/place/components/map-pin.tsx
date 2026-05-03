import type { PlaceCategory } from "@/features/place/repo/types";

import { View } from "react-native";

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

export function MapPin({ category, isWishlist }: MapPinProps) {
  const c = category ?? "etc";
  const visitedClass = `h-7 w-7 rounded-full border-2 border-bg ${FILL[c]}`;
  const wishlistClass = `h-7 w-7 rounded-full border-2 bg-bg ${RING[c]}`;
  return <View className={isWishlist ? wishlistClass : visitedClass} />;
}
