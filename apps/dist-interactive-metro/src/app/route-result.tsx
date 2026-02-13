import type { RouteInfo } from "@/utils/route-calculator";

import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Heart,
  MapPin,
  Repeat,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ElevatedCard } from "@/components/ui/elevated-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { LineBadge } from "@/components/ui/line-badge";
import {
  addFavoriteRoute,
  getFavoriteRoutes,
  isFavoriteRoute,
} from "@/data/favorites";
import { stations } from "@/data/stations";
import i18n from "@/i18n";
import { calculateRoute } from "@/utils/route-calculator";

export default function RouteResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    start: string;
    end: string;
    via?: string;
  }>();

  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const startStation = useMemo(
    () => stations.find((s) => s.id === params.start) ?? null,
    [params.start],
  );
  const endStation = useMemo(
    () => stations.find((s) => s.id === params.end) ?? null,
    [params.end],
  );
  const viaStation = useMemo(
    () =>
      params.via ? (stations.find((s) => s.id === params.via) ?? null) : null,
    [params.via],
  );

  useEffect(() => {
    if (startStation && endStation) {
      const route = calculateRoute(
        startStation,
        endStation,
        viaStation ?? undefined,
      );
      setRouteInfo(route);

      getFavoriteRoutes().then((favs) => {
        setIsFavorite(
          isFavoriteRoute(favs, startStation.id, endStation.id, viaStation?.id),
        );
      });
    }
  }, [startStation, endStation, viaStation]);

  const handleToggleFavorite = useCallback(async () => {
    if (!(startStation && endStation)) return;
    if (!isFavorite) {
      await addFavoriteRoute({
        startStation,
        endStation,
        ...(viaStation && { viaStation }),
      });
    }
    setIsFavorite((prev) => !prev);
  }, [startStation, endStation, viaStation, isFavorite]);

  if (!(routeInfo && startStation && endStation)) {
    return (
      <GradientBackground>
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ paddingTop: insets.top }}
        >
          <Text className="mb-4 text-gray-500">
            {i18n.t("routeResult.loading")}
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-blue-600">
              {i18n.t("routeResult.goBack")}
            </Text>
          </Pressable>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 32,
        }}
      >
        <View className="px-4">
          {/* Header */}
          <View className="mb-6 flex-row items-center gap-3">
            <Pressable
              accessibilityLabel={i18n.t("common.back")}
              className="h-10 w-10 items-center justify-center rounded-full bg-white active:bg-gray-50"
              onPress={() => router.back()}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <ArrowLeft color="#111827" size={20} />
            </Pressable>
            <Text className="font-medium text-2xl text-gray-900">
              {i18n.t("routeResult.title")}
            </Text>
          </View>

          {/* Summary card */}
          <ElevatedCard className="mb-6">
            {/* From → To */}
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="mb-1 text-gray-500 text-sm">
                  {i18n.t("stationSelect.departureShort")}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="font-medium text-gray-900 text-xl">
                    {startStation.name}
                  </Text>
                  <LineBadge
                    color={startStation.lineColor}
                    line={startStation.line}
                  />
                </View>
              </View>
              <ArrowRight color="#9CA3AF" size={24} />
              <View className="flex-1 items-end">
                <Text className="mb-1 text-gray-500 text-sm">
                  {i18n.t("stationSelect.arrivalShort")}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="font-medium text-gray-900 text-xl">
                    {endStation.name}
                  </Text>
                  <LineBadge
                    color={endStation.lineColor}
                    line={endStation.line}
                  />
                </View>
              </View>
            </View>

            {/* Stats grid */}
            <View className="flex-row border-gray-100 border-t pt-6">
              <View className="flex-1 items-center">
                <Clock color="#2563EB" size={24} />
                <Text className="mt-1 text-gray-500 text-sm">
                  {i18n.t("routeResult.time")}
                </Text>
                <Text className="font-medium text-gray-900 text-lg">
                  {routeInfo.totalTime}
                  {i18n.t("routeResult.minutes")}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <MapPin color="#16A34A" size={24} />
                <Text className="mt-1 text-gray-500 text-sm">
                  {i18n.t("routeResult.stations")}
                </Text>
                <Text className="font-medium text-gray-900 text-lg">
                  {routeInfo.totalStations}
                  {i18n.t("routeResult.stationUnit")}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Repeat color="#EA580C" size={24} />
                <Text className="mt-1 text-gray-500 text-sm">
                  {i18n.t("routeResult.transfers")}
                </Text>
                <Text className="font-medium text-gray-900 text-lg">
                  {routeInfo.transfers}
                  {i18n.t("routeResult.transferUnit")}
                </Text>
              </View>
            </View>

            {/* Favorite button */}
            <View className="mt-6 items-center">
              <Pressable
                className={`flex-row items-center gap-2 rounded-full px-6 py-3 ${
                  isFavorite
                    ? "bg-red-500"
                    : "border-2 border-gray-200 bg-white"
                }`}
                onPress={handleToggleFavorite}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Heart
                  color={isFavorite ? "#FFFFFF" : "#374151"}
                  fill={isFavorite ? "#FFFFFF" : "transparent"}
                  size={20}
                />
                <Text
                  className={`font-medium text-sm ${
                    isFavorite ? "text-white" : "text-gray-700"
                  }`}
                >
                  {isFavorite
                    ? i18n.t("routeResult.removeFavorite")
                    : i18n.t("routeResult.addFavorite")}
                </Text>
              </Pressable>
            </View>
          </ElevatedCard>

          {/* Detailed route card */}
          <ElevatedCard className="mb-6">
            <Text className="mb-6 font-medium text-gray-900 text-lg">
              {i18n.t("routeResult.detailRoute")}
            </Text>

            <View className="gap-6">
              {routeInfo.segments.map((segment, index) => (
                <View
                  className="relative"
                  key={`seg-${segment.station.id}-${segment.station.line}`}
                >
                  {/* Connector line */}
                  {index < routeInfo.segments.length - 1 && (
                    <View
                      className="absolute top-12 left-4 h-16 w-1"
                      style={{
                        backgroundColor: segment.isTransfer
                          ? "#E5E7EB"
                          : segment.station.lineColor,
                      }}
                    />
                  )}

                  <View className="flex-row items-start gap-4">
                    {/* Station marker */}
                    <View
                      className="h-8 w-8 items-center justify-center rounded-full border-4 border-white"
                      style={{
                        backgroundColor: segment.station.lineColor,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 3,
                        elevation: 3,
                      }}
                    >
                      {index === 0 && (
                        <View className="h-3 w-3 rounded-full bg-white" />
                      )}
                      {index === routeInfo.segments.length - 1 && (
                        <MapPin color="#FFFFFF" fill="#FFFFFF" size={14} />
                      )}
                      {segment.isTransfer && (
                        <Repeat color="#FFFFFF" size={14} />
                      )}
                    </View>

                    {/* Station info */}
                    <View className="flex-1 pb-8">
                      <View className="mb-1 flex-row items-center gap-2">
                        <Text className="font-medium text-gray-900 text-lg">
                          {segment.station.name}
                        </Text>
                        <LineBadge
                          color={segment.station.lineColor}
                          line={segment.station.line}
                        />
                      </View>

                      {segment.isTransfer && segment.transferTo && (
                        <View className="mt-2 rounded-lg border border-orange-200 bg-orange-50 p-3">
                          <View className="flex-row items-center gap-2">
                            <Repeat color="#9A3412" size={16} />
                            <Text className="text-orange-800 text-sm">
                              {segment.transferTo.join(", ")}{" "}
                              {i18n.t("routeResult.transferTo")}
                            </Text>
                          </View>
                        </View>
                      )}

                      {index === 0 && (
                        <Text className="mt-1 text-gray-500 text-sm">
                          {endStation.line} {i18n.t("routeResult.direction")}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ElevatedCard>

          {/* New search button */}
          <Pressable
            className="w-full items-center rounded-2xl border-2 border-blue-600 bg-white py-4 active:bg-blue-50"
            onPress={() => router.back()}
          >
            <Text className="font-medium text-blue-600 text-lg">
              {i18n.t("routeResult.newSearch")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
