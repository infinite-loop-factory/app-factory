import type { PlaceSummarySheetRef } from "@/components/place-summary-sheet";
import type { Place, PlaceCategory } from "@/features/place/repo/types";

import { useFocusEffect, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlaceSummarySheet } from "@/components/place-summary-sheet";
import { MapPin } from "@/features/place/components/map-pin";
import * as placeRepo from "@/features/place/repo/place-repo";
import i18n from "@/i18n";
import { haptic } from "@/lib/haptics";
import { getCurrentPosition } from "@/services/location";

const DEFAULT_REGION = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const CATEGORIES: PlaceCategory[] = [
  "bar",
  "distillery",
  "winery",
  "brewery",
  "restaurant",
  "etc",
];

export default function MapScreen() {
  const router = useRouter();
  const sheetRef = useRef<PlaceSummarySheetRef>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [category, setCategory] = useState<PlaceCategory | null>(null);
  const [showWishlist, setShowWishlist] = useState(false);

  useEffect(() => {
    let alive = true;
    getCurrentPosition().then((pos) => {
      if (!(alive && pos)) return;
      setRegion({
        latitude: pos.latitude,
        longitude: pos.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      const filter: { category?: PlaceCategory; isWishlist?: boolean } = {};
      if (category) filter.category = category;
      if (showWishlist) filter.isWishlist = true;
      placeRepo.list(filter).then((list) => {
        if (alive) setPlaces(list);
      });
      return () => {
        alive = false;
      };
    }, [category, showWishlist]),
  );

  const pinned = places.filter(
    (p) => p.latitude != null && p.longitude != null,
  );

  return (
    <View className="flex-1 bg-bg">
      <MapView initialRegion={region} showsUserLocation style={{ flex: 1 }}>
        {pinned.map((p) => (
          <Marker
            coordinate={{
              latitude: p.latitude as number,
              longitude: p.longitude as number,
            }}
            key={p.id}
            onPress={() => {
              haptic.selection();
              sheetRef.current?.present(p.id);
            }}
          >
            <MapPin category={p.category} isWishlist={p.isWishlist} />
          </Marker>
        ))}
      </MapView>

      <SafeAreaView className="absolute inset-x-0 top-0" edges={["top"]}>
        <ScrollView
          contentContainerClassName="gap-2 px-4 py-3"
          horizontal
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
        >
          <FilterChip
            active={category === null && !showWishlist}
            label={i18n.t("place.map.filterAll")}
            onPress={() => {
              setCategory(null);
              setShowWishlist(false);
            }}
          />
          <FilterChip
            active={showWishlist}
            label={i18n.t("place.wishlist.title")}
            onPress={() => {
              haptic.selection();
              setShowWishlist((s) => !s);
            }}
          />
          {CATEGORIES.map((c) => (
            <FilterChip
              active={category === c}
              key={c}
              label={i18n.t(`placeCategory.${c}` as const)}
              onPress={() => {
                haptic.selection();
                setCategory((cur) => (cur === c ? null : c));
              }}
            />
          ))}
        </ScrollView>
      </SafeAreaView>

      {pinned.length === 0 && (
        <View className="absolute right-4 bottom-12 left-4 rounded-md bg-surface p-4">
          <Text className="font-medium font-text text-body text-text">
            {i18n.t("empty.map.title")}
          </Text>
          <Text className="mt-1 font-text text-caption text-text-muted">
            {i18n.t("empty.map.body")}
          </Text>
        </View>
      )}

      <PlaceSummarySheet
        onViewDetail={(id) => router.push(`/place/${id}`)}
        ref={sheetRef}
      />
    </View>
  );
}

type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function FilterChip({ label, active, onPress }: FilterChipProps) {
  // caption text-brand light 4.18:1 → brand-strong 6.89:1 swap (Phase 1 §6).
  const { colorScheme } = useColorScheme();
  const activeText =
    colorScheme === "light" ? "text-brand-strong" : "text-brand";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={
        active
          ? "h-9 items-center justify-center rounded-pill border border-brand bg-brand-soft px-3"
          : "h-9 items-center justify-center rounded-pill border border-border-subtle bg-surface px-3"
      }
      onPress={onPress}
    >
      <Text
        className={
          active
            ? `font-medium font-text text-caption ${activeText}`
            : "font-text text-caption text-text-muted"
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
