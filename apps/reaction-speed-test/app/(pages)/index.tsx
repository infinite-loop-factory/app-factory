import { Stack, useRouter } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function HomeScreen() {
  const router = useRouter();

  const handleGuestStart = () => {
    router.push(ROUTES.GUEST_MENU);
  };

  const handleLogin = () => {
    // 로그인 후 메뉴로 이동하도록 설정 (기본값이므로 설정하지 않음)
    router.push(ROUTES.LOGIN);
  };

  const handleSignup = () => {
    // 회원가입 후 메뉴로 이동하도록 설정 (기본값이므로 설정하지 않음)
    router.push(ROUTES.SIGNUP);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <Stack.Screen options={{ title: "반응속도 측정", headerShown: false }} />
      <View className="w-full max-w-md items-center gap-y-12">
        {/* 헤더 */}
        <View className="items-center gap-y-4">
          <Text className="text-center font-bold text-6xl">⚡</Text>
          <Text className="text-center font-bold text-3xl text-slate-900 dark:text-slate-100">
            반응속도 측정
          </Text>
          <Text className="text-center text-lg text-slate-600 dark:text-slate-400">
            당신의 순간 반응 속도를 측정해보세요
          </Text>
        </View>

        {/* 메인 액션 버튼 */}
        <View className="w-full gap-y-6">
          <Button
            action="primary"
            className="h-16 w-full bg-slate-900 dark:bg-slate-100"
            onPress={handleGuestStart}
          >
            <ButtonText className="text-slate-100 text-xl dark:text-slate-900">
              🚀 비회원으로 시작하기
            </ButtonText>
          </Button>

          {/* 구분선 */}
          <View className="flex-row items-center">
            <View className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
            <Text className="mx-4 text-slate-500 dark:text-slate-400">
              또는 계정으로 로그인
            </Text>
            <View className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
          </View>

          {/* 로그인/회원가입 버튼 */}
          <View className="gap-y-3">
            <Button
              action="secondary"
              className="h-14 w-full border border-slate-500 dark:border-slate-700"
              onPress={handleLogin}
            >
              <ButtonText className="text-lg text-slate-700 dark:text-slate-300">
                로그인
              </ButtonText>
            </Button>
            <Button
              action="secondary"
              className="h-14 w-full border border-slate-500 dark:border-slate-700"
              onPress={handleSignup}
            >
              <ButtonText className="text-lg text-slate-700 dark:text-slate-300">
                회원가입
              </ButtonText>
            </Button>
          </View>
        </View>

        {/* 앱 설명 */}
        <View className="items-center gap-y-3">
          <Text className="text-center text-slate-600 text-sm dark:text-slate-400">
            스마일 아이콘이 나타나는 순간,{"\n"}
            화면을 터치하여 반응속도를 측정하세요
          </Text>
          <View className="flex-row gap-x-6">
            <View className="items-center">
              <Text className="mb-1 text-2xl">👀</Text>
              <Text className="text-slate-500 text-xs dark:text-slate-500">
                관찰
              </Text>
            </View>
            <View className="items-center">
              <Text className="mb-1 text-2xl">⚡</Text>
              <Text className="text-slate-500 text-xs dark:text-slate-500">
                반응
              </Text>
            </View>
            <View className="items-center">
              <Text className="mb-1 text-2xl">📊</Text>
              <Text className="text-slate-500 text-xs dark:text-slate-500">
                결과
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
