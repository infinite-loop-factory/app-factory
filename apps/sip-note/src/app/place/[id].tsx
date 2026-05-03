import type { Place } from "@/features/place/repo/types";
import type { TastingNote } from "@/features/tasting/repo/types";

import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as placeRepo from "@/features/place/repo/place-repo";
import * as tastingRepo from "@/features/tasting/repo/tasting-note-repo";
import i18n from "@/i18n";
import { haptic } from "@/lib/haptics";

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
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          accessibilityLabel={i18n.t("common.back")}
          accessibilityRole="button"
          className="h-9 w-9 items-center justify-center rounded-pill border border-border-subtle bg-surface"
          hitSlop={12}
          onPress={() => router.back()}
        >
          <Text className="font-text text-body text-text">←</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={
            place.isWishlist
              ? i18n.t("place.detail.wishlistRemove")
              : i18n.t("place.detail.wishlistAdd")
          }
          accessibilityRole="button"
          className="h-9 w-9 items-center justify-center rounded-pill border border-border-subtle bg-surface"
          hitSlop={12}
          onPress={handleToggleWishlist}
        >
          <Text
            className={
              place.isWishlist
                ? "font-text text-brand text-h3"
                : "font-text text-h3 text-text-muted"
            }
          >
            {place.isWishlist ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="px-4 pb-12">
        {place.category && (
          <View className="flex-row">
            <View className="rounded-pill bg-surface-sunken px-2 py-0.5">
              <Text className="font-text text-caption text-text-muted">
                {i18n.t(`placeCategory.${place.category}` as const)}
              </Text>
            </View>
          </View>
        )}
        <Text className="mt-2 font-display font-semibold text-h1 text-text">
          {place.name}
        </Text>
        {place.address && (
          <Text className="mt-1 font-text text-bodySm text-text-muted">
            {place.address}
          </Text>
        )}
        <Text className="mt-2 font-text text-caption text-text-muted">
          {i18n.t("place.detail.visitCount", { count: place.visitCount })}
        </Text>

        <View className="mt-6 mb-3">
          <Text className="font-semibold font-text text-overline text-text-subtle tracking-wider">
            {i18n.t("place.detail.notes").toUpperCase()}
          </Text>
        </View>

        {notes.length === 0 ? (
          <View className="items-center rounded-md border border-border-subtle bg-surface-sunken p-6">
            <Text className="mb-3 font-text text-body text-text-muted">
              {i18n.t("place.detail.empty")}
            </Text>
            <Pressable
              accessibilityRole="button"
              className="h-11 items-center justify-center rounded-md bg-brand px-4"
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
                className="rounded-md border border-border-subtle bg-surface-sunken p-3"
                key={n.id}
                onPress={() => router.push(`/note/${n.id}`)}
              >
                <Text className="font-medium font-text text-body text-text">
                  {n.name}
                </Text>
                <Text className="mt-0.5 font-text text-caption text-text-muted">
                  {i18n.t(`category.${n.category}` as const)}
                  {n.score != null ? ` · ★ ${n.score}` : ""}
                </Text>
              </Pressable>
            ))}
            <Pressable
              accessibilityRole="button"
              className="mt-2 h-11 items-center justify-center rounded-md border border-brand"
              onPress={handleAddNote}
            >
              <Text className="font-medium font-text text-body text-brand">
                + {i18n.t("place.detail.addNote")}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
