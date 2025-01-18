import { fetchUsername, getCurrentUser } from "@/services";
import { useAsyncEffect } from "@reactuses/core";
import { noop } from "es-toolkit";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function MenuScreen() {
  const [username, setUsername] = useState<string | null>(null);

  useAsyncEffect(
    async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const username = await fetchUsername(user.id);
          setUsername(username);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    },
    noop,
    [],
  );

  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen options={{ title: "메뉴 페이지", headerShown: false }} />
      <SafeAreaView className="h-full">
        <View className="flex-auto items-center justify-center gap-y-10">
          <Text className="text-lg dark:text-gray-50">
            {`${username || "이름"}님 반갑습니다!`}
          </Text>
          <Link href={{ pathname: "./measurement" }}>
            <Text className="dark:text-gray-50">시작하기</Text>
          </Link>
          <Link href={{ pathname: "./results" }}>
            <Text className="dark:text-gray-50">기록보기</Text>
          </Link>
          <Link href={{ pathname: "./settings" }}>
            <Text className="dark:text-gray-50">설정</Text>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}
