import type { PropsWithChildren } from "react";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomToast } from "./CustomToast";

export default function CustomSafeAreaView({ children }: PropsWithChildren) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">{children}</View>
      <CustomToast />
    </SafeAreaView>
  );
}
