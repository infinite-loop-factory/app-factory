import { Button, ButtonText } from "@/components/ui/button";
import { fetchUsername, getCurrentUser } from "@/services";
import { useAsyncEffect } from "@reactuses/core";
import { noop } from "es-toolkit";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function MenuScreen() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

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

  const menuItems = [
    {
      id: "measurement",
      title: "측정 시작",
      description: "반응 속도를 측정해보세요",
      icon: "⚡",
      href: "/measurement" as const,
      primary: true,
    },
    {
      id: "results",
      title: "기록 보기",
      description: "지금까지의 측정 기록을 확인하세요",
      icon: "📊",
      href: "/results" as const,
    },
    {
      id: "settings",
      title: "설정",
      description: "앱 설정을 변경하세요",
      icon: "⚙️",
      href: "/settings" as const,
    },
  ];

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Stack.Screen options={{ title: "메뉴", headerShown: false }} />
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <View className="mx-auto max-w-md px-4 py-8">
            {/* 헤더 */}
            <View className="mb-8 items-center">
              <Text className="mb-2 font-bold text-2xl text-slate-900 dark:text-slate-100">
                안녕하세요, {username || "사용자"}님!
              </Text>
              <Text className="text-slate-600 dark:text-slate-400">
                오늘도 반응 속도를 측정해보세요
              </Text>
            </View>

            {/* 메뉴 아이템들 */}
            <View className="gap-y-4">
              {menuItems.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(item.href)}
                  className={`rounded-lg border ${
                    item.primary
                      ? "border-slate-900 bg-slate-900 dark:border-slate-100 dark:bg-slate-100"
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                >
                  <View className="p-6">
                    <View className="flex-row items-center">
                      <Text className="mr-4 text-3xl">{item.icon}</Text>
                      <View className="flex-1">
                        <Text
                          className={`mb-1 font-semibold text-lg ${
                            item.primary
                              ? "text-slate-100 dark:text-slate-900"
                              : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {item.title}
                        </Text>
                        <Text
                          className={`text-sm ${
                            item.primary
                              ? "text-slate-300 dark:text-slate-700"
                              : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {item.description}
                        </Text>
                      </View>
                      <Text
                        className={`text-xl ${
                          item.primary
                            ? "text-slate-300 dark:text-slate-700"
                            : "text-slate-400 dark:text-slate-600"
                        }`}
                      >
                        →
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* 하단 버튼 */}
            <View className="mt-8 border-slate-200 border-t pt-8 dark:border-slate-800">
              <Button
                action="secondary"
                className="w-full border-slate-300 dark:border-slate-700"
                onPress={() => router.push("/")}
              >
                <ButtonText className="text-slate-700 dark:text-slate-300">
                  로그아웃
                </ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
