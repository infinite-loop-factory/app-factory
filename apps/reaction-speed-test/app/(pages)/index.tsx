import LoginForm from "@/components/login/LoginForm";
import { Button, ButtonText } from "@/components/ui/button";
import { Link } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView className="h-full">
      <View className="flex-auto items-center justify-center gap-y-10">
        <Text className="dark:text-gray-50">반응 속도 테스트</Text>
        <LoginForm />
        <Link href="/signup" asChild>
          <Button className="bg-slate-500">
            <ButtonText>회원가입</ButtonText>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
