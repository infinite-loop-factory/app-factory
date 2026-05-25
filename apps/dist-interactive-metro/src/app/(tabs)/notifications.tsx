import type { UpcomingDeparture } from "@/hooks/use-station-timetable";
import type { FavoriteRoute } from "@/types/station";

import { useRouter } from "expo-router";
import { Bell, Clock, Navigation } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/empty-state";
import { StationLineBadges } from "@/components/ui/station-line-badges";
import { useRouteSearch } from "@/context/route-search-context";
import { getFavoriteRoutes } from "@/data/favorites";
import { useStationTimetable } from "@/hooks/use-station-timetable";
import i18n from "@/i18n";

interface DepartureContentProps {
  loading: boolean;
  departures: UpcomingDeparture[];
  lineColor: string;
}

function DepartureContent({
  loading,
  departures,
  lineColor,
}: DepartureContentProps) {
  if (loading) {
    return (
      <View className="flex-row items-center gap-2">
        <ActivityIndicator color={lineColor} size="small" />
        <Text className="text-gray-400 text-xs">
          {i18n.t("timetable.loading")}
        </Text>
      </View>
    );
  }
  if (departures.length === 0) {
    return (
      <Text className="text-gray-400 text-xs">
        {i18n.t("timetable.noUpcoming")}
      </Text>
    );
  }
  return (
    <View className="flex-row flex-wrap gap-2">
      {departures.map((dep) => (
        <View
          className="flex-row items-center gap-1 rounded-full px-3 py-1"
          key={dep.dptTime}
          style={{ backgroundColor: `${lineColor}18` }}
        >
          <Clock color={lineColor} size={11} />
          <Text className="font-medium text-xs" style={{ color: lineColor }}>
            {dep.dptTime}
          </Text>
          <Text className="text-xs opacity-70" style={{ color: lineColor }}>
            {dep.minutesFromNow === 0
              ? i18n.t("timetable.now")
              : `+${dep.minutesFromNow}분`}
          </Text>
        </View>
      ))}
    </View>
  );
}

interface FavoriteTrainCardProps {
  route: FavoriteRoute;
  onSearch: (route: FavoriteRoute) => void;
}

function FavoriteTrainCard({ route, onSearch }: FavoriteTrainCardProps) {
  const { departures, loading } = useStationTimetable(
    route.startStation.name,
    route.startStation.line,
    3,
    route.endStation.name,
  );
  const lineColor = route.startStation.lineColor;

  return (
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
      {/* Route header */}
      <View className="p-4 pb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-2">
            <View className="flex-1">
              <Text
                className="font-bold text-base text-gray-900 dark:text-gray-100"
                numberOfLines={1}
              >
                {route.startStation.name}
              </Text>
              <StationLineBadges size="sm" station={route.startStation} />
            </View>
            <Text className="text-gray-400 text-sm">→</Text>
            <View className="flex-1 items-end">
              <Text
                className="font-bold text-base text-gray-900 dark:text-gray-100"
                numberOfLines={1}
              >
                {route.endStation.name}
              </Text>
              <StationLineBadges size="sm" station={route.endStation} />
            </View>
          </View>
          <Pressable
            className="ml-3 flex-row items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 active:bg-blue-700"
            onPress={() => onSearch(route)}
          >
            <Navigation color="#FFFFFF" size={14} />
            <Text className="font-semibold text-white text-xs">
              {i18n.t("favorites.searchAgain")}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Departure strip */}
      <View className="border-gray-100 border-t px-4 py-3 dark:border-gray-700">
        <Text className="mb-2 text-gray-500 text-xs">
          {i18n.t("notifications.nextTrains")}
        </Text>
        <DepartureContent
          departures={departures}
          lineColor={lineColor}
          loading={loading}
        />
      </View>
    </View>
  );
}

export default function NotificationsTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setStartStation, setEndStation, setViaStation } = useRouteSearch();
  const [routes, setRoutes] = useState<FavoriteRoute[]>([]);

  const loadFavorites = useCallback(async () => {
    const favs = await getFavoriteRoutes();
    setRoutes(favs);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

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
    ({ item }: { item: FavoriteRoute }) => (
      <FavoriteTrainCard onSearch={handleSearch} route={item} />
    ),
    [handleSearch],
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
          ListHeaderComponent={
            <View className="mb-6">
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 shadow-sm">
                  <Bell color="white" fill="white" size={26} />
                </View>
                <View>
                  <Text className="font-bold text-3xl text-gray-900 dark:text-gray-100">
                    {i18n.t("tabs.notifications")}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400">
                    {i18n.t("notifications.description")}
                  </Text>
                </View>
              </View>
            </View>
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 px-5 py-6">
          <View className="mb-8 flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 shadow-sm">
              <Bell color="white" fill="white" size={26} />
            </View>
            <View>
              <Text className="font-bold text-3xl text-gray-900 dark:text-gray-100">
                {i18n.t("tabs.notifications")}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400">
                {i18n.t("notifications.description")}
              </Text>
            </View>
          </View>
          <EmptyState
            actionLabel={i18n.t("notifications.addFavorites")}
            description={i18n.t("notifications.emptyDescription")}
            icon={<Bell color="#D1D5DB" size={64} />}
            onAction={() => router.navigate("/(tabs)/favorites")}
            title={i18n.t("notifications.emptyTitle")}
          />
        </View>
      )}
    </View>
  );
}
