import type { RouteInfo, RouteSegment } from "@/utils/route-calculator";

import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  MapPin,
  Repeat,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ElevatedCard } from "@/components/ui/elevated-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { LineBadge } from "@/components/ui/line-badge";
import {
  addFavoriteRoute,
  findFavoriteRoute,
  getFavoriteRoutes,
  isFavoriteRoute,
  removeFavoriteRoute,
} from "@/data/favorites";
import { useStations } from "@/data/station-store";
import { useStationTimetable } from "@/hooks/use-station-timetable";
import { useTransferInfo } from "@/hooks/use-transfer-info";
import i18n from "@/i18n";
import { calculateRoute } from "@/utils/route-calculator";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TransferInfoBadgeProps {
  stationName: string;
  fromLineName: string;
  toLineName: string;
}

function TransferInfoBadge({
  stationName,
  fromLineName,
  toLineName,
}: TransferInfoBadgeProps) {
  const { info, loading } = useTransferInfo(
    stationName,
    fromLineName,
    toLineName,
  );

  if (loading || !info) return null;

  return (
    <View className="mt-1 flex-row items-center gap-2">
      <Text className="text-orange-700 text-xs">
        {i18n.t("transferInfo.walkingDistance", { distance: info.distanceM })}
      </Text>
      <Text className="text-orange-500 text-xs">
        {i18n.t("transferInfo.walkingMinutes", {
          minutes: info.walkingMinutes,
        })}
      </Text>
    </View>
  );
}

interface DepartureStripProps {
  stationName: string;
  lineName: string;
  lineColor: string;
}

