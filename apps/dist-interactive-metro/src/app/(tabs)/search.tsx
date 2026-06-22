import type { Station } from "@/types/station";

import { useFocusEffect, useRouter } from "expo-router";
import {
  ArrowDownUp,
  Circle,
  Clock,
  MapPin,
  Navigation,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ElevatedCard } from "@/components/ui/elevated-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { StationLineBadges } from "@/components/ui/station-line-badges";
import { useRouteSearch } from "@/context/route-search-context";
import { clearRecentStations, getRecentStations } from "@/data/recent-stations";
import i18n from "@/i18n";

// ── Sub-components ──────────────────────────────────────────

interface StationInputProps {
  label: string;
  station: Station | null;
  placeholder: string;
  type: "start" | "end";
  onPress: () => void;
  onClear: () => void;
}

function StationInput({
  label,
  station,
  placeholder,
  type,
  onPress,
  onClear,
}: StationInputProps) {
  const isStart = type === "start";
  return (
    <View className="relative">
      <Pressable
        className={`relative flex-row items-center py-5 pr-14 pl-14 active:bg-blue-50/50 dark:active:bg-blue-900/20 ${
          station ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
        }`}
        onPress={onPress}
      >
        <View className="absolute top-1/2 left-5 z-10 -translate-y-1/2">
          {isStart ? (
            <View
              className="h-4 w-4 rounded-full border-2 border-white bg-blue-500"
              style={{
                shadowColor: "#3B82F6",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
              }}
            />
          ) : (
            <MapPin color="#F59E0B" fill="#F59E0B" size={18} />
          )}
        </View>
        <View className="flex-1">
          <Text className="mb-1 font-medium text-gray-400 text-xs uppercase tracking-wider">
            {label}
          </Text>
          {station ? (
            <View className="flex-row items-center gap-2">
              <Text className="font-bold text-gray-900 text-lg dark:text-gray-100">
                {station.name}
              </Text>
              <StationLineBadges station={station} />
            </View>
          ) : (
            <Text className="text-gray-400 text-lg">{placeholder}</Text>
          )}
        </View>
      </Pressable>
      {station && (
        <Pressable
          className="absolute top-1/2 right-4 z-20 h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 dark:bg-gray-700"
          onPress={onClear}
        >
          <X color="#9CA3AF" size={16} />
        </Pressable>
      )}
    </View>
  );
}

