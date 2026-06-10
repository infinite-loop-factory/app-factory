import { ActivityIndicator, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CRAFT_LIGHT } from "@/game/constants/palettes";

const LOGO_EMBLEM = require("@/assets/images/art/logo-emblem.png");

export function BootScreen() {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: CRAFT_LIGHT.tableFeltDeep }}
      testID="boot-screen"
    >
      <View className="items-center" style={{ gap: 28 }}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={LOGO_EMBLEM}
          style={{ width: 132, height: 132, borderRadius: 32 }}
        />
        <ActivityIndicator color={CRAFT_LIGHT.cream} size="small" />
      </View>
    </SafeAreaView>
  );
}
