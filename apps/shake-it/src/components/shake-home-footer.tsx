import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

const C = {
  primary: "#3d6bf5",
  surface: "#F2F4F6",
  textMain: "#191F28",
  textSub: "#8B95A1",
};

interface ShakeHomeFooterProps {
  isBusy: boolean;
  showRecommendLoadingText: boolean;
  recommendationError: string | null;
  onPressRecommend: () => void;
}

export function ShakeHomeFooter({
  isBusy,
  showRecommendLoadingText,
  recommendationError,
  onPressRecommend,
}: ShakeHomeFooterProps) {
  return (
    <View className="items-center px-6 pb-6">
      <Pressable
        className="h-14 w-full max-w-xs flex-row items-center justify-center gap-2 rounded-2xl"
        disabled={isBusy}
        onPress={onPressRecommend}
        style={{
          backgroundColor: C.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <MaterialIcons color={C.primary} name="touch-app" size={20} />
        <Text className="font-bold" style={{ color: C.textMain }}>
          {showRecommendLoadingText ? "추천 중..." : "흔들지 않고 터치하기"}
        </Text>
      </Pressable>
      {recommendationError ? (
        <Text className="mt-3 text-center text-xs" style={{ color: "#dc2626" }}>
          {recommendationError}
        </Text>
      ) : null}
      <Text className="mt-4 text-center text-xs" style={{ color: C.textSub }}>
        흔들기가 동작하지 않나요? 설정을 확인해주세요.
      </Text>
    </View>
  );
}
