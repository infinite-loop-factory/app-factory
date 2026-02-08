import { View } from "react-native"
import { ScreenHeader } from "@/components/navigation/screen-header"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import i18n from "@/i18n"

export default function NotificationSettingsScreen() {
  return (
    <ThemedView className="flex-1">
      <ScreenHeader title={i18n.t("settings.notificationSettings")} />
      <View className="flex-1 px-4 pt-4">
        <ThemedText className="text-typography-600">
          알림 설정 화면입니다. (미구현) 상단 뒤로가기로 탭 화면으로 돌아갈 수
          있습니다.
        </ThemedText>
      </View>
    </ThemedView>
  )
}
