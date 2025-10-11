import "@/global.css";
import "react-native-reanimated";
import "@/i18n";

import { Slot } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <SafeAreaView>
      <View className={"min-h-[32px]"} />
      <View className={"mx-auto flex w-[60vw] max-w-[300px]"}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}
