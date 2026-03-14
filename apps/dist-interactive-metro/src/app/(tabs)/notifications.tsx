import type { FavoriteRoute } from "@/types/station";

import { useRouter } from "expo-router";
import { Bell, Clock, Navigation, RefreshCw } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/empty-state";
import { LineBadge } from "@/components/ui/line-badge";
import { getFavoriteRoutes } from "@/data/favorites";
import { useStationTimetable } from "@/hooks/use-station-timetable";
import i18n from "@/i18n";

interface TimetableRowProps {
  stationName: string;
  lineName: string;
  lineColor: string;
}

function TimetableRow({ stationName, lineName, lineColor }: TimetableRowProps) {
  const { departures, loading, error } = useStationTimetable(
    stationName,
    lineName,
    3,
  );

  if (loading) {
    return (
      <View className="flex-row items-center gap-2 py-2">
        <ActivityIndicator color={lineColor} size="small" />
        <Text className="text-gray-500 text-xs">
          {i18n.t("timetable.loading")}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <Text className="py-2 text-red-500 text-xs">
        {i18n.t("timetable.noData")}
      </Text>
    );
  }

  if (departures.length === 0) {
    return (
      <Text className="py-2 text-gray-400 text-xs">
        {i18n.t("timetable.noUpcoming")}
      </Text>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-2 py-1">
      {departures.map((dep) => (
        <View
          className="flex-row items-center gap-1 rounded-full px-3 py-1"
          key={dep.trnNo}
          style={{ backgroundColor: `${lineColor}18` }}
        >
          <Clock color={lineColor} size={11} />
          <Text className="font-medium text-xs" style={{ color: lineColor }}>
            {dep.dptTime}
          </Text>
        </View>
      ))}
    </View>
  );
}

interface FavoriteCardProps {
  route: FavoriteRoute;
  onSearch: (route: FavoriteRoute) => void;
}

function FavoriteCard({ route, onSearch }: FavoriteCardProps) {
  return (
    <View
      className="overflow-hidden rounded-2xl bg-white"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="p-5">
        {/* Route header */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="font-medium text-gray-900">
              {route.startStation.name}
            </Text>
            <LineBadge
              color={route.startStation.lineColor}
              line={route.startStation.line}
            />
            <Text className="text-gray-400">→</Text>
            <Text className="font-medium text-gray-900">
              {route.endStation.name}
            </Text>
          </View>
          <Pressable
            className="rounded-xl bg-blue-50 p-2 active:bg-blue-100"
            onPress={() => onSearch(route)}
          >
            <Navigation color="#2563EB" size={14} />
          </Pressable>
        </View>

        {/* Timetable section */}
        <View className="border-gray-100 border-t pt-3">
          <Text className="mb-2 text-gray-500 text-xs">
            {i18n.t("notifications.nextTrains")} ·{" "}
            {i18n.t("notifications.from")} {route.startStation.name}
          </Text>
          <TimetableRow
            lineColor={route.startStation.lineColor}
            lineName={route.startStation.line}
            stationName={route.startStation.name}
          />
        </View>
      </View>
    </View>
  );
}

export default function NotificationsTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      router.navigate({
        pathname: "/route-result",
        params: {
          start: route.startStation.id,
          end: route.endStation.id,
          ...(route.viaStation ? { via: route.viaStation.id } : {}),
        },
      });
    },
    [router],
  );

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
      >
        {/* Header */}
        <View className="mb-6 flex-row items-start justify-between">
          <View className="flex-1">
            <View className="mb-2 flex-row items-center gap-3">
              <Bell color="#2563EB" size={32} />
              <Text className="font-medium text-2xl text-gray-900">
                {i18n.t("tabs.notifications")}
              </Text>
            </View>
            <Text className="text-base text-gray-600">
              {i18n.t("notifications.description")}
            </Text>
          </View>
          <Pressable
            className="mt-1 rounded-xl bg-white p-2.5 active:bg-gray-100"
            onPress={loadFavorites}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <RefreshCw color="#6B7280" size={18} />
          </Pressable>
        </View>

        {/* Content */}
        {routes.length > 0 ? (
          <View className="gap-3">
            {routes.map((route) => (
              <FavoriteCard
                key={route.id}
                onSearch={handleSearch}
                route={route}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            actionLabel={i18n.t("notifications.addFavorites")}
            description={i18n.t("notifications.emptyDescription")}
            icon={<Bell color="#9CA3AF" size={40} />}
            onAction={() => router.navigate("/(tabs)/favorites")}
            title={i18n.t("notifications.emptyTitle")}
          />
        )}
      </ScrollView>
    </View>
  );
}
