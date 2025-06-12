import { Button, ButtonText } from "@/components/ui/button";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Stack.Screen
          options={{ title: "Reaction Speed Test", headerShown: false }}
        />
        <View className="items-center gap-y-6">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100">
            <ActivityIndicator
              size="large"
              color="#64748b"
              className="h-12 w-12"
            />
          </View>
          <View className="items-center gap-y-2">
            <Text className="font-bold text-3xl text-slate-900 dark:text-slate-100">
              Reaction Speed Test
            </Text>
            <Text className="text-slate-600 dark:text-slate-400">
              반응 속도 측정 앱
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <Stack.Screen
        options={{ title: "Reaction Speed Test", headerShown: false }}
      />
      <View className="w-full max-w-md items-center gap-y-8">
        <View className="items-center gap-y-4">
          <View className="h-32 w-32 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100">
            {/* TODO: 추후 추가할 기능 - 체크마크 SVG 아이콘 */}
            <Text className="text-4xl text-slate-100 dark:text-slate-900">
              ✓
            </Text>
          </View>
          <Text className="text-center font-bold text-4xl text-slate-900 dark:text-slate-100">
            Reaction Speed Test
          </Text>
          <Text className="text-center text-lg text-slate-600 dark:text-slate-400">
            당신의 반응 속도를 정확하게 측정하고{"\n"}기록을 관리해보세요
          </Text>
        </View>

        <View className="w-full gap-y-4">
          <Button
            action="primary"
            className="h-14 w-full bg-slate-900 dark:bg-slate-100"
            onPress={() => router.push("/login")}
          >
            <ButtonText className="text-lg text-slate-100 dark:text-slate-900">
              로그인하기
            </ButtonText>
          </Button>
          <Button
            action="secondary"
            className="h-12 w-full border-slate-300 dark:border-slate-700"
            onPress={() => router.push("/signup")}
          >
            <ButtonText className="text-slate-700 dark:text-slate-300">
              회원가입
            </ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
