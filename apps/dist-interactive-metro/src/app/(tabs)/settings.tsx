import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Bell,
  ChevronRight,
  Home,
  Info,
  Settings as SettingsIcon,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clearAllFavorites } from "@/data/favorites";
import { clearRecentStations } from "@/data/recent-stations";
import i18n from "@/i18n";

const TAB_OPTIONS = [
  { id: "route", label: () => i18n.t("tabs.routeGuide") },
  { id: "favorites", label: () => i18n.t("tabs.favorites") },
] as const;

export default function SettingsTab() {
  const insets = useSafeAreaInsets();
  const [defaultTab, setDefaultTab] = useState("route");

  useEffect(() => {
    AsyncStorage.getItem("defaultTab")
      .then((val) => {
        if (val) setDefaultTab(val);
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  const handleDefaultTabChange = useCallback(async (tab: string) => {
    setDefaultTab(tab);
    try {
      await AsyncStorage.setItem("defaultTab", tab);
    } catch {
      // ignore
    }
  }, []);

  const handleClearRecent = useCallback(() => {
    Alert.alert(i18n.t("settings.confirmClearRecent"), "", [
      { text: i18n.t("settings.cancel"), style: "cancel" },
      {
        text: i18n.t("settings.confirm"),
        style: "destructive",
        onPress: () => clearRecentStations(),
      },
    ]);
  }, []);

  const handleClearFavorites = useCallback(() => {
    Alert.alert(i18n.t("settings.confirmClearFavorites"), "", [
      { text: i18n.t("settings.cancel"), style: "cancel" },
      {
        text: i18n.t("settings.confirm"),
        style: "destructive",
        onPress: () => clearAllFavorites(),
      },
    ]);
  }, []);

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
      >
        {/* Header */}
        <View className="mb-6">
          <View className="mb-2 flex-row items-center gap-3">
            <SettingsIcon color="#374151" size={32} />
            <Text className="font-medium text-2xl text-gray-900">
              {i18n.t("tabs.settings")}
            </Text>
          </View>
          <Text className="text-base text-gray-600">
            {i18n.t("settings.description")}
          </Text>
        </View>

        <View className="gap-4">
          {/* Default home tab */}
          <SettingsCard
            description={i18n.t("settings.defaultHomeDescription")}
            icon={<Home color="#6B7280" size={20} />}
            title={i18n.t("settings.defaultHome")}
          >
            {TAB_OPTIONS.map((opt) => (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: defaultTab === opt.id }}
                className="flex-row items-center justify-between border-gray-100 border-b px-4 py-3 active:bg-gray-50"
                key={opt.id}
                onPress={() => handleDefaultTabChange(opt.id)}
              >
                <Text className="text-base text-gray-900">{opt.label()}</Text>
                {defaultTab === opt.id && (
                  <View className="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </Pressable>
            ))}
          </SettingsCard>

          {/* Notification settings */}
          <SettingsCard
            description={i18n.t("settings.notificationComingSoon")}
            icon={<Bell color="#6B7280" size={20} />}
            title={i18n.t("settings.notificationSettings")}
          >
            <View className="items-center p-4">
              <Text className="text-gray-400 text-sm">
                {i18n.t("settings.comingSoon")}
              </Text>
            </View>
          </SettingsCard>

          {/* App info */}
          <SettingsCard
            icon={<Info color="#6B7280" size={20} />}
            title={i18n.t("settings.appInfo")}
          >
            <View className="flex-row items-center justify-between border-gray-100 border-b px-4 py-3">
              <Text className="text-base text-gray-600">
                {i18n.t("settings.version")}
              </Text>
              <Text className="text-gray-500 text-sm">0.1.0</Text>
            </View>
            <View className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-base text-gray-600">
                {i18n.t("settings.madeBy")}
              </Text>
              <Text className="text-gray-500 text-sm">
                dist-interactive-metro
              </Text>
            </View>
          </SettingsCard>

          {/* Data management */}
          <SettingsCard title={i18n.t("settings.dataManagement")}>
            <Pressable
              className="flex-row items-center justify-between border-gray-100 border-b px-4 py-3 active:bg-gray-50"
              onPress={handleClearRecent}
            >
              <Text className="text-base text-gray-900">
                {i18n.t("settings.clearRecentSearch")}
              </Text>
              <ChevronRight color="#9CA3AF" size={20} />
            </Pressable>
            <Pressable
              className="flex-row items-center justify-between px-4 py-3 active:bg-red-50"
              onPress={handleClearFavorites}
            >
              <Text className="text-base text-red-600">
                {i18n.t("settings.clearAllFavorites")}
              </Text>
              <ChevronRight color="#EF4444" size={20} />
            </Pressable>
          </SettingsCard>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      className="overflow-hidden rounded-2xl bg-white"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="border-gray-100 border-b p-4">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="font-medium text-gray-900 text-lg">{title}</Text>
        </View>
        {description && (
          <Text className="mt-1 text-gray-500 text-sm">{description}</Text>
        )}
      </View>
      {children}
    </View>
  );
}
