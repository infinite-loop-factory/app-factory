"use client";

import { ScrollView, Text, View } from "react-native";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { useRouteSearch } from "@/context/route-search-context";

export default function RouteResultScreen() {
  const { departure, arrival } = useRouteSearch();

  return (
    <View className="flex-1 bg-background-0">
      <ScreenHeader title="경로 결과" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="min-w-0 rounded-xl border border-outline-200 bg-background-50 p-4">
          <Text
            className="text-sm text-outline-500"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {departure?.name ?? "—"} → {arrival?.name ?? "—"}
          </Text>
          <Text
            className="mt-3 text-outline-500 text-sm"
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            경로 탐색 알고리즘 및 상세 결과 화면은 Phase 3·4에서 구현됩니다.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
