import type { NearbyStation } from "@/types/station";
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
import { stations } from "@/data/stations";
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

async function resolveNearbyStations(): Promise<LocationState> {
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

  const [locationState, setLocationState] = useState<LocationState>({
    status: "loading",
  });

  // Fetch GPS on mount
  useEffect(() => {
    let cancelled = false;
    resolveNearbyStations()
      .then((s) => {
        if (!cancelled) setLocationState(s);
      })
      .catch(() => {
        if (!cancelled) setLocationState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Compute route recommendations whenever nearby + destination are ready
  const recommendations: RouteRecommendation[] = useMemo(() => {
    if (locationState.status !== "ready" || !endStation) return [];
    return recommendRoutes(locationState.nearby, endStation);
  }, [locationState, endStation]);

  const handleRefresh = useCallback(() => {
    setLocationState({ status: "loading" });
    resolveNearbyStations()
      .then(setLocationState)
      .catch(() => setLocationState({ status: "error" }));
  }, []);

  const handleSelectDestination = useCallback(() => {
    router.push({
      pathname: "/station-select" as const,
      params: { type: "end" },
    } as never);
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
          paddingBottom: insets.bottom + 32,
        }}
      >
        <View className="px-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="mb-1 font-bold text-3xl text-gray-900">
              {i18n.t("goNow.title")}
            </Text>
            <Text className="text-base text-gray-600">
              {i18n.t("goNow.subtitle")}
            </Text>
          </View>

          {/* GPS status indicator */}
          <GpsStatusBar
            isReady={isReady}
            nearbyCount={
              locationState.status === "ready" ? locationState.nearby.length : 0
            }
            onRefresh={handleRefresh}
            status={locationState.status}
          />

          {/* ── Destination input (hero) ─────────────────── */}
          <View className="mb-6">
            <View className="mb-3 flex-row items-center gap-2">
              <MapPin color="#F59E0B" fill="#F59E0B" size={16} />
              <Text className="font-semibold text-gray-900 text-sm">
                {i18n.t("goNow.destinationTitle")}
              </Text>
            </View>
            <Pressable onPress={handleSelectDestination}>
              <ElevatedCard
                className={endStation ? "border-2 border-amber-300" : ""}
              >
                {endStation ? (
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="mb-1 text-gray-400 text-xs">
                        {i18n.t("goNow.destination")}
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
                    <ChevronRight color="#9CA3AF" size={20} />
                  </View>
                ) : (
                  <View className="flex-row items-center justify-between py-3">
                    <Text className="text-gray-400 text-lg">
                      {i18n.t("goNow.destinationPlaceholder")}
                    </Text>
                    <ChevronRight color="#9CA3AF" size={20} />
                  </View>
                )}
              </ElevatedCard>
            </Pressable>
          </View>

          {/* ── Route recommendations ────────────────────── */}
          {endStation && locationState.status === "loading" && (
            <ElevatedCard>
              <View className="items-center gap-3 py-6">
                <ActivityIndicator color="#2563EB" size="small" />
                <Text className="text-gray-500 text-sm">
                  {i18n.t("goNow.calculatingRoutes")}
                </Text>
              </View>
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
              <View className="mb-3 flex-row items-center gap-2">
                <Route color="#2563EB" size={16} />
                <Text className="font-semibold text-gray-900 text-sm">
                  {i18n.t("goNow.recommendedRoutes")}
                </Text>
              </View>
              <View className="gap-3">
                {recommendations.map((rec, index) => (
                  <RouteCard
                    index={index}
                    key={`rec-${rec.departure.station.id}-${rec.departure.station.line}`}
                    onPress={handleTapRoute}
                    rec={rec}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Hint when no destination */}
          {!endStation && isReady && (
            <View className="mt-2 items-center">
              <Text className="text-center text-gray-500 text-sm">
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
    <View className="mb-5 flex-row items-center justify-between rounded-2xl bg-white/70 px-4 py-3">
      <View className="flex-row items-center gap-2">
        {status === "loading" && (
          <>
            <ActivityIndicator color="#2563EB" size="small" />
            <Text className="text-gray-600 text-sm">
              {i18n.t("goNow.locating")}
            </Text>
          </>
        )}
        {isReady && (
          <>
            <View className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <Text className="text-gray-700 text-sm">
              {i18n.t("goNow.locationReady", { count: nearbyCount })}
            </Text>
          </>
        )}
        {status === "denied" && (
          <>
            <View className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <Text className="text-gray-600 text-sm">
              {i18n.t("goNow.permissionDenied")}
            </Text>
          </>
        )}
        {status === "error" && (
          <>
            <View className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <Text className="text-gray-600 text-sm">
              {i18n.t("goNow.locationError")}
            </Text>
          </>
        )}
      </View>
      {(isReady || status === "error") && (
        <Pressable
          accessibilityLabel={i18n.t("goNow.refresh")}
          className="rounded-full p-1.5 active:bg-gray-200"
          onPress={onRefresh}
        >
          <RefreshCw color="#6B7280" size={16} />
        </Pressable>
      )}
    </View>
  );
}

const RANK_LABELS = ["최적", "2nd", "3rd", "4th"] as const;
const RANK_COLORS = ["#2563EB", "#6B7280", "#6B7280", "#6B7280"] as const;

function RouteCard({
  rec,
  index,
  onPress,
}: {
  rec: RouteRecommendation;
  index: number;
  onPress: (rec: RouteRecommendation) => void;
}) {
  const isBest = index === 0;
  return (
    <Pressable onPress={() => onPress(rec)}>
      <ElevatedCard className={isBest ? "border-2 border-blue-200" : ""}>
        {/* Top: rank + total time */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: RANK_COLORS[index] ?? "#6B7280" }}
            >
              <Text className="font-bold text-white text-xs">
                {RANK_LABELS[index] ?? `${index + 1}th`}
              </Text>
            </View>
            <Text
              className={`font-bold text-lg ${isBest ? "text-blue-900" : "text-gray-900"}`}
            >
              {i18n.t("goNow.totalMin", { min: rec.totalMinutes })}
            </Text>
          </View>
          <ChevronRight color="#9CA3AF" size={18} />
        </View>

        {/* Middle: breakdown */}
        <View className="mb-2 flex-row items-center gap-2">
          {/* Walking segment */}
          <View className="flex-row items-center gap-1 rounded-lg bg-gray-100 px-2 py-1">
            <Footprints color="#6B7280" size={12} />
            <Text className="text-gray-600 text-xs">
              {i18n.t("goNow.walkMin", { min: rec.walkingMinutes })}
            </Text>
          </View>
          <Text className="text-gray-400">+</Text>
          {/* Subway segment */}
          <View className="flex-row items-center gap-1 rounded-lg bg-gray-100 px-2 py-1">
            <Clock color="#6B7280" size={12} />
            <Text className="text-gray-600 text-xs">
              {i18n.t("goNow.subwayMin", { min: rec.route.totalTime })}
            </Text>
          </View>
          {rec.route.transfers > 0 && (
            <>
              <Text className="text-gray-400">·</Text>
              <Text className="text-gray-500 text-xs">
                {i18n.t("goNow.transferCount", {
                  count: rec.route.transfers,
                })}
              </Text>
            </>
          )}
        </View>

        {/* Bottom: departure station info */}
        <View className="flex-row items-center gap-2 rounded-xl bg-blue-50/70 px-3 py-2">
          <Navigation color="#2563EB" size={14} />
          <Text className="font-medium text-blue-900 text-sm">
            {rec.departure.station.name}
          </Text>
          <LineBadge
            color={rec.departure.station.lineColor}
            line={rec.departure.station.line}
          />
          <Text className="text-blue-600 text-xs">
            {formatDistance(rec.departure.distanceM)}
          </Text>
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
    <ElevatedCard className="mb-4">
      <View className="items-center gap-2 py-4">
        <View
          className={`h-12 w-12 items-center justify-center rounded-full ${
            isDenied ? "bg-amber-100" : "bg-red-100"
          }`}
        >
          <AlertCircle color={isDenied ? "#D97706" : "#DC2626"} size={24} />
        </View>
        <Text className="font-medium text-gray-900 text-sm">
          {isDenied
            ? i18n.t("goNow.permissionDenied")
            : i18n.t("goNow.locationError")}
        </Text>
        <Text className="text-center text-gray-500 text-xs">
          {isDenied
            ? i18n.t("goNow.permissionDeniedHint")
            : i18n.t("goNow.locationErrorHint")}
        </Text>
        <Pressable
          className="mt-1 rounded-full bg-blue-600 px-5 py-1.5 active:bg-blue-700"
          onPress={onRetry}
        >
          <Text className="font-medium text-sm text-white">
            {i18n.t("goNow.retry")}
          </Text>
        </Pressable>
      </View>
    </ElevatedCard>
  );
}
