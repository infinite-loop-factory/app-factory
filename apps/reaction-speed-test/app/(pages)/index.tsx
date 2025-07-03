import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <View className="w-full max-w-md items-center gap-y-12">
        <View className="items-center gap-y-8">
          <View className="h-32 w-32 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100">
            <Text className="text-4xl text-slate-100 dark:text-slate-900">
              ⚡
            </Text>
          </View>
          <Text className="text-center font-bold text-4xl text-slate-900 dark:text-slate-100">
            반응 속도 테스트
          </Text>
          <Text className="text-center text-lg text-slate-600 dark:text-slate-400">
            반응 속도를 정확하게 측정하고{"\n"}기록을 관리해보세요
          </Text>
        </View>

        <View className="w-full gap-y-6">
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
            className="h-14 w-full border-slate-300 dark:border-slate-700"
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
