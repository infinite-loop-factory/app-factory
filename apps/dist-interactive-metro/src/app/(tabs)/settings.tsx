import Constants from "expo-constants";
import {
  ChevronRight,
  Globe,
  Home,
  Info,
  Settings as SettingsIcon,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "@/context/language-context";
import {
  DEFAULT_HOME_TABS,
  type DefaultHomeTab,
  getDefaultHomeTab,
  setDefaultHomeTab,
} from "@/data/app-preferences";
import { clearAllFavorites } from "@/data/favorites";
import { clearRecentStations } from "@/data/recent-stations";
import i18n from "@/i18n";

const TAB_LABEL_KEY: Record<DefaultHomeTab, string> = {
  index: "tabs.goNow",
  search: "tabs.routeGuide",
};

const APP_VERSION = Constants.expoConfig?.version ?? "0.0.0";

export default function SettingsTab() {
  const insets = useSafeAreaInsets();
  const { locale, setLocale } = useLanguage();
  const [defaultTab, setDefaultTab] = useState<DefaultHomeTab | null>(null);

  useEffect(() => {
    getDefaultHomeTab().then(setDefaultTab);
  }, []);

  const handleSelectDefaultTab = useCallback((tab: DefaultHomeTab) => {
    setDefaultTab(tab);
    setDefaultHomeTab(tab);
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
    <View
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
      >
        {/* Header */}
        <View className="mb-6">
          <View className="mb-2 flex-row items-center gap-3">
            <SettingsIcon
              className="dark:text-gray-400"
              color="#374151"
              size={32}
            />
            <Text className="font-medium text-2xl text-gray-900 dark:text-gray-100">
              {i18n.t("tabs.settings")}
            </Text>
          </View>
          <Text className="text-base text-gray-600 dark:text-gray-400">
            {i18n.t("settings.description")}
          </Text>
        </View>

        <View className="gap-4">
          {/* Language */}
          <SettingsCard
            icon={<Globe color="#6B7280" size={20} />}
            title={i18n.t("settings.language")}
          >
            <View className="flex-row gap-3 p-4">
              {(["ko", "en"] as const).map((lang) => {
                const isActive = locale === lang;
                const label =
                  lang === "ko"
                    ? i18n.t("settings.languageKo")
                    : i18n.t("settings.languageEn");
                return (
                  <Pressable
                    className={`flex-1 items-center rounded-xl py-2.5 ${
                      isActive ? "bg-blue-600" : "bg-gray-100 dark:bg-gray-800"
                    }`}
                    key={lang}
                    onPress={() => setLocale(lang)}
                  >
                    <Text
                      className={`font-medium text-base ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SettingsCard>

          {/* Default home screen */}
          <SettingsCard
            description={i18n.t("settings.defaultHomeDescription")}
            icon={<Home color="#6B7280" size={20} />}
            title={i18n.t("settings.defaultHome")}
          >
            <View className="flex-row gap-3 p-4">
              {DEFAULT_HOME_TABS.map((tab) => {
                const isActive = defaultTab === tab;
                return (
                  <Pressable
                    className={`flex-1 items-center rounded-xl py-2.5 ${
                      isActive ? "bg-blue-600" : "bg-gray-100 dark:bg-gray-800"
                    }`}
                    key={tab}
                    onPress={() => handleSelectDefaultTab(tab)}
                  >
                    <Text
                      className={`font-medium text-base ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {i18n.t(TAB_LABEL_KEY[tab])}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SettingsCard>

          {/* App info */}
          <SettingsCard
            icon={<Info color="#6B7280" size={20} />}
            title={i18n.t("settings.appInfo")}
          >
            <View className="flex-row items-center justify-between border-gray-100 border-b px-4 py-3 dark:border-gray-800">
              <Text className="text-base text-gray-600 dark:text-gray-400">
                {i18n.t("settings.version")}
              </Text>
              <Text className="text-gray-500 text-sm dark:text-gray-500">
                {APP_VERSION}
              </Text>
            </View>
            <View className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-base text-gray-600 dark:text-gray-400">
                {i18n.t("settings.madeBy")}
              </Text>
              <Text className="text-gray-500 text-sm dark:text-gray-500">
                Dist Interactive Metro
              </Text>
            </View>
          </SettingsCard>

          {/* Data management */}
          <SettingsCard title={i18n.t("settings.dataManagement")}>
            <Pressable
              className="flex-row items-center justify-between border-gray-100 border-b px-4 py-3 active:bg-gray-50 dark:border-gray-800 dark:active:bg-gray-800"
              onPress={handleClearRecent}
            >
              <Text className="text-base text-gray-900 dark:text-gray-100">
                {i18n.t("settings.clearRecentSearch")}
              </Text>
              <ChevronRight color="#9CA3AF" size={20} />
            </Pressable>
            <Pressable
              className="flex-row items-center justify-between px-4 py-3 active:bg-red-50 dark:active:bg-red-900/20"
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
      className="overflow-hidden rounded-2xl bg-white dark:bg-gray-900"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="border-gray-100 border-b p-4 dark:border-gray-800">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="font-medium text-gray-900 text-lg dark:text-gray-100">
            {title}
          </Text>
        </View>
        {description && (
          <Text className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            {description}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}
