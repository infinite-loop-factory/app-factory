import LoginForm from "@/components/login/LoginForm";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function LoginPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <View className="w-full max-w-md items-center gap-y-12">
        <View className="items-center gap-y-4">
          <Text className="text-center font-bold text-3xl text-slate-900 dark:text-slate-100">
            로그인
          </Text>
          <Text className="text-center text-lg text-slate-600 dark:text-slate-400">
            계정에 로그인하여 반응속도를 측정해보세요
          </Text>
        </View>

        <View className="w-full">
          <View className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <LoginForm />
          </View>
        </View>

        <View className="w-full items-center gap-y-6">
          <Text className="text-slate-600 dark:text-slate-400">
            아직 계정이 없으신가요?
          </Text>
          <View className="w-full gap-y-4">
            <Button
              action="primary"
              className="h-14 w-full bg-slate-900 dark:bg-slate-100"
              onPress={() => router.push("/signup")}
            >
              <ButtonText className="text-lg text-slate-100 dark:text-slate-900">
                회원가입
              </ButtonText>
            </Button>
            <Button
              action="secondary"
              className="h-14 w-full border-slate-300 dark:border-slate-700"
              onPress={() => router.back()}
            >
              <ButtonText className="text-lg text-slate-700 dark:text-slate-300">
                뒤로가기
              </ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
