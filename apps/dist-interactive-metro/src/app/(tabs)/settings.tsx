import { useRouter } from "expo-router"
import { Check, ChevronRight } from "lucide-react-native"
import { useCallback, useEffect, useState } from "react"
import { Pressable, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import i18n from "@/i18n"
import type { DefaultHomeTabId } from "@/lib/default-home"
import {
  getDefaultHomeTab,
  setDefaultHomeTab,
} from "@/lib/default-home"

const DEFAULT_HOME_OPTIONS: DefaultHomeTabId[] = [
  "routeGuide",
  "notifications",
  "favorites",
  "settings",
]

const TAB_LABEL_KEYS: Record<DefaultHomeTabId, string> = {
  routeGuide: "tabs.routeGuide",
  notifications: "tabs.notifications",
  favorites: "tabs.favorites",
  settings: "tabs.settings",
}

export default function SettingsTabScreen() {
  const router = useRouter()
  const [defaultHome, setDefaultHomeState] = useState<DefaultHomeTabId | null>(
    null
  )

  useEffect(() => {
    getDefaultHomeTab().then(setDefaultHomeState)
  }, [])

  const onSelectDefaultHome = useCallback((tabId: DefaultHomeTabId) => {
    setDefaultHomeTab(tabId).then(() => setDefaultHomeState(tabId))
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
      <ThemedView className="flex-1">
        <View className="flex-1 px-4 pt-6">
          <ThemedText type="title" className="mb-6">
            {i18n.t("tabs.settings")}
          </ThemedText>

          <ThemedText className="mb-2 text-sm font-medium text-typography-700">
            {i18n.t("settings.defaultHome")}
          </ThemedText>
          <ThemedText className="mb-3 text-sm text-typography-500">
            {i18n.t("settings.defaultHomeDescription")}
          </ThemedText>
          <View className="mb-6 rounded-lg border border-outline-200 bg-background-0 overflow-hidden">
            {DEFAULT_HOME_OPTIONS.map((tabId) => (
              <Pressable
                key={tabId}
                onPress={() => onSelectDefaultHome(tabId)}
                className="flex-row items-center justify-between border-b border-outline-100 py-4 pl-4 pr-3 last:border-b-0"
              >
                <ThemedText>{i18n.t(TAB_LABEL_KEYS[tabId])}</ThemedText>
                {defaultHome === tabId ? (
                  <Check size={20} className="text-typography-700" />
                ) : null}
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={() => router.push("/notification-settings")}
            className="flex-row items-center justify-between rounded-lg border border-outline-200 bg-background-0 py-4 pl-4 pr-3"
          >
            <ThemedText>{i18n.t("settings.notificationSettings")}</ThemedText>
            <ChevronRight size={20} className="text-typography-500" />
          </Pressable>
          <ThemedText className="mt-4 text-sm text-typography-500">
            위 항목을 누르면 별도 화면으로 이동하며, 그 화면에서 뒤로가기가
            유효합니다.
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  )
}
