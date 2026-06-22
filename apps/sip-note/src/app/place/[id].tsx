import type { Place } from "@/features/place/repo/types";
import type { TastingNote } from "@/features/tasting/repo/types";

import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlaceCategoryChip } from "@/features/place/components/place-category-chip";
import { PlaceDetailHero } from "@/features/place/components/place-detail-hero";
import * as placeRepo from "@/features/place/repo/place-repo";
import * as tastingRepo from "@/features/tasting/repo/tasting-note-repo";
import { useThemeColors } from "@/hooks/use-theme-colors";
import i18n from "@/i18n";
import { haptic } from "@/lib/haptics";
import {
  enableWishlistGeofencing,
  syncGeofences,
} from "@/services/location/geofence";

export default function PlaceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [notes, setNotes] = useState<TastingNote[]>([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      let alive = true;
      Promise.all([placeRepo.get(id), tastingRepo.list({ placeId: id })]).then(
        ([p, ns]) => {
          if (!alive) return;
          setPlace(p);
          setNotes(ns);
          setLoaded(true);
        },
      );
      return () => {
        alive = false;
      };
    }, [id]),
  );

  const handleToggleWishlist = async () => {
    if (!place) return;
    haptic.selection();
    const next = await placeRepo.toggleWishlist(place.id);
    setPlace(next);
    // 위시리스트에 추가하는 순간 지오펜싱 권한을 요청(자연스러운 컨텍스트)하고,
    // 제거 시에는 권한 요청 없이 모니터링 region 만 갱신한다.
    if (next.isWishlist) {
      await enableWishlistGeofencing();
    } else {
      await syncGeofences();
    }
  };

  const handleAddNote = () => {
    if (!place) return;
    haptic.selection();
    router.push(`/note/compose?placeId=${place.id}`);
  };

  if (!loaded) return null;

  if (!place) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-bg"
        edges={["top"]}
      >
        <Text className="font-text text-body text-text-muted">
          {i18n.t("place.detail.notFound")}
        </Text>
        <Pressable
          accessibilityRole="button"
          className="mt-4"
          onPress={() => router.back()}
        >
          <Text className="font-text text-body text-brand">
            {i18n.t("common.back")}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="pb-12">
        <PlaceDetailHero
          category={place.category ?? undefined}
          visitCount={place.visitCount}
        >
          <PlaceDetailHeader
            isWishlist={place.isWishlist}
            onBack={() => router.back()}
            onToggleWishlist={handleToggleWishlist}
          />
        </PlaceDetailHero>

        <View className="px-4 pt-4">
          {place.category && <PlaceCategoryChip category={place.category} />}
          <Text className="mt-2 font-display font-semibold text-h1 text-text">
            {place.name}
          </Text>
          {place.address && (
            <Text className="mt-1 font-text text-bodySm text-text-muted">
              {place.address}
            </Text>
          )}

          <View className="mt-6 mb-3">
            <Text className="font-semibold font-text text-overline text-text-subtle tracking-wider">
              {i18n.t("place.detail.notes").toUpperCase()}
            </Text>
          </View>

          {notes.length === 0 ? (
            <View className="items-center rounded-md border border-border-subtle p-6">
              <Text className="mb-3 font-text text-body text-text-muted">
                {i18n.t("place.detail.empty")}
              </Text>
              <Pressable
                accessibilityRole="button"
                className="h-11 items-center justify-center rounded-md bg-brand px-4 active:opacity-80"
                onPress={handleAddNote}
              >
                <Text className="font-medium font-text text-body text-text-onBrand">
                  {i18n.t("place.detail.addNote")}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="gap-2">
              {notes.map((n) => (
                <Pressable
                  accessibilityRole="button"
                  className="flex-row items-baseline gap-2 border-border-subtle border-b py-3 active:opacity-70"
                  key={n.id}
                  onPress={() => router.push(`/note/${n.id}`)}
                >
                  <Text className="flex-1 font-medium font-text text-body text-text">
                    {n.name}
                  </Text>
                  <Text className="font-text text-caption text-text-muted">
                    {i18n.t(`category.${n.category}` as const)}
                    {n.score != null ? ` · ★ ${n.score}` : ""}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                accessibilityRole="button"
                className="mt-2 h-11 items-center justify-center rounded-md border border-brand active:opacity-70"
                onPress={handleAddNote}
              >
                <Text className="font-medium font-text text-body text-brand">
                  + {i18n.t("place.detail.addNote")}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

type PlaceDetailHeaderProps = {
  isWishlist: boolean;
  onBack: () => void;
  onToggleWishlist: () => void;
};

function PlaceDetailHeader({
  isWishlist,
  onBack,
  onToggleWishlist,
}: PlaceDetailHeaderProps) {
  const colors = useThemeColors();
  return (
    <SafeAreaView className="absolute inset-x-0 top-0" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          accessibilityLabel={i18n.t("common.back")}
          accessibilityRole="button"
          className="h-9 w-9 items-center justify-center rounded-pill"
          hitSlop={12}
          onPress={onBack}
          style={{ backgroundColor: colors.overlay }}
        >
          <Text className="font-text text-body text-text">←</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={
            isWishlist
              ? i18n.t("place.detail.wishlistRemove")
              : i18n.t("place.detail.wishlistAdd")
          }
          accessibilityRole="button"
          className="h-9 w-9 items-center justify-center rounded-pill"
          hitSlop={12}
          onPress={onToggleWishlist}
          style={{ backgroundColor: colors.overlay }}
        >
          <Text
            className={
              isWishlist
                ? "font-text text-brand text-h3"
                : "font-text text-h3 text-text"
            }
          >
            {isWishlist ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
