import { Stack, useRouter } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function GuestMenuScreen() {
  const router = useRouter();
  const { setRedirectPath } = useAuth();

  const handleLogin = async () => {
    // 로그인 후 게스트 메뉴로 돌아오도록 설정
    await setRedirectPath("/guest-menu");
    router.push("/");
  };

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
      href: "/guest-results" as const,
    },
  ];

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <Stack.Screen options={{ title: "비회원 메뉴", headerShown: false }} />

      <View className="w-full max-w-md items-center gap-y-12">
        <View className="items-center gap-y-4">
          <Text className="text-center font-bold text-3xl text-slate-900 dark:text-slate-100">
            환영합니다! 👋
          </Text>
          <Text className="text-center text-lg text-slate-600 dark:text-slate-400">
            비회원으로 앱을 사용하고 있습니다
          </Text>
        </View>

        {/* 클라우드 저장 혜택 안내 */}
        <View className="w-full rounded-lg bg-blue-50 p-6 dark:bg-blue-950/20">
          <Text className="mb-3 font-semibold text-blue-900 text-lg dark:text-blue-100">
            🚀 더 나은 경험을 위해
          </Text>
          <Text className="mb-4 text-blue-800 text-sm leading-relaxed dark:text-blue-200">
            • 기록이 클라우드에 안전하게 저장됩니다{"\n"}• 다른 기기에서도
            기록을 확인할 수 있습니다{"\n"}• 기록을 잃어버릴 걱정이 없습니다
          </Text>
          <Button
            action="primary"
            className="h-12 w-full bg-blue-600 dark:bg-blue-500"
            onPress={handleLogin}
          >
            <ButtonText className="text-white">로그인하기</ButtonText>
          </Button>
        </View>

        <View className="w-full gap-y-4">
          {menuItems.map((item) => (
            <Pressable
              className={`rounded-lg border ${
                item.primary
                  ? "border-slate-900 bg-slate-900 dark:border-slate-100 dark:bg-slate-100"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
              key={item.id}
              onPress={() => router.push(item.href)}
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
      </View>
    </SafeAreaView>
  );
}
