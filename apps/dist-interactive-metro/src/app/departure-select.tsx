import type { NearbyStation } from "@/types/station";

import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Footprints,
  MapPin,
  Navigation,
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
import { stations } from "@/data/stations";
import i18n from "@/i18n";
import { findNearestStations, formatDistance } from "@/utils/geo";

type LocationState =
  | { status: "loading" }
  | { status: "granted"; nearby: NearbyStation[] }
  | { status: "denied" }
  | { status: "error"; message: string };

async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

async function fetchNearbyStations(): Promise<NearbyStation[]> {
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

/** Resolve GPS permission + nearby stations into a LocationState. */
async function resolveLocation(): Promise<LocationState> {
  const granted = await requestLocationPermission();
  if (!granted) return { status: "denied" };

  const nearby = await fetchNearbyStations();
  return { status: "granted", nearby };
}

export default function DepartureSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setStartStation } = useRouteSearch();
  const [locationState, setLocationState] = useState<LocationState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    resolveLocation()
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
  }, []);

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
      pathname: "/station-select" as const,
      params: { type: "start" },
    } as never);
  }, [router]);

  const handleRefreshLocation = useCallback(() => {
    setLocationState({ status: "loading" });
    fetchNearbyStations()
      .then((nearby) => {
        setLocationState({ status: "granted", nearby });
      })
      .catch(() => {
        setLocationState({
          status: "error",
          message: i18n.t("departureSelect.locationError"),
        });
      });
  }, []);

  return (
    <GradientBackground>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 32,
        }}
      >
        {/* Header */}
        <View className="mb-6 flex-row items-center gap-3 px-6 pt-4">
          <Pressable
            accessibilityLabel={i18n.t("common.back")}
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-white/80 active:bg-white"
            onPress={() => router.back()}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <ArrowLeft color="#111827" size={20} />
          </Pressable>
          <View className="flex-1">
            <Text className="font-medium text-gray-900 text-xl">
              {i18n.t("departureSelect.title")}
            </Text>
            <Text className="text-gray-600 text-sm">
              {i18n.t("departureSelect.subtitle")}
            </Text>
          </View>
        </View>

        <View className="px-6">
          {/* GPS Status / Nearby stations */}
          {locationState.status === "loading" && (
            <ElevatedCard className="mb-6">
              <View className="items-center gap-4 py-8">
                <ActivityIndicator color="#2563EB" size="large" />
                <Text className="text-base text-gray-600">
                  {i18n.t("departureSelect.locating")}
                </Text>
              </View>
            </ElevatedCard>
          )}

          {locationState.status === "granted" && (
            <>
              {/* Section header */}
              <View className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Navigation color="#2563EB" size={18} />
                  <Text className="font-medium text-base text-gray-900">
                    {i18n.t("departureSelect.nearbyStations")}
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel={i18n.t("departureSelect.refreshLocation")}
                  accessibilityRole="button"
                  className="flex-row items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 active:bg-blue-100"
                  onPress={handleRefreshLocation}
                >
                  <MapPin color="#2563EB" size={14} />
                  <Text className="font-medium text-blue-600 text-xs">
                    {i18n.t("departureSelect.refreshLocation")}
                  </Text>
                </Pressable>
              </View>

              {/* Nearby station cards */}
              <View className="mb-6 gap-3">
                {locationState.nearby.map((item, index) => (
                  <Pressable
                    key={`nearby-${item.station.id}-${item.station.line}`}
                    onPress={() => handleSelectNearby(item)}
                  >
                    <ElevatedCard
                      className={index === 0 ? "border-2 border-blue-200" : ""}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          {/* Rank badge + Station name */}
                          <View className="mb-2 flex-row items-center gap-2">
                            {index === 0 && (
                              <View className="rounded-full bg-blue-600 px-2 py-0.5">
                                <Text className="font-bold text-white text-xs">
                                  {i18n.t("departureSelect.closest")}
                                </Text>
                              </View>
                            )}
                            <Text
                              className={`font-medium text-lg ${
                                index === 0 ? "text-blue-900" : "text-gray-900"
                              }`}
                            >
                              {item.station.name}
                            </Text>
                          </View>

                          {/* Line badge + connections */}
                          <View className="mb-2 flex-row flex-wrap items-center gap-2">
                            <LineBadge
                              color={item.station.lineColor}
                              line={item.station.line}
                            />
                            {item.station.connections &&
                              item.station.connections.length > 0 && (
                                <Text className="text-gray-500 text-xs">
                                  {i18n.t("stationSelect.transfer")}:{" "}
                                  {item.station.connections.join(", ")}
                                </Text>
                              )}
                          </View>

                          {/* Distance + walking time */}
                          <View className="flex-row items-center gap-4">
                            <View className="flex-row items-center gap-1">
                              <MapPin color="#6B7280" size={14} />
                              <Text className="text-gray-600 text-sm">
                                {formatDistance(item.distanceM)}
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Footprints color="#6B7280" size={14} />
                              <Text className="text-gray-600 text-sm">
                                {i18n.t("departureSelect.walkingTime", {
                                  minutes: item.walkingMinutes,
                                })}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Right arrow indicator */}
                        <View className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                          <Navigation
                            color={index === 0 ? "#2563EB" : "#9CA3AF"}
                            size={18}
                          />
                        </View>
                      </View>
                    </ElevatedCard>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {locationState.status === "denied" && (
            <ElevatedCard className="mb-6">
              <View className="items-center gap-3 py-6">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                  <AlertCircle color="#D97706" size={28} />
                </View>
                <Text className="font-medium text-base text-gray-900">
                  {i18n.t("departureSelect.permissionDeniedTitle")}
                </Text>
                <Text className="text-center text-gray-600 text-sm">
                  {i18n.t("departureSelect.permissionDeniedDesc")}
                </Text>
              </View>
            </ElevatedCard>
          )}

          {locationState.status === "error" && (
            <ElevatedCard className="mb-6">
              <View className="items-center gap-3 py-6">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle color="#DC2626" size={28} />
                </View>
                <Text className="font-medium text-base text-gray-900">
                  {i18n.t("departureSelect.errorTitle")}
                </Text>
                <Text className="text-center text-gray-600 text-sm">
                  {locationState.message}
                </Text>
                <Pressable
                  className="mt-2 rounded-full bg-blue-600 px-6 py-2 active:bg-blue-700"
                  onPress={handleRefreshLocation}
                >
                  <Text className="font-medium text-sm text-white">
                    {i18n.t("departureSelect.retry")}
                  </Text>
                </Pressable>
              </View>
            </ElevatedCard>
          )}

          {/* Divider */}
          <View className="mb-6 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-gray-200" />
            <Text className="text-gray-400 text-sm">
              {i18n.t("departureSelect.orSearchManually")}
            </Text>
            <View className="h-px flex-1 bg-gray-200" />
          </View>

          {/* Search all stations button */}
          <Pressable
            className="w-full flex-row items-center justify-center gap-3 rounded-2xl bg-white py-4 active:bg-gray-50"
            onPress={handleGoToSearch}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Search color="#6B7280" size={20} />
            <Text className="font-medium text-base text-gray-700">
              {i18n.t("departureSelect.searchAllStations")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
