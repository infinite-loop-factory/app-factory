import { Bell, Info } from "lucide-react-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/empty-state";
import i18n from "@/i18n";

export default function NotificationsTab() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <View className="mb-2 flex-row items-center gap-3">
            <Bell color="#2563EB" size={32} />
            <Text className="font-medium text-2xl text-gray-900">
              {i18n.t("tabs.notifications")}
            </Text>
          </View>
          <Text className="text-base text-gray-600">
            {i18n.t("notifications.description")}
          </Text>
        </View>

        {/* Empty state */}
        <EmptyState
          description={i18n.t("notifications.emptyDescription")}
          icon={<Bell color="#2563EB" size={40} />}
          iconBgColor="bg-blue-50"
          title={i18n.t("notifications.emptyTitle")}
        />

        {/* Info banner */}
        <View className="mt-6 flex-row items-start gap-3 rounded-2xl bg-blue-50 p-4">
          <Info color="#2563EB" size={20} />
          <View className="flex-1">
            <Text className="mb-1 font-medium text-gray-900 text-sm">
              {i18n.t("notifications.comingSoonTitle")}
            </Text>
            <Text className="text-gray-600 text-xs">
              {i18n.t("notifications.comingSoonDescription")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
