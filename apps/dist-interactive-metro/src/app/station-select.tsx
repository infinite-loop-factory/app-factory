import type { Station } from "@/types/station";

import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Clock, Search, X } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LineBadge } from "@/components/ui/line-badge";
import { useRouteSearch } from "@/context/route-search-context";
import { addRecentStation, getRecentStations } from "@/data/recent-stations";
import { lines, searchStations } from "@/data/stations";
import i18n from "@/i18n";

export default function StationSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type: "start" | "via" | "end" }>();

  const { setStartStation, setViaStation, setEndStation } = useRouteSearch();

  const [keyword, setKeyword] = useState("");
  const [recentStations, setRecentStations] = useState<Station[]>([]);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  useEffect(() => {
    getRecentStations().then(setRecentStations);
  }, []);

  const searchResults = useMemo(() => {
    if (!keyword.trim()) return [];
    return searchStations(keyword);
  }, [keyword]);

  const filterByLine = useCallback(
    (list: Station[]) => {
      if (!selectedLine) return list;
      return list.filter((s) => s.line === selectedLine);
    },
    [selectedLine],
  );

  const displayStations = useMemo(
    () => filterByLine(keyword.trim() ? searchResults : recentStations),
    [filterByLine, keyword, searchResults, recentStations],
  );

  const title = useMemo(() => {
    switch (type) {
      case "start":
        return i18n.t("stationSelect.departureTitle");
      case "via":
        return i18n.t("stationSelect.viaTitle");
      case "end":
        return i18n.t("stationSelect.arrivalTitle");
      default:
        return i18n.t("stationSelect.departureTitle");
    }
  }, [type]);

  const handleSelectStation = useCallback(
    async (station: Station) => {
      await addRecentStation(station);
      switch (type) {
        case "start":
          setStartStation(station);
          break;
        case "via":
          setViaStation(station);
          break;
        case "end":
          setEndStation(station);
          break;
      }
      router.back();
    },
    [type, setStartStation, setViaStation, setEndStation, router],
  );

  const renderStationItem = useCallback(
    ({ item }: { item: Station }) => (
      <Pressable
        className="border-gray-100 border-b px-6 py-4 active:bg-gray-50"
        onPress={() => handleSelectStation(item)}
      >
        <Text className="mb-1 text-gray-900 text-lg">{item.name}</Text>
        <View className="flex-row items-center gap-2">
          <LineBadge color={item.lineColor} line={item.line} />
          {item.connections && item.connections.length > 0 && (
            <Text className="text-gray-500 text-xs">
              {i18n.t("stationSelect.transfer")}: {item.connections.join(", ")}
            </Text>
          )}
        </View>
      </Pressable>
    ),
    [handleSelectStation],
  );

  const keyExtractor = useCallback(
    (item: Station, index: number) => `${item.id}-${index}`,
    [],
  );

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Sticky header */}
      <View
        className="z-20 bg-white pb-3"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View className="px-4 pt-4">
          {/* Back + title */}
          <View className="mb-4 flex-row items-center gap-3">
            <Pressable
              accessibilityLabel={i18n.t("common.back")}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
              onPress={() => router.back()}
            >
              <ArrowLeft color="#111827" size={20} />
            </Pressable>
            <Text className="font-medium text-gray-900 text-xl">{title}</Text>
          </View>

          {/* Search input */}
          <View className="relative">
            <View className="absolute top-1/2 left-4 z-10 -translate-y-1/2">
              <Search color="#9CA3AF" size={20} />
            </View>
            <TextInput
              autoFocus
              className="w-full rounded-full bg-gray-100 py-3 pr-12 pl-12 text-base text-gray-900"
              onChangeText={setKeyword}
              placeholder={i18n.t("stationSelect.searchPlaceholder")}
              placeholderTextColor="#9CA3AF"
              value={keyword}
            />
            {keyword.length > 0 && (
              <Pressable
                className="absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 active:bg-gray-400"
                onPress={() => setKeyword("")}
              >
                <X color="#FFFFFF" size={14} />
              </Pressable>
            )}
          </View>

          {/* Line filter tabs */}
          <ScrollView
            className="mt-4"
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <Pressable
              className={`rounded-full px-4 py-2 ${
                selectedLine === null
                  ? "bg-blue-600"
                  : "bg-gray-100 active:bg-gray-200"
              }`}
              onPress={() => setSelectedLine(null)}
            >
              <Text
                className={`font-medium text-sm ${
                  selectedLine === null ? "text-white" : "text-gray-700"
                }`}
              >
                {i18n.t("stationSelect.allLines")}
              </Text>
            </Pressable>
            {lines.map((line) => (
              <Pressable
                className="rounded-full px-4 py-2"
                key={line.id}
                onPress={() => setSelectedLine(line.name)}
                style={
                  selectedLine === line.name
                    ? { backgroundColor: line.color }
                    : { backgroundColor: "#F3F4F6" }
                }
              >
                <Text
                  className={`font-medium text-sm ${
                    selectedLine === line.name ? "text-white" : "text-gray-700"
                  }`}
                >
                  {line.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Station list */}
      <View className="flex-1 px-4 pt-4">
        {displayStations.length > 0 && (
          <View className="mb-3 flex-row items-center gap-2 px-2">
            {!keyword.trim() && <Clock color="#9CA3AF" size={16} />}
            <Text className="text-gray-500 text-sm">
              {keyword.trim()
                ? i18n.t("stationSelect.searchResults", {
                    count: displayStations.length,
                  })
                : i18n.t("stationSelect.recentStations")}
            </Text>
          </View>
        )}

        <View
          className="flex-1 overflow-hidden rounded-2xl bg-white"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          {displayStations.length > 0 ? (
            <FlatList
              data={displayStations}
              keyExtractor={keyExtractor}
              renderItem={renderStationItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="items-center px-6 py-12">
              <Text className="text-gray-400">
                {keyword.trim()
                  ? i18n.t("stationSelect.noResults")
                  : i18n.t("stationSelect.searchHint")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
