import type { NearbyStation, Station } from "@/types/station";
import type { RouteRecommendation } from "@/utils/route-calculator";

import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ChevronRight,
  Clock,
  Footprints,
  MapPin,
  Navigation,
  RefreshCw,
  Route,
  Zap,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useStations } from "@/data/station-store";
import { useStationTimetable } from "@/hooks/use-station-timetable";
import i18n from "@/i18n";
import { findNearestStations, formatDistance } from "@/utils/geo";
import { recommendRoutes } from "@/utils/route-calculator";

// ── Location helpers ────────────────────────────────────────

type LocationState =
  | { status: "loading" }
  | { status: "ready"; nearby: NearbyStation[] }
  | { status: "denied" }
  | { status: "error" };

const NEARBY_COUNT = 4;

async function resolveNearbyStations(
  stations: Station[],
): Promise<LocationState> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return { status: "denied" };

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const nearby = findNearestStations(
    location.coords.latitude,
    location.coords.longitude,
    stations,
    NEARBY_COUNT,
  );
  return { status: "ready", nearby };
}

// ── Main component ──────────────────────────────────────────

export default function GoNowTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { endStation, setStartStation } = useRouteSearch();
  const stations = useStations();

  const [locationState, setLocationState] = useState<LocationState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;
    if (stations.length === 0) return;

    resolveNearbyStations(stations)
      .then((s) => {
        if (!cancelled) setLocationState(s);
      })
      .catch(() => {
        if (!cancelled) setLocationState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [stations]);

  const recommendations: RouteRecommendation[] = useMemo(() => {
    if (locationState.status !== "ready" || !endStation) return [];
    return recommendRoutes(locationState.nearby, endStation);
  }, [locationState, endStation]);

  const handleRefresh = useCallback(() => {
    if (stations.length === 0) return;
    setLocationState({ status: "loading" });
    resolveNearbyStations(stations)
      .then(setLocationState)
      .catch(() => setLocationState({ status: "error" }));
  }, [stations]);

  const handleSelectDestination = useCallback(() => {
    router.push({
      pathname: "/station-select",
      params: { type: "end" },
    });
  }, [router]);

  const handleTapRoute = useCallback(
    (rec: RouteRecommendation) => {
      setStartStation(rec.departure.station);
      router.push({
        pathname: "/route-result",
        params: {
          start: rec.departure.station.id,
          end: endStation?.id ?? "",
        },
      });
    },
    [setStartStation, endStation, router],
  );

  const isReady = locationState.status === "ready";

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
        <View className="px-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="mb-2 font-bold text-3xl text-gray-900 dark:text-gray-100">
              {i18n.t("goNow.title")}
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400">
              {i18n.t("goNow.subtitle")}
            </Text>
          </View>

          {/* Location Status Bar */}
          <GpsStatusBar
            isReady={isReady}
            nearbyCount={
              locationState.status === "ready" ? locationState.nearby.length : 0
            }
            onRefresh={handleRefresh}
            status={locationState.status}
          />

          {/* Destination Hero */}
          <View className="mb-8">
            <View className="mb-3 flex-row items-center gap-2">
              <Zap color="#F59E0B" fill="#F59E0B" size={16} />
              <Text className="font-bold text-gray-900 text-sm dark:text-gray-100">
                {i18n.t("goNow.destinationTitle")}
              </Text>
            </View>
            <Pressable onPress={handleSelectDestination}>
              <ElevatedCard
                className={`overflow-hidden p-0 ${endStation ? "border-2 border-amber-400" : ""}`}
                style={{
                  shadowColor: endStation ? "#F59E0B" : "#000",
                  shadowOpacity: endStation ? 0.2 : 0.05,
                  shadowRadius: endStation ? 12 : 8,
                }}
              >
                <View className="flex-row items-center py-5 pr-6 pl-14">
                  <View className="absolute top-1/2 left-5 z-10 -translate-y-1/2">
                    <MapPin color="#F59E0B" fill="#F59E0B" size={20} />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 font-medium text-gray-400 text-xs uppercase tracking-wider">
                      {i18n.t("goNow.destination")}
                    </Text>
                    {endStation ? (
                      <View className="flex-row items-center gap-2">
                        <Text className="font-bold text-gray-900 text-xl dark:text-gray-100">
                          {endStation.name}
                        </Text>
                        <LineBadge
                          color={endStation.lineColor}
                          line={endStation.line}
                        />
                      </View>
                    ) : (
                      <Text className="text-gray-400 text-lg">
                        {i18n.t("goNow.destinationPlaceholder")}
                      </Text>
                    )}
                  </View>
                  <ChevronRight color="#D1D5DB" size={24} />
                </View>
              </ElevatedCard>
            </Pressable>
          </View>

          {/* Results Area */}
          {endStation && locationState.status === "loading" && (
            <ElevatedCard className="py-10">
              <ActivityIndicator color="#2563EB" size="large" />
              <Text className="mt-4 text-center font-medium text-gray-500">
                {i18n.t("goNow.calculatingRoutes")}
              </Text>
            </ElevatedCard>
          )}

          {locationState.status === "denied" && (
            <LocationFallback onRetry={handleRefresh} variant="denied" />
          )}

          {locationState.status === "error" && (
            <LocationFallback onRetry={handleRefresh} variant="error" />
          )}

          {recommendations.length > 0 && (
            <View>
              <View className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Route color="#2563EB" size={18} />
                  <Text className="font-bold text-gray-900 text-lg dark:text-gray-100">
                    {i18n.t("goNow.recommendedRoutes")}
                  </Text>
                </View>
              </View>
              <View className="gap-4">
                {recommendations.map((rec, index) => (
                  <RouteCard
                    destination={endStation!}
                    index={index}
                    key={`rec-${rec.departure.station.id}-${rec.departure.station.line}`}
                    onPress={handleTapRoute}
                    rec={rec}
                  />
                ))}
              </View>
            </View>
          )}

          {!endStation && isReady && (
            <View className="mt-8 items-center rounded-2xl border-2 border-gray-200 border-dashed bg-white/50 p-8 dark:border-gray-800 dark:bg-gray-900/50">
              <Navigation className="mb-4" color="#D1D5DB" size={48} />
              <Text className="text-center font-medium text-gray-500 text-sm">
                {i18n.t("goNow.selectDestinationHint")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

// ── Sub-components ──────────────────────────────────────────

function GpsStatusBar({
  status,
  isReady,
  nearbyCount,
  onRefresh,
}: {
  status: LocationState["status"];
  isReady: boolean;
  nearbyCount: number;
  onRefresh: () => void;
}) {
  return (
    <View className="mb-6 flex-row items-center justify-between rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-gray-800/80">
      <View className="flex-row items-center gap-3">
        {status === "loading" && (
          <>
            <ActivityIndicator color="#2563EB" size="small" />
            <Text className="font-medium text-gray-600 text-sm dark:text-gray-300">
              {i18n.t("goNow.locating")}
            </Text>
          </>
        )}
        {isReady && (
          <>
            <View className="h-3 w-3 rounded-full bg-green-500 shadow-sm" />
            <Text className="font-bold text-gray-800 text-sm dark:text-gray-100">
              {i18n.t("goNow.locationReady", { count: nearbyCount })}
            </Text>
          </>
        )}
        {(status === "denied" || status === "error") && (
          <>
            <View
              className={`h-3 w-3 rounded-full ${status === "denied" ? "bg-amber-500" : "bg-red-500"}`}
            />
            <Text className="font-medium text-gray-600 text-sm dark:text-gray-300">
              {status === "denied"
                ? i18n.t("goNow.permissionDenied")
                : i18n.t("goNow.locationError")}
            </Text>
          </>
        )}
      </View>
      {(isReady || status === "error") && (
        <Pressable
          accessibilityLabel={i18n.t("goNow.refresh")}
          className="h-8 w-8 items-center justify-center rounded-full bg-gray-50 active:bg-gray-200 dark:bg-gray-700 dark:active:bg-gray-600"
          onPress={onRefresh}
        >
          <RefreshCw color="#6B7280" size={16} />
        </Pressable>
      )}
    </View>
  );
}

const RANK_LABELS = ["최적", "추천", "추천", "추천"] as const;
const RANK_COLORS = ["#2563EB", "#64748B", "#64748B", "#64748B"] as const;

function formatArrivalTime(totalMinutes: number): string {
  const arrival = new Date(Date.now() + totalMinutes * 60_000);
  const h = arrival.getHours().toString().padStart(2, "0");
  const m = arrival.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

function RouteCard({
  rec,
  index,
  destination,
  onPress,
}: {
  rec: RouteRecommendation;
  index: number;
  destination: Station;
  onPress: (rec: RouteRecommendation) => void;
}) {
  const isBest = index === 0;

  const { departures } = useStationTimetable(
    rec.departure.station.name,
    rec.departure.station.line,
    5,
    destination.name,
  );

  // First train we can actually board after walking to the station
  const catchable = departures.find(
    (d) => d.minutesFromNow >= rec.walkingMinutes,
  );
  const waitMinutes =
    catchable != null ? catchable.minutesFromNow - rec.walkingMinutes : null;
  const realTotalMinutes =
    waitMinutes != null
      ? rec.walkingMinutes + waitMinutes + rec.route.totalTime
      : null;
  const displayTotal = realTotalMinutes ?? rec.totalMinutes;
  const arrivalTime = formatArrivalTime(displayTotal);

  return (
    <Pressable onPress={() => onPress(rec)}>
      <ElevatedCard
        className={`p-5 ${isBest ? "border-2 border-blue-100 bg-white" : "bg-white/80"}`}
      >
        {/* Rank & Time */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <View
              className="rounded-full px-2.5 py-0.5"
              style={{ backgroundColor: RANK_COLORS[index] ?? "#64748B" }}
            >
              <Text className="font-bold text-[10px] text-white uppercase">
                {RANK_LABELS[index] ?? `${index + 1}TH`}
              </Text>
            </View>
            <Text
              className={`font-bold text-2xl ${isBest ? "text-blue-600" : "text-gray-900 dark:text-gray-100"}`}
            >
              {displayTotal}
              <Text className="font-medium text-gray-500 text-sm">분</Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="rounded-lg bg-gray-100 px-2.5 py-1 dark:bg-gray-700">
              <Text className="font-bold text-gray-700 text-sm dark:text-gray-200">
                도착 {arrivalTime}
              </Text>
            </View>
            <ChevronRight color="#D1D5DB" size={20} />
          </View>
        </View>

        {/* Breakdown Row */}
        <View className="mb-5 flex-row flex-wrap items-center gap-2">
          <View className="flex-row items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 dark:bg-gray-900/50">
            <Footprints color="#6B7280" size={14} />
            <Text className="font-medium text-gray-600 text-xs dark:text-gray-400">
              도보 {rec.walkingMinutes}분
            </Text>
          </View>
          {waitMinutes != null && (
            <View className="flex-row items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 dark:bg-amber-900/20">
              <Clock color="#D97706" size={14} />
              <Text className="font-medium text-amber-700 text-xs dark:text-amber-400">
                대기 {waitMinutes}분
              </Text>
            </View>
          )}
          <View className="flex-row items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 dark:bg-gray-900/50">
            <Clock color="#6B7280" size={14} />
            <Text className="font-medium text-gray-600 text-xs dark:text-gray-400">
              지하철 {rec.route.totalTime}분
            </Text>
          </View>
          {rec.route.transfers > 0 && (
            <View className="flex-row items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 dark:bg-gray-900/50">
              <Text className="font-medium text-gray-600 text-xs dark:text-gray-400">
                환승 {rec.route.transfers}회
              </Text>
            </View>
          )}
        </View>

        {/* Departure Station Detail */}
        <View className="flex-row items-center gap-3 rounded-2xl bg-blue-50/50 p-4 dark:bg-blue-900/10">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
            <Navigation color="#2563EB" fill="#2563EB" size={18} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-bold text-base text-gray-900 dark:text-gray-100">
                {rec.departure.station.name}
              </Text>
              <LineBadge
                color={rec.departure.station.lineColor}
                line={rec.departure.station.line}
                size="sm"
              />
            </View>
            <Text className="font-medium text-blue-600 text-xs">
              현위치에서 {formatDistance(rec.departure.distanceM)}
            </Text>
          </View>
        </View>
      </ElevatedCard>
    </Pressable>
  );
}

function LocationFallback({
  variant,
  onRetry,
}: {
  variant: "denied" | "error";
  onRetry: () => void;
}) {
  const isDenied = variant === "denied";
  return (
    <ElevatedCard className="mb-6 p-6">
      <View className="items-center">
        <View
          className={`mb-4 h-16 w-16 items-center justify-center rounded-full ${isDenied ? "bg-amber-100" : "bg-red-100"}`}
        >
          <AlertCircle color={isDenied ? "#D97706" : "#DC2626"} size={32} />
        </View>
        <Text className="mb-2 font-bold text-gray-900 text-lg dark:text-gray-100">
          {isDenied
            ? i18n.t("goNow.permissionDenied")
            : i18n.t("goNow.locationError")}
        </Text>
        <Text className="mb-6 text-center text-gray-500 text-sm leading-5">
          {isDenied
            ? i18n.t("goNow.permissionDeniedHint")
            : i18n.t("goNow.locationErrorHint")}
        </Text>
        <Pressable
          className="w-full rounded-2xl bg-blue-600 py-4 shadow-blue-500/30 shadow-lg active:bg-blue-700"
          onPress={onRetry}
        >
          <Text className="text-center font-bold text-base text-white">
            {i18n.t("goNow.retry")}
          </Text>
        </Pressable>
      </View>
    </ElevatedCard>
  );
}