function DepartureStrip({
  stationName,
  lineName,
  lineColor,
}: DepartureStripProps) {
  const { departures, loading } = useStationTimetable(stationName, lineName, 4);

  function renderContent() {
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

  return (
    <View className="mt-4 border-gray-100 border-t pt-4">
      <Text className="mb-2 text-gray-500 text-xs">
        {i18n.t("timetable.title")}
      </Text>
      {renderContent()}
    </View>
  );
}

interface CollapsibleRouteSegmentProps {
  group: {
    start: RouteSegment;
    intermediates: RouteSegment[];
    end: RouteSegment;
    isTransfer: boolean;
  };
}

function CollapsibleRouteSegment({ group }: CollapsibleRouteSegmentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const { start, intermediates, isTransfer } = group;

  return (
    <View className="relative">
      {/* Visual Line */}
      <View
        className="absolute top-6 bottom-0 left-[14px] w-1"
        style={{
          backgroundColor: isTransfer ? "#E5E7EB" : start.station.lineColor,
          zIndex: -1,
        }}
      />

      <View className="flex-row gap-4">
        {/* Node */}
        <View
          className="h-8 w-8 items-center justify-center rounded-full border-4 border-white"
          style={{
            backgroundColor: start.station.lineColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          {isTransfer ? (
            <Repeat color="white" size={14} />
          ) : (
            <View className="h-2 w-2 rounded-full bg-white" />
          )}
        </View>

        <View className="flex-1 pb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="font-semibold text-gray-900 text-lg dark:text-gray-100">
                {start.station.name}
              </Text>
              <LineBadge
                color={start.station.lineColor}
                line={start.station.line}
              />
            </View>
          </View>

          {/* Transfer Info if applicable */}
          {isTransfer && start.transferTo && (
            <View className="mt-2 rounded-xl border border-orange-100 bg-orange-50/50 p-3">
              <View className="flex-row items-center gap-2">
                <Repeat color="#9A3412" size={14} />
                <Text className="font-medium text-orange-800 text-xs">
                  {start.transferTo.join(", ")}{" "}
                  {i18n.t("routeResult.transferTo")}
                </Text>
              </View>
              <TransferInfoBadge
                fromLineName={start.station.line}
                stationName={start.station.name}
                toLineName={start.transferTo[0] ?? ""}
              />
            </View>
          )}

          {/* Intermediate Stations Toggler */}
          {intermediates.length > 0 && (
            <Pressable
              className="mt-3 flex-row items-center gap-2 self-start rounded-full bg-gray-50 px-3 py-1.5 active:bg-gray-100 dark:bg-gray-800"
              onPress={toggleExpand}
            >
              <Text className="text-gray-500 text-xs">
                {intermediates.length} {i18n.t("routeResult.stationUnit")}
              </Text>
              {isExpanded ? (
                <ChevronUp color="#9CA3AF" size={14} />
              ) : (
                <ChevronDown color="#9CA3AF" size={14} />
              )}
            </Pressable>
          )}

          {/* Expanded Intermediate Stations */}
          {isExpanded && intermediates.length > 0 && (
            <View className="mt-3 gap-3 border-gray-100 border-l-2 pl-4">
              {intermediates.map((station, idx) => (
                <View
                  className="flex-row items-center gap-2"
                  key={`int-${idx}-${station.station.id}`}
                >
                  <View
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: station.station.lineColor }}
                  />
                  <Text className="text-gray-600 text-sm dark:text-gray-400">
                    {station.station.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

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
  const stations = useStations();

  const startStation = useMemo(
    () => stations.find((s) => s.id === params.start) ?? null,
    [params.start, stations],
  );
  const endStation = useMemo(
    () => stations.find((s) => s.id === params.end) ?? null,
    [params.end, stations],
  );
  const viaStation = useMemo(
    () =>
      params.via ? (stations.find((s) => s.id === params.via) ?? null) : null,
    [params.via, stations],
  );

  useEffect(() => {
    let cancelled = false;

    if (startStation && endStation) {
      const route = calculateRoute(
        startStation,
        endStation,
        viaStation ?? undefined,
      );
      if (!cancelled) {
        setRouteInfo(route);

        getFavoriteRoutes().then((favs) => {
          if (!cancelled) {
            setIsFavorite(
              isFavoriteRoute(
                favs,
                startStation.id,
                endStation.id,
                viaStation?.id,
              ),
            );
          }
        });
      }
    }

    return () => {
      cancelled = true;
    };
  }, [startStation, endStation, viaStation]);

  const handleToggleFavorite = useCallback(async () => {
    if (!(startStation && endStation)) return;

    const favs = await getFavoriteRoutes();
    const existing = findFavoriteRoute(
      favs,
      startStation.id,
      endStation.id,
      viaStation?.id,
    );

    if (isFavorite && existing) {
      await removeFavoriteRoute(existing.id);
      setIsFavorite(false);
    } else if (!isFavorite) {
      await addFavoriteRoute({
        startStation,
        endStation,
        ...(viaStation && { viaStation }),
      });
      setIsFavorite(true);
    }
  }, [startStation, endStation, viaStation, isFavorite]);

  const eta = useMemo(() => {
    if (!routeInfo) return "";
    const now = new Date();
    now.setMinutes(now.getMinutes() + routeInfo.totalTime);
    return now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [routeInfo]);

  // Group segments into logical chunks (departure -> transfer -> end)
  const groupedSegments = useMemo(() => {
    if (!routeInfo || routeInfo.segments.length === 0) return [];

    const chunks: Array<{
      start: RouteSegment;
      intermediates: RouteSegment[];
      end: RouteSegment;
      isTransfer: boolean;
    }> = [];
    let currentIntermediates: RouteSegment[] = [];
    let lastKeyPoint = routeInfo.segments[0];
    if (!lastKeyPoint) return [];

    for (let i = 1; i < routeInfo.segments.length; i++) {
      const seg = routeInfo.segments[i];
      if (!seg) continue;
      const isLast = i === routeInfo.segments.length - 1;

      if (seg.isTransfer || isLast) {
        chunks.push({
          start: lastKeyPoint,
          intermediates: currentIntermediates,
          end: seg,
          isTransfer: !!lastKeyPoint.isTransfer,
        });
        lastKeyPoint = seg;
        currentIntermediates = [];
      } else {
        currentIntermediates.push(seg);
      }
    }

    return chunks;
  }, [routeInfo]);

  if (!(routeInfo && startStation && endStation)) {
    return (
      <GradientBackground>
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ paddingTop: insets.top }}
        >
          <ActivityIndicator color="#2563EB" size="large" />
          <Text className="mt-4 text-gray-500">
            {i18n.t("routeResult.loading")}
          </Text>
        </View>
      </GradientBackground>
    );
  }

  if (routeInfo.totalTime === 0) {
    return (
      <GradientBackground>
        <View className="flex-1 px-4" style={{ paddingTop: insets.top + 16 }}>
          <View className="mb-6 flex-row items-center gap-3">
            <Pressable
              accessibilityLabel={i18n.t("common.back")}
              className="h-10 w-10 items-center justify-center rounded-full bg-white active:bg-gray-50 dark:bg-gray-800"
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
            <Text className="font-bold text-2xl text-gray-900 dark:text-gray-100">
              {i18n.t("routeResult.title")}
            </Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
              <MapPin color="#EF4444" size={40} />
            </View>
            <Text className="mb-2 text-center font-bold text-gray-900 text-xl dark:text-gray-100">
              {i18n.t("routeResult.routeNotFound", {
                defaultValue: "경로를 찾을 수 없습니다",
              })}
            </Text>
            <Text className="mb-8 text-center text-gray-500">
              선택하신 두 역 사이의 환승 정보나 연결된 경로가 없습니다.
            </Text>
            <Pressable
              className="w-full items-center rounded-2xl bg-blue-600 py-4 shadow-lg active:bg-blue-700"
              onPress={() => router.back()}
              style={{
                shadowColor: "#2563EB",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="font-bold text-lg text-white">
                {i18n.t("routeResult.newSearch")}
              </Text>
            </Pressable>
          </View>
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
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4">
          {/* Header */}
          <View className="mb-6 flex-row items-center gap-3">
            <Pressable
              accessibilityLabel={i18n.t("common.back")}
              className="h-10 w-10 items-center justify-center rounded-full bg-white active:bg-gray-50 dark:bg-gray-800"
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
            <Text className="font-bold text-2xl text-gray-900 dark:text-gray-100">
              {i18n.t("routeResult.title")}
            </Text>
          </View>

          {/* Summary card */}
          <ElevatedCard className="mb-6 p-5">
            {routeInfo.viaFailed && (
              <View className="mb-4 flex-row items-center gap-2 rounded-lg bg-amber-50 p-3">
                <Text className="text-amber-700 text-xs">
                  ⚠ {i18n.t("routeResult.viaFailed")}
                </Text>
              </View>
            )}
            {/* From → To Visualization */}
            <View className="mb-8 items-center">
              <View className="w-full flex-row items-center justify-between px-2">
                <View className="flex-1 items-center">
                  <View
                    className="h-12 w-12 items-center justify-center rounded-full border-4 border-white"
                    style={{
                      backgroundColor: startStation.lineColor,
                      elevation: 4,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                    }}
                  >
                    <MapPin color="white" size={20} />
                  </View>
                  <Text
                    className="mt-2 text-center font-bold text-gray-900 text-lg dark:text-gray-100"
                    numberOfLines={1}
                  >
                    {startStation.name}
                  </Text>
                  <LineBadge
                    color={startStation.lineColor}
                    line={startStation.line}
                  />
                </View>

                <View className="flex-1 items-center justify-center pt-2">
                  <ArrowRight color="#D1D5DB" size={24} />
                </View>

                <View className="flex-1 items-center">
                  <View
                    className="h-12 w-12 items-center justify-center rounded-full border-4 border-white"
                    style={{
                      backgroundColor: endStation.lineColor,
                      elevation: 4,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                    }}
                  >
                    <MapPin color="white" fill="white" size={20} />
                  </View>
                  <Text
                    className="mt-2 text-center font-bold text-gray-900 text-lg dark:text-gray-100"
                    numberOfLines={1}
                  >
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
            <View className="flex-row justify-around border-gray-100 border-t pt-6">
              <View className="items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <Clock color="#2563EB" size={20} />
                </View>
                <Text className="mt-2 font-bold text-gray-900 text-lg dark:text-gray-100">
                  {routeInfo.totalTime}
                  <Text className="font-normal text-gray-500 text-sm">
                    {i18n.t("routeResult.minutes")}
                  </Text>
                </Text>
                <Text className="mt-0.5 font-medium text-blue-600 text-xs">
                  {eta}{" "}
                  {i18n.t("stationSelect.arrivalShort", {
                    defaultValue: "도착",
                  })}
                </Text>
              </View>
              <View className="items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-green-50">
                  <MapPin color="#16A34A" size={20} />
                </View>
                <Text className="mt-2 font-bold text-gray-900 text-lg dark:text-gray-100">
                  {routeInfo.totalStations}
                  <Text className="font-normal text-gray-500 text-sm">
                    {i18n.t("routeResult.stationUnit")}
                  </Text>
                </Text>
              </View>
              <View className="items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                  <Repeat color="#EA580C" size={20} />
                </View>
                <Text className="mt-2 font-bold text-gray-900 text-lg dark:text-gray-100">
                  {routeInfo.transfers}
                  <Text className="font-normal text-gray-500 text-sm">
                    {i18n.t("routeResult.transferUnit")}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Next departures */}
            <DepartureStrip
              lineColor={startStation.lineColor}
              lineName={startStation.line}
              stationName={startStation.name}
            />

            {/* Favorite button */}
            <View className="mt-6">
              <Pressable
                className={`flex-row items-center justify-center gap-2 rounded-2xl py-3.5 ${
                  isFavorite
                    ? "bg-red-500"
                    : "border-2 border-gray-100 bg-white dark:bg-gray-800"
                }`}
                onPress={handleToggleFavorite}
                style={{
                  shadowColor: isFavorite ? "#EF4444" : "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isFavorite ? 0.2 : 0.05,
                  shadowRadius: 10,
                  elevation: 2,
                }}
              >
                <Heart
                  color={isFavorite ? "#FFFFFF" : "#374151"}
                  fill={isFavorite ? "#FFFFFF" : "transparent"}
                  size={20}
                />
                <Text
                  className={`font-semibold text-base ${
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
          <View className="mb-6">
            <Text className="mb-4 font-bold text-gray-900 text-xl dark:text-gray-100">
              {i18n.t("routeResult.detailRoute")}
            </Text>

            <ElevatedCard className="p-5">
              <View>
                {groupedSegments.map((group, index) => (
                  <CollapsibleRouteSegment
                    group={group}
                    key={`group-${index}-${group.start.station.id}`}
                  />
                ))}

                {/* Final Destination */}
                <View className="relative">
                  <View className="flex-row gap-4">
                    <View
                      className="h-8 w-8 items-center justify-center rounded-full border-4 border-white"
                      style={{
                        backgroundColor: endStation.lineColor,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    >
                      <MapPin color="white" fill="white" size={14} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="font-bold text-gray-900 text-lg dark:text-gray-100">
                          {endStation.name}
                        </Text>
                        <LineBadge
                          color={endStation.lineColor}
                          line={endStation.line}
                        />
                      </View>
                      <Text className="mt-1 text-gray-400 text-xs">
                        {i18n.t("stationSelect.arrivalShort")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ElevatedCard>
          </View>

          {/* New search button */}
          <Pressable
            className="w-full items-center rounded-2xl bg-blue-600 py-4 shadow-lg active:bg-blue-700"
            onPress={() => router.back()}
            style={{
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="font-bold text-lg text-white">
              {i18n.t("routeResult.newSearch")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
