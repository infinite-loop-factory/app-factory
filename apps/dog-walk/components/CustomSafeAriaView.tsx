import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomSafeAreaView({ children }: PropsWithChildren) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">{children}</View>
    </SafeAreaView>
  );
}
