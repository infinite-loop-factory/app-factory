import { ScrollView, Text, View } from "react-native";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { useRouteSearch } from "@/context/route-search-context";
import i18n from "@/i18n";

const contentContainerStyle = {
  paddingHorizontal: 24,
  paddingTop: 24,
  paddingBottom: 32,
} as const;

export default function RouteResultScreen() {
  const { departure, arrival } = useRouteSearch();

  return (
    <View className="flex-1 bg-background-0">
      <ScreenHeader title={i18n.t("routeResult.title")} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        <View className="min-w-0 rounded-xl border border-outline-200 bg-background-50 p-4">
          <Text
            className="text-outline-500 text-sm"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {departure?.name ?? "—"} → {arrival?.name ?? "—"}
          </Text>
          <Text
            className="mt-3 text-outline-500 text-sm"
            ellipsizeMode="tail"
            numberOfLines={3}
          >
            {i18n.t("routeResult.placeholder")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
