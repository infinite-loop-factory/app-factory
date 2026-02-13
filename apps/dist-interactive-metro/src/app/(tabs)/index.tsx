import { useRouter } from "expo-router";
import { Circle, MapPin, Navigation } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ElevatedCard } from "@/components/ui/elevated-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { LineBadge } from "@/components/ui/line-badge";
import { useRouteSearch } from "@/context/route-search-context";
import i18n from "@/i18n";

export default function RouteGuideTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { startStation, viaStation, endStation, canSearch } = useRouteSearch();

  const handleStationSelect = useCallback(
    (type: "start" | "via" | "end") => {
      router.push({
        pathname: "/station-select" as const,
        params: { type },
      } as never);
    },
    [router],
  );

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
          paddingBottom: 32,
        }}
      >
        <View className="px-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="mb-2 font-medium text-3xl text-gray-900">
              {i18n.t("homeScreen.title")}
            </Text>
            <Text className="text-base text-gray-600">
              {i18n.t("homeScreen.subtitle")}
            </Text>
          </View>

          {/* Route input card */}
          <ElevatedCard className="mb-6">
            <View className="gap-0">
              {/* Departure */}
              <Pressable
                className={`relative flex-row items-center rounded-2xl bg-gray-50 py-4 pr-6 pl-12 active:bg-blue-50 ${
                  startStation
                    ? "border-2 border-[rgb(26,163,255)]"
                    : "border-2 border-transparent"
                }`}
                onPress={() => handleStationSelect("start")}
              >
                <View className="absolute top-1/2 left-4 z-10 -translate-y-1/2">
                  <View
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: "rgb(26, 163, 255)" }}
                  />
                </View>
                {startStation ? (
                  <View>
                    <Text className="mb-0.5 text-gray-500 text-xs">
                      {i18n.t("stationSelect.departureShort")}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-gray-900 text-lg">
                        {startStation.name}
                      </Text>
                      <LineBadge
                        color={startStation.lineColor}
                        line={startStation.line}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <Text className="mb-0.5 text-gray-400 text-xs">
                      {i18n.t("stationSelect.departureShort")}
                    </Text>
                    <Text className="text-base text-gray-400">
                      {i18n.t("homeScreen.departurePlaceholder")}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Connector line */}
              <View className="flex-row items-center py-2 pl-4">
                <View className="ml-[5px] h-8 w-0.5 bg-gray-300" />
              </View>

              {/* Via station */}
              <Pressable
                className={`relative flex-row items-center rounded-2xl bg-gray-50 py-4 pr-6 pl-12 active:bg-gray-100 ${
                  viaStation
                    ? "border-2 border-gray-400"
                    : "border-2 border-transparent"
                }`}
                onPress={() => handleStationSelect("via")}
              >
                <View className="absolute top-1/2 left-4 z-10 -translate-y-1/2">
                  <Circle color="#9CA3AF" size={12} />
                </View>
                {viaStation ? (
                  <View>
                    <Text className="mb-0.5 text-gray-500 text-xs">
                      {i18n.t("stationSelect.viaShort")}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-gray-900 text-lg">
                        {viaStation.name}
                      </Text>
                      <LineBadge
                        color={viaStation.lineColor}
                        line={viaStation.line}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <Text className="mb-0.5 text-gray-400 text-xs">
                      {i18n.t("stationSelect.viaShort")} (
                      {i18n.t("via.optional")})
                    </Text>
                    <Text className="text-base text-gray-400">
                      {i18n.t("homeScreen.viaPlaceholder")}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Connector line */}
              <View className="flex-row items-center py-2 pl-4">
                <View className="ml-[5px] h-8 w-0.5 bg-gray-300" />
              </View>

              {/* Arrival */}
              <Pressable
                className={`relative flex-row items-center rounded-2xl bg-gray-50 py-4 pr-6 pl-12 active:bg-orange-50 ${
                  endStation
                    ? "border-2 border-[rgb(255,163,26)]"
                    : "border-2 border-transparent"
                }`}
                onPress={() => handleStationSelect("end")}
              >
                <View className="absolute top-1/2 left-4 z-10 -translate-y-1/2">
                  <MapPin
                    color="rgb(255, 163, 26)"
                    fill="rgb(255, 163, 26)"
                    size={16}
                  />
                </View>
                {endStation ? (
                  <View>
                    <Text className="mb-0.5 text-gray-500 text-xs">
                      {i18n.t("stationSelect.arrivalShort")}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-gray-900 text-lg">
                        {endStation.name}
                      </Text>
                      <LineBadge
                        color={endStation.lineColor}
                        line={endStation.line}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <Text className="mb-0.5 text-gray-400 text-xs">
                      {i18n.t("stationSelect.arrivalShort")}
                    </Text>
                    <Text className="text-base text-gray-400">
                      {i18n.t("homeScreen.arrivalPlaceholder")}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </ElevatedCard>

          {/* Search button */}
          <Pressable
            className={`w-full flex-row items-center justify-center gap-2 rounded-2xl py-4 ${
              canSearch ? "bg-blue-600 active:bg-blue-700" : "bg-gray-300"
            }`}
            disabled={!canSearch}
            onPress={handleSearch}
            style={{
              shadowColor: canSearch ? "#2563EB" : "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: canSearch ? 0.3 : 0.05,
              shadowRadius: 8,
              elevation: canSearch ? 6 : 2,
            }}
          >
            <Navigation color={canSearch ? "#FFFFFF" : "#6B7280"} size={20} />
            <Text
              className={`font-medium text-lg ${
                canSearch ? "text-white" : "text-gray-500"
              }`}
            >
              {i18n.t("homeScreen.search")}
            </Text>
          </Pressable>

          {/* Helper text */}
          {!canSearch && (
            <Text className="mt-4 text-center text-gray-500 text-sm">
              {i18n.t("homeScreen.searchHint")}
            </Text>
          )}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
