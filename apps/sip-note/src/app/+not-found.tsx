import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-bg p-5">
        <Text className="font-display font-semibold text-h2 text-text">
          페이지를 찾을 수 없어요
        </Text>
        <Link className="mt-4 py-4" href="/">
          <Text className="font-semibold font-text text-bodySm text-brand">
            홈으로 돌아가기
          </Text>
        </Link>
      </View>
    </>
  );
}
