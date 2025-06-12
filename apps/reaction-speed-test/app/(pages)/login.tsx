import LoginForm from "@/components/login/LoginForm";
import { Button, ButtonText } from "@/components/ui/button";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function LoginPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Stack.Screen options={{ title: "측정 페이지", headerShown: false }} />

      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="mb-2 text-center font-bold text-2xl text-slate-900 dark:text-slate-100">
            로그인
          </Text>
          <Text className="text-center text-slate-600 dark:text-slate-400">
            계정에 로그인하여 반응속도를 측정해보세요
          </Text>
        </View>

        {/* Login Form Card */}
        <View className="flex-1 justify-center">
          <View className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <LoginForm />
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="mb-4 text-slate-600 dark:text-slate-400">
            아직 계정이 없으신가요?
          </Text>
          <Button
            action="primary"
            className="h-12 w-full bg-slate-900 dark:bg-slate-100"
            onPress={() => router.push("/signup")}
          >
            <ButtonText className="text-slate-100 dark:text-slate-900">
              회원가입
            </ButtonText>
          </Button>
          <Button
            action="secondary"
            className="mt-4 h-12 w-full border-slate-300 dark:border-slate-700"
            onPress={() => router.back()}
          >
            <ButtonText className="text-slate-700 dark:text-slate-300">
              뒤로가기
            </ButtonText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
