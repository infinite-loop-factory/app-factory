import { Link, Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "오류" }} />
      <ThemedView className="flex-1 items-center justify-center p-5">
        <ThemedText type="title">이 화면은 존재하지 않습니다.</ThemedText>
        <Link className="mt-4 py-4" href="/">
          <ThemedText type="link">홈으로 돌아가기</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
