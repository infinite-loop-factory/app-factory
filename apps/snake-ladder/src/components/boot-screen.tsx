import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLogo } from "@/components/app-logo";
import { CRAFT_LIGHT } from "@/game/constants/palettes";

export function BootScreen() {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: CRAFT_LIGHT.background }}
      testID="boot-screen"
    >
      <View className="items-center" style={{ gap: 28 }}>
        <AppLogo palette={CRAFT_LIGHT} showTitle size={120} />
        <ActivityIndicator color={CRAFT_LIGHT.ladder} size="small" />
      </View>
    </SafeAreaView>
  );
}
