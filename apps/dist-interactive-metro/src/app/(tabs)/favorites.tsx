import type { FavoriteRoute } from "@/types/station";

import { useRouter } from "expo-router";
import {
  ArrowRight,
  Heart,
  Navigation,
  Star,
  Trash2,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/empty-state";
import { StationLineBadges } from "@/components/ui/station-line-badges";
import { useRouteSearch } from "@/context/route-search-context";
import { getFavoriteRoutes, removeFavoriteRoute } from "@/data/favorites";
import i18n from "@/i18n";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffInDays === 0) return i18n.t("favorites.today");
  if (diffInDays === 1) return i18n.t("favorites.yesterday");
  if (diffInDays < 7) return i18n.t("favorites.daysAgo", { count: diffInDays });
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export default function FavoritesTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setStartStation, setEndStation, setViaStation } = useRouteSearch();
  const [routes, setRoutes] = useState<FavoriteRoute[]>([]);

  const loadFavorites = useCallback(async () => {
    const favs = await getFavoriteRoutes();
    setRoutes(favs);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRemove = useCallback(
    async (id: string) => {
      await removeFavoriteRoute(id);
      loadFavorites();
    },
    [loadFavorites],
  );

  const handleSearch = useCallback(
    (route: FavoriteRoute) => {
      setStartStation(route.startStation);
      setEndStation(route.endStation);
      setViaStation(route.viaStation ?? null);
      router.push({
        pathname: "/route-result",
        params: {
          start: route.startStation.id,
          end: route.endStation.id,
          ...(route.viaStation && { via: route.viaStation.id }),
        },
      });
    },
    [setStartStation, setEndStation, setViaStation, router],
  );

  const renderItem = useCallback(
    ({ item: route }: { item: FavoriteRoute }) => (
      <View
        className="mb-4 overflow-hidden rounded-2xl bg-white dark:bg-gray-800"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Pressable
          className="p-5 active:bg-gray-50 dark:active:bg-gray-700/50"
          onPress={() => handleSearch(route)}
        >
          {/* Route Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 dark:bg-blue-900/30">
              <Star color="#2563EB" fill="#2563EB" size={12} />
              <Text className="font-bold text-[10px] text-blue-700 dark:text-blue-300">
                FAVORITE
              </Text>
            </View>
            <Text className="text-gray-400 text-xs">
              {i18n.t("favorites.lastSearched")}:{" "}
              {formatDate(route.lastSearched)}
            </Text>
          </View>

          {/* Timeline-style Route info */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 items-start">
              <Text
                className="mb-1 font-bold text-gray-900 text-lg dark:text-gray-100"
                numberOfLines={1}
              >
                {route.startStation.name}
              </Text>
              <StationLineBadges station={route.startStation} />
            </View>

            <View className="mx-4 items-center justify-center">
              <ArrowRight color="#D1D5DB" size={20} />
            </View>

            <View className="flex-1 items-end">
              <Text
                className="mb-1 font-bold text-gray-900 text-lg dark:text-gray-100"
                numberOfLines={1}
              >
                {route.endStation.name}
              </Text>
              <StationLineBadges station={route.endStation} />
            </View>
          </View>

          {route.viaStation && (
            <View className="mt-4 flex-row items-center justify-center gap-2 rounded-lg bg-gray-50 py-2 dark:bg-gray-900/50">
              <Text className="text-gray-400 text-xs">
                {i18n.t("stationSelect.viaShort")}:
              </Text>
              <Text className="font-semibold text-gray-700 text-sm dark:text-gray-300">
                {route.viaStation.name}
              </Text>
              <StationLineBadges size="sm" station={route.viaStation} />
            </View>
          )}

          {/* Action Buttons */}
          <View className="mt-5 flex-row gap-3">
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 shadow-sm active:bg-blue-700"
              onPress={() => handleSearch(route)}
            >
              <Navigation color="#FFFFFF" fill="white" size={16} />
              <Text className="font-bold text-white">
                {i18n.t("favorites.searchAgain")}
              </Text>
            </Pressable>
            <Pressable
              className="items-center justify-center rounded-xl bg-gray-100 px-4 py-3 active:bg-red-50 dark:bg-gray-700 dark:active:bg-red-900/20"
              onPress={() => handleRemove(route.id)}
            >
              <Trash2 color="#9CA3AF" size={18} />
            </Pressable>
          </View>
        </Pressable>
      </View>
    ),
    [handleRemove, handleSearch],
  );

  const ListHeader = useMemo(
    () => (
      <View className="mb-8">
        <View className="mb-2 flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-red-500 shadow-sm">
            <Heart color="white" fill="white" size={28} />
          </View>
          <View>
            <Text className="font-bold text-3xl text-gray-900 dark:text-gray-100">
              {i18n.t("tabs.favorites")}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              {i18n.t("favorites.description")}
            </Text>
          </View>
        </View>
      </View>
    ),
    [],
  );

  return (
    <View
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      style={{ paddingTop: insets.top + 16 }}
    >
      {routes.length > 0 ? (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}
          data={routes}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 px-5 py-6">
          {ListHeader}
          <EmptyState
            actionLabel={i18n.t("favorites.searchRoutes")}
            description={i18n.t("favorites.emptyDescription")}
            icon={<Heart color="#D1D5DB" size={64} />}
            onAction={() => router.navigate("/(tabs)/search")}
            title={i18n.t("favorites.emptyTitle")}
          />
        </View>
      )}
    </View>
  );
}
