import type { FavoriteRoute } from "@/types/station";

import { useRouter } from "expo-router";
import { Heart, Navigation, Star, Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/empty-state";
import { LineBadge } from "@/components/ui/line-badge";
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
  return date.toLocaleDateString("ko-KR");
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
      router.navigate("/(tabs)");
    },
    [setStartStation, setEndStation, setViaStation, router],
  );

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
      >
        {/* Header */}
        <View className="mb-6">
          <View className="mb-2 flex-row items-center gap-3">
            <Heart color="#EF4444" fill="#EF4444" size={32} />
            <Text className="font-medium text-2xl text-gray-900">
              {i18n.t("tabs.favorites")}
            </Text>
          </View>
          <Text className="text-base text-gray-600">
            {i18n.t("favorites.description")}
          </Text>
        </View>

        {routes.length > 0 ? (
          <View className="gap-3">
            {routes.map((route) => (
              <View
                className="overflow-hidden rounded-2xl bg-white"
                key={route.id}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <View className="p-5">
                  {/* Route info */}
                  <View className="mb-3 flex-row items-start justify-between">
                    <View className="flex-1">
                      <View className="mb-2 flex-row items-center gap-2">
                        <Text className="text-gray-900 text-lg">
                          {route.startStation.name}
                        </Text>
                        <LineBadge
                          color={route.startStation.lineColor}
                          line={route.startStation.line}
                        />
                      </View>

                      {route.viaStation && (
                        <View className="mb-2 flex-row items-center gap-2 pl-4">
                          <View className="h-2 w-2 rounded-full bg-gray-400" />
                          <Text className="text-gray-600 text-sm">
                            {route.viaStation.name}
                          </Text>
                          <LineBadge
                            color={route.viaStation.lineColor}
                            line={route.viaStation.line}
                          />
                        </View>
                      )}

                      <View className="flex-row items-center gap-2">
                        <Navigation color="#EF4444" size={16} />
                        <Text className="text-gray-900 text-lg">
                          {route.endStation.name}
                        </Text>
                        <LineBadge
                          color={route.endStation.lineColor}
                          line={route.endStation.line}
                        />
                      </View>
                    </View>
                    <Star color="#EAB308" fill="#EAB308" size={20} />
                  </View>

                  {/* Last searched */}
                  <Text className="mb-4 text-gray-500 text-xs">
                    {i18n.t("favorites.lastSearched")}:{" "}
                    {formatDate(route.lastSearched)}
                  </Text>

                  {/* Action buttons */}
                  <View className="flex-row gap-2">
                    <Pressable
                      className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 active:bg-blue-700"
                      onPress={() => handleSearch(route)}
                    >
                      <Navigation color="#FFFFFF" size={16} />
                      <Text className="font-medium text-white">
                        {i18n.t("favorites.searchAgain")}
                      </Text>
                    </Pressable>
                    <Pressable
                      className="rounded-xl bg-gray-100 px-4 py-2.5 active:bg-red-50"
                      onPress={() => handleRemove(route.id)}
                    >
                      <Trash2 color="#6B7280" size={16} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            actionLabel={i18n.t("favorites.searchRoutes")}
            description={i18n.t("favorites.emptyDescription")}
            icon={<Heart color="#9CA3AF" size={40} />}
            onAction={() => router.navigate("/(tabs)")}
            title={i18n.t("favorites.emptyTitle")}
          />
        )}
      </ScrollView>
    </View>
  );
}
