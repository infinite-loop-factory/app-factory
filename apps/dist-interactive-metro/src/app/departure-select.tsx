import type { NearbyStation, Station } from "@/types/station";

import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Footprints,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ElevatedCard } from "@/components/ui/elevated-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { LineBadge } from "@/components/ui/line-badge";
import { useRouteSearch } from "@/context/route-search-context";
import { addRecentStation } from "@/data/recent-stations";
import { useStations } from "@/data/station-store";
import i18n from "@/i18n";
import { findNearestStations, formatDistance } from "@/utils/geo";

type LocationState =
  | { status: "loading" }
  | { status: "ready"; nearby: NearbyStation[] }
  | { status: "denied" }
  | { status: "error"; message: string };

async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

async function fetchNearbyStations(
  stations: Station[],
): Promise<NearbyStation[]> {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return findNearestStations(
    location.coords.latitude,
    location.coords.longitude,
    stations,
    3,
  );
}

async function resolveLocation(stations: Station[]): Promise<LocationState> {
  const granted = await requestLocationPermission();
  if (!granted) return { status: "denied" };

  try {
    const nearby = await fetchNearbyStations(stations);
    return { status: "ready", nearby };
  } catch (err) {
    return { status: "error", message: String(err) };
  }
}

export default function DepartureSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setStartStation } = useRouteSearch();
  const stations = useStations();

  const [locationState, setLocationState] = useState<LocationState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;
    if (stations.length === 0) return;

    resolveLocation(stations)
      .then((state) => {
        if (!cancelled) setLocationState(state);
      })
      .catch(() => {
        if (!cancelled) {
          setLocationState({
            status: "error",
            message: i18n.t("departureSelect.locationError"),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [stations]);

  const handleSelectNearby = useCallback(
    async (item: NearbyStation) => {
      await addRecentStation(item.station);
      setStartStation(item.station);
      router.back();
    },
    [setStartStation, router],
  );

  const handleGoToSearch = useCallback(() => {
    router.replace({
      pathname: "/station-select",
      params: { type: "start" },
    });
  }, [router]);

  const handleRefreshLocation = useCallback(() => {
    if (stations.length === 0) return;
    setLocationState({ status: "loading" });
    fetchNearbyStations(stations)
      .then((nearby) => {
        setLocationState({ status: "ready", nearby });
      })
      .catch(() => {
        setLocationState({
          status: "error",
          message: i18n.t("departureSelect.locationError"),
        });
      });
  }, [stations]);

  return (
    <GradientBackground>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8 flex-row items-center gap-4 px-6">
          <Pressable
            accessibilityLabel={i18n.t("common.back")}
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm active:bg-gray-50 dark:bg-gray-800"
            onPress={() => router.back()}
          >
            <ArrowLeft color="#111827" size={22} />
          </Pressable>
          <View className="flex-1">
            <Text className="font-bold text-3xl text-gray-900 dark:text-gray-100">
              {i18n.t("departureSelect.title")}
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400">
              {i18n.t("departureSelect.subtitle")}
            </Text>
          </View>
        </View>

        <View className="px-6">
          {locationState.status === "loading" && (
            <ElevatedCard className="mb-8 items-center py-10">
              <ActivityIndicator color="#2563EB" size="large" />
              <Text className="mt-4 font-medium text-gray-500">
                {i18n.t("departureSelect.locating")}
              </Text>
            </ElevatedCard>
          )}

          {locationState.status === "ready" && (
            <View className="mb-8">
              <View className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Navigation color="#2563EB" fill="#2563EB" size={18} />
                  <Text className="font-bold text-gray-900 text-lg dark:text-gray-100">
                    {i18n.t("departureSelect.nearbyStations")}
                  </Text>
                </View>
                <Pressable
                  className="h-8 w-8 items-center justify-center rounded-full bg-blue-50 active:bg-blue-100 dark:bg-blue-900/20"
                  onPress={handleRefreshLocation}
                >
                  <RefreshCw color="#2563EB" size={16} />
                </Pressable>
              </View>

              <View className="gap-4">
                {locationState.nearby.map((item, index) => (
                  <Pressable
                    key={`nearby-${item.station.id}-${item.station.line}`}
                    onPress={() => handleSelectNearby(item)}
                  >
                    <ElevatedCard
                      className={`p-5 ${index === 0 ? "border-2 border-blue-100 shadow-blue-500/10" : ""}`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <View className="mb-1.5 flex-row items-center gap-2">
                            {index === 0 && (
                              <View className="rounded-full bg-blue-600 px-2 py-0.5">
                                <Text className="font-bold text-[10px] text-white uppercase">
                                  {i18n.t("departureSelect.closest")}
                                </Text>
                              </View>
                            )}
                            <Text
                              className={`font-bold text-xl ${index === 0 ? "text-blue-600" : "text-gray-900 dark:text-gray-100"}`}
                            >
                              {item.station.name}
                            </Text>
                          </View>

                          <View className="mb-3 flex-row items-center gap-2">
                            <LineBadge
                              color={item.station.lineColor}
                              line={item.station.line}
                              size="sm"
                            />
                            {item.station.connections &&
                              item.station.connections.length > 0 && (
                                <Text className="text-gray-400 text-xs">
                                  환승: {item.station.connections.join(", ")}
                                </Text>
                              )}
                          </View>

                          <View className="flex-row items-center gap-3">
                            <View className="flex-row items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-900">
                              <MapPin color="#6B7280" size={12} />
                              <Text className="font-medium text-gray-500 text-xs">
                                {formatDistance(item.distanceM)}
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-900">
                              <Footprints color="#6B7280" size={12} />
                              <Text className="font-medium text-gray-500 text-xs">
                                {i18n.t("departureSelect.walkingTime", {
                                  minutes: item.walkingMinutes,
                                })}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <ChevronRight color="#D1D5DB" size={24} />
                      </View>
                    </ElevatedCard>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {locationState.status === "denied" && (
            <ElevatedCard className="mb-8 items-center p-6">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <AlertCircle color="#D97706" size={32} />
              </View>
              <Text className="mb-2 font-bold text-gray-900 text-lg dark:text-gray-100">
                {i18n.t("departureSelect.permissionDeniedTitle")}
              </Text>
              <Text className="text-center text-gray-500 text-sm">
                {i18n.t("departureSelect.permissionDeniedDesc")}
              </Text>
            </ElevatedCard>
          )}

          {locationState.status === "error" && (
            <ElevatedCard className="mb-8 items-center p-6">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle color="#DC2626" size={32} />
              </View>
              <Text className="mb-2 font-bold text-gray-900 text-lg dark:text-gray-100">
                {i18n.t("departureSelect.errorTitle")}
              </Text>
              <Text className="mb-6 text-center text-gray-500 text-sm">
                {locationState.message}
              </Text>
              <Pressable
                className="w-full rounded-2xl bg-blue-600 py-4 active:bg-blue-700"
                onPress={handleRefreshLocation}
              >
                <Text className="text-center font-bold text-white">
                  {i18n.t("departureSelect.retry")}
                </Text>
              </Pressable>
            </ElevatedCard>
          )}

          <View className="mb-8 flex-row items-center gap-4">
            <View className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            <Text className="font-bold text-gray-400 text-xs uppercase tracking-widest">
              {i18n.t("departureSelect.orSearchManually")}
            </Text>
            <View className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          </View>

          <Pressable
            className="flex-row items-center justify-center gap-3 rounded-2xl bg-white py-4.5 shadow-sm active:bg-gray-50 dark:bg-gray-800"
            onPress={handleGoToSearch}
          >
            <Search color="#6B7280" size={20} />
            <Text className="font-bold text-gray-700 text-lg dark:text-gray-200">
              {i18n.t("departureSelect.searchAllStations")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
