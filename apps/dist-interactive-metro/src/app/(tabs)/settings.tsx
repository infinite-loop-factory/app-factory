import type { DefaultHomeTabId } from "@/lib/default-home";

import { useRouter } from "expo-router";
import { Check, ChevronRight } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import i18n from "@/i18n";
import { getDefaultHomeTab, setDefaultHomeTab } from "@/lib/default-home";

const DEFAULT_HOME_OPTIONS: DefaultHomeTabId[] = [
  "routeGuide",
  "notifications",
  "favorites",
  "settings",
];

const TAB_LABEL_KEYS: Record<DefaultHomeTabId, string> = {
  routeGuide: "tabs.routeGuide",
  notifications: "tabs.notifications",
  favorites: "tabs.favorites",
  settings: "tabs.settings",
};

export default function SettingsTabScreen() {
  const router = useRouter();
  const [defaultHome, setDefaultHomeState] = useState<DefaultHomeTabId | null>(
    null,
  );

  useEffect(() => {
    getDefaultHomeTab()
      .then(setDefaultHomeState)
      .catch(() => {
        // ignore read errors — fallback to default
      });
  }, []);

  const onSelectDefaultHome = useCallback((tabId: DefaultHomeTabId) => {
    setDefaultHomeTab(tabId)
      .then(() => setDefaultHomeState(tabId))
      .catch(() => {
        // ignore write errors
      });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
      <ThemedView className="flex-1">
        <View className="flex-1 px-4 pt-6">
          <ThemedText className="mb-6" type="title">
            {i18n.t("tabs.settings")}
          </ThemedText>

          <ThemedText className="mb-2 font-medium text-sm text-typography-700">
            {i18n.t("settings.defaultHome")}
          </ThemedText>
          <ThemedText className="mb-3 text-sm text-typography-500">
            {i18n.t("settings.defaultHomeDescription")}
          </ThemedText>
          <View className="mb-6 overflow-hidden rounded-lg border border-outline-200 bg-background-0">
            {DEFAULT_HOME_OPTIONS.map((tabId, index) => (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: defaultHome === tabId }}
                className={`flex-row items-center justify-between border-outline-100 py-4 pr-3 pl-4 ${
                  index < DEFAULT_HOME_OPTIONS.length - 1 ? "border-b" : ""
                }`}
                key={tabId}
                onPress={() => onSelectDefaultHome(tabId)}
              >
                <ThemedText>{i18n.t(TAB_LABEL_KEYS[tabId])}</ThemedText>
                {defaultHome === tabId ? (
                  <Check className="text-typography-700" size={20} />
                ) : null}
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            className="flex-row items-center justify-between rounded-lg border border-outline-200 bg-background-0 py-4 pr-3 pl-4"
            onPress={() => router.push("/notification-settings")}
          >
            <ThemedText>{i18n.t("settings.notificationSettings")}</ThemedText>
            <ChevronRight className="text-typography-500" size={20} />
          </Pressable>
          <ThemedText className="mt-4 text-sm text-typography-500">
            {i18n.t("settings.navigationHint")}
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
