import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import i18n from "@/i18n"

export default function NotificationsTabScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
      <ThemedView className="flex-1">
        <View className="flex-1 items-center justify-center px-6">
        <ThemedText type="title">{i18n.t("tabs.notifications")}</ThemedText>
        <ThemedText className="mt-2 text-center text-typography-600">
          알림 목록 및 설정이 여기에 표시됩니다. (미구현)
        </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  )
}
