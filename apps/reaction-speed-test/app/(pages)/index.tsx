import LoginForm from "@/components/login/LoginForm";
import { Button, ButtonText } from "@/components/ui/button";
import { Link } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView className="h-full bg-background-50 dark:bg-background-900">
      <View className="flex-auto items-center justify-center gap-y-10 px-6">
        <Text className="font-bold text-3xl text-typography-900 dark:text-typography-50">
          반응 속도 테스트
        </Text>
        <LoginForm />
        <Link href="/signup" asChild>
          <Button action="secondary" className="w-full">
            <ButtonText>회원가입</ButtonText>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
