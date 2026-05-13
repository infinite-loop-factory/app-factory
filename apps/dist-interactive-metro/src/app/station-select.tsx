import type { Station } from "@/types/station";

import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Clock, History, Search, X } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
import { useStations } from "@/data/station-store";
import { lines } from "@/data/stations";
import i18n from "@/i18n";
import { matchChoseong } from "@/utils/hangul";

const ITEM_HEIGHT = 88;

export default function StationSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type: "start" | "via" | "end" }>();

  const { setStartStation, setViaStation, setEndStation } = useRouteSearch();
  const stations = useStations();

  const [keyword, setKeyword] = useState("");
  const [recentStations, setRecentStations] = useState<Station[]>([]);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  useEffect(() => {
    getRecentStations().then(setRecentStations);
  }, []);

  const searchResults = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    if (!term) return [];

    const isLineOnlySearch = /^\d+$/.test(term);

    return stations.filter((s) => {
      const name = s.name.toLowerCase();
      const line = s.line.toLowerCase();

      const nameMatch = name.includes(term) || matchChoseong(s.name, term);
      if (nameMatch) return true;

      if (line.includes(term)) return true;

      if (isLineOnlySearch) {
        const lineNumbers = s.line.match(/\d+/g);
        return lineNumbers?.includes(term);
      }
      return false;
    });
  }, [keyword, stations]);

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
        className="flex-row items-center gap-4 border-gray-50 border-b px-6 py-4 active:bg-gray-50 dark:active:bg-gray-800"
        onPress={() => handleSelectStation(item)}
        style={{ height: ITEM_HEIGHT }}
      >
        <View className="flex-1">
          <Text className="mb-1.5 font-bold text-gray-900 text-lg dark:text-gray-100">
            {item.name}
          </Text>
          <View className="flex-row items-center gap-2">
            <LineBadge color={item.lineColor} line={item.line} size="sm" />
            {item.connections && item.connections.length > 0 && (
              <View className="flex-row items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 dark:bg-gray-900">
                <Text className="font-bold text-[10px] text-gray-400">
                  TRANSFERS
                </Text>
                <Text className="text-gray-600 text-xs dark:text-gray-400">
                  {item.connections.join(", ")}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
          {keyword.trim() ? (
            <Search color="#D1D5DB" size={16} />
          ) : (
            <History color="#D1D5DB" size={16} />
          )}
        </View>
      </Pressable>
    ),
    [handleSelectStation, keyword],
  );

  const keyExtractor = useCallback(
    (item: Station, index: number) => `${item.id}-${index}`,
    [],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white dark:bg-gray-950"
      style={{ paddingTop: insets.top }}
    >
      {/* Sticky header */}
      <View className="z-20 bg-white px-6 pt-4 pb-4 dark:bg-gray-950">
        {/* Back + title */}
        <View className="mb-6 flex-row items-center gap-4">
          <Pressable
            accessibilityLabel={i18n.t("common.back")}
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 active:bg-gray-100 dark:bg-gray-900"
            onPress={() => router.back()}
          >
            <ArrowLeft color="#111827" size={22} />
          </Pressable>
          <Text className="font-bold text-2xl text-gray-900 dark:text-gray-100">
            {title}
          </Text>
        </View>

        {/* Search input */}
        <View className="relative">
          <View className="absolute top-1/2 left-4 z-10 -translate-y-1/2">
            <Search color="#9CA3AF" size={20} />
          </View>
          <TextInput
            autoFocus
            className="w-full rounded-2xl bg-gray-100 py-4.5 pr-12 pl-12 text-gray-900 text-lg dark:bg-gray-900 dark:text-gray-100"
            onChangeText={setKeyword}
            placeholder={i18n.t("stationSelect.searchPlaceholder")}
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
            value={keyword}
          />
          {keyword.length > 0 && (
            <Pressable
              className="absolute top-1/2 right-4 h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 active:bg-gray-300 dark:bg-gray-800"
              onPress={() => setKeyword("")}
            >
              <X color="#6B7280" size={18} />
            </Pressable>
          )}
        </View>

        {/* Line filter tabs */}
        <View className="mt-6">
          <ScrollView
            contentContainerStyle={{ gap: 10, paddingRight: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <Pressable
              className={`rounded-xl px-5 py-2.5 ${
                selectedLine === null
                  ? "bg-blue-600 shadow-blue-500/30 shadow-md"
                  : "bg-gray-100 active:bg-gray-200 dark:bg-gray-900"
              }`}
              onPress={() => setSelectedLine(null)}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedLine === null ? "text-white" : "text-gray-500"
                }`}
              >
                {i18n.t("stationSelect.allLines")}
              </Text>
            </Pressable>
            {lines.map((line) => (
              <Pressable
                className="rounded-xl px-5 py-2.5"
                key={line.id}
                onPress={() => setSelectedLine(line.name)}
                style={
                  selectedLine === line.name
                    ? {
                        backgroundColor: line.color,
                        shadowColor: line.color,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }
                    : {
                        backgroundColor:
                          Platform.OS === "ios" ? "#F3F4F6" : "#F3F4F6",
                      }
                }
              >
                <Text
                  className={`font-bold text-sm ${
                    selectedLine === line.name ? "text-white" : "text-gray-500"
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
      <View className="flex-1">
        <View className="mb-2 flex-row items-center justify-between px-6 pt-2">
          <View className="flex-row items-center gap-2">
            {!keyword.trim() ? (
              <Clock color="#9CA3AF" size={14} />
            ) : (
              <Search color="#9CA3AF" size={14} />
            )}
            <Text className="font-bold text-gray-400 text-xs uppercase tracking-widest">
              {keyword.trim()
                ? i18n.t("stationSelect.searchResults", {
                    count: displayStations.length,
                  })
                : i18n.t("stationSelect.recentStations")}
            </Text>
          </View>
        </View>

        {displayStations.length > 0 ? (
          <FlatList
            contentContainerStyle={{ paddingBottom: 40 }}
            data={displayStations}
            getItemLayout={getItemLayout}
            keyExtractor={keyExtractor}
            renderItem={renderStationItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-10">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900">
              <Search color="#D1D5DB" size={40} />
            </View>
            <Text className="text-center font-bold text-gray-900 text-lg dark:text-gray-100">
              {keyword.trim()
                ? i18n.t("stationSelect.noResults")
                : i18n.t("stationSelect.searchHint")}
            </Text>
            <Text className="mt-2 text-center text-gray-500 text-sm">
              {keyword.trim()
                ? "다른 검색어를 입력해보세요."
                : "검색창에 역 이름을 입력하여 새로운 역을 찾아보세요."}
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
