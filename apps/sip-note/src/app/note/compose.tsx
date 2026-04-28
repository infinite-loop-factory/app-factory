import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// NOTE: 실제 Compose 폼은 다음 커밋에서. 이 파일은 typed-routes resolution 용 stub.
export default function ComposeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="font-display font-semibold text-h2 text-text">
          Compose
        </Text>
        <Text className="mt-2 text-center font-text text-bodySm text-text-subtle">
          기록 작성 폼 (다음 커밋에서 구현).
        </Text>
      </View>
    </SafeAreaView>
  );
}