function RecentStationsList({
  stations,
  onPress,
  onClear,
}: {
  stations: Station[];
  onPress: (s: Station) => void;
  onClear: () => void;
}) {
  if (stations.length === 0) return null;

  return (
    <View className="mb-8">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Clock color="#6B7280" size={16} />
          <Text className="font-bold text-gray-900 text-lg dark:text-gray-100">
            {i18n.t("stationSelect.recentStations")}
          </Text>
        </View>
        <Pressable
          className="flex-row items-center gap-1 rounded-full bg-gray-100 px-3 py-1 active:bg-gray-200 dark:bg-gray-800"
          onPress={onClear}
        >
          <Trash2 color="#9CA3AF" size={12} />
          <Text className="font-medium text-gray-500 text-xs">
            {i18n.t("settings.clearRecentSearch")}
          </Text>
        </Pressable>
      </View>
      <ScrollView
        className="-mx-6 px-6"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View className="flex-row gap-3">
          {stations.map((station) => (
            <Pressable
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm active:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              key={station.id}
              onPress={() => onPress(station)}
            >
              <Text className="mb-2 font-bold text-base text-gray-900 dark:text-gray-100">
                {station.name}
              </Text>
              <StationLineBadges size="sm" station={station} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ViaInput({
  viaStation,
  showVia,
  onPress,
  onClear,
  onShow,
}: {
  viaStation: Station | null;
  showVia: boolean;
  onPress: () => void;
  onClear: () => void;
  onShow: () => void;
}) {
  if (!(showVia || viaStation)) {
    return (
      <View className="mt-4 items-center">
        <Pressable
          className="flex-row items-center gap-1.5 rounded-full px-4 py-2 active:bg-gray-100 dark:active:bg-gray-800"
          onPress={onShow}
        >
          <Plus color="#6B7280" size={16} />
          <Text className="font-medium text-gray-500 text-sm">
            {i18n.t("stationSelect.addVia", { defaultValue: "경유지 추가" })}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="mt-4 flex-row items-center gap-2">
      <Pressable
        className={`flex-1 flex-row items-center rounded-2xl border-2 border-dashed px-4 py-3 active:bg-gray-50 dark:active:bg-gray-800 ${
          viaStation ? "border-blue-200 bg-blue-50/30" : "border-gray-200"
        }`}
        onPress={onPress}
      >
        <Circle
          className="mr-3"
          color={viaStation ? "#3B82F6" : "#9CA3AF"}
          size={16}
        />
        <View className="flex-1">
          {viaStation ? (
            <View className="flex-row items-center gap-2">
              <Text className="font-bold text-gray-700 dark:text-gray-200">
                {viaStation.name}
              </Text>
              <StationLineBadges size="sm" station={viaStation} />
            </View>
          ) : (
            <Text className="text-gray-500 text-sm">
              {i18n.t("stationSelect.viaShort")} ({i18n.t("via.optional")})
            </Text>
          )}
        </View>
      </Pressable>
      <Pressable
        className="h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 active:bg-gray-200 dark:bg-gray-800"
        onPress={onClear}
      >
        <X color="#9CA3AF" size={20} />
      </Pressable>
    </View>
  );
}

// ── Main Component ──────────────────────────────────────────

export default function RouteGuideTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    startStation,
    viaStation,
    endStation,
    swapStations,
    setStartStation,
    setViaStation,
    setEndStation,
    canSearch,
  } = useRouteSearch();

  const [recentStations, setRecentStations] = useState<Station[]>([]);
  const [showVia, setShowVia] = useState(!!viaStation);

  useFocusEffect(
    useCallback(() => {
      getRecentStations().then(setRecentStations);
    }, []),
  );

  const handleStationSelect = useCallback(
    (type: "start" | "via" | "end") => {
      router.push({
        pathname: "/station-select",
        params: { type },
      });
    },
    [router],
  );

  const handleRecentPress = useCallback(
    (station: Station) => {
      if (!startStation) {
        setStartStation(station);
      } else if (!endStation && startStation.id !== station.id) {
        setEndStation(station);
      } else {
        setStartStation(station);
      }
    },
    [startStation, endStation, setStartStation, setEndStation],
  );

  const handleClearRecent = useCallback(async () => {
    await clearRecentStations();
    setRecentStations([]);
  }, []);

  const handleSearch = useCallback(() => {
    if (!(canSearch && startStation && endStation)) return;
    router.push({
      pathname: "/route-result",
      params: {
        start: startStation.id,
        end: endStation.id,
        ...(viaStation && { via: viaStation.id }),
      },
    });
  }, [canSearch, startStation, endStation, viaStation, router]);

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
          <View className="mb-8">
            <Text className="mb-2 font-bold text-3xl text-gray-900 dark:text-gray-100">
              {i18n.t("homeScreen.title")}
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400">
              {i18n.t("homeScreen.subtitle")}
            </Text>
          </View>

          <View className="mb-8">
            <ElevatedCard className="overflow-hidden p-0">
              <View>
                <StationInput
                  label={i18n.t("stationSelect.departureShort")}
                  onClear={() => setStartStation(null)}
                  onPress={() => handleStationSelect("start")}
                  placeholder={i18n.t("homeScreen.departurePlaceholder")}
                  station={startStation}
                  type="start"
                />

                <View className="relative h-2 items-center justify-center">
                  <View className="h-full w-[2px] bg-gray-100 dark:bg-gray-700" />
                  <Pressable
                    className="absolute z-20 h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-gray-50 shadow-sm active:bg-gray-100 dark:border-gray-800 dark:bg-gray-700"
                    onPress={swapStations}
                  >
                    <ArrowDownUp color="#6B7280" size={18} />
                  </Pressable>
                </View>

                <StationInput
                  label={i18n.t("stationSelect.arrivalShort")}
                  onClear={() => setEndStation(null)}
                  onPress={() => handleStationSelect("end")}
                  placeholder={i18n.t("homeScreen.arrivalPlaceholder")}
                  station={endStation}
                  type="end"
                />
              </View>
            </ElevatedCard>

            <Pressable
              className="mt-3 flex-row items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/60 py-3 active:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-900/20"
              onPress={() => router.push("/departure-select")}
            >
              <Navigation color="#2563EB" size={16} />
              <Text className="font-semibold text-blue-600 text-sm">
                {i18n.t("homeScreen.useCurrentLocation")}
              </Text>
            </Pressable>

            <ViaInput
              onClear={() => {
                setViaStation(null);
                setShowVia(false);
              }}
              onPress={() => handleStationSelect("via")}
              onShow={() => setShowVia(true)}
              showVia={showVia}
              viaStation={viaStation}
            />
          </View>

          <RecentStationsList
            onClear={handleClearRecent}
            onPress={handleRecentPress}
            stations={recentStations}
          />

          <View>
            <Pressable
              className={`w-full flex-row items-center justify-center gap-3 rounded-2xl py-4.5 ${
                canSearch
                  ? "bg-blue-600 shadow-blue-500/40 active:bg-blue-700"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              disabled={!canSearch}
              onPress={handleSearch}
              style={{
                shadowColor: canSearch ? "#3B82F6" : "transparent",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: canSearch ? 0.3 : 0,
                shadowRadius: 12,
                elevation: canSearch ? 8 : 0,
              }}
            >
              <Navigation
                color={canSearch ? "#FFFFFF" : "#9CA3AF"}
                fill={canSearch ? "#FFFFFF" : "transparent"}
                size={22}
              />
              <Text
                className={`font-bold text-xl ${
                  canSearch ? "text-white" : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {i18n.t("homeScreen.search")}
              </Text>
            </Pressable>

            {!canSearch && (
              <Text className="mt-4 text-center font-medium text-gray-400 text-sm">
                {i18n.t("homeScreen.searchHint")}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
