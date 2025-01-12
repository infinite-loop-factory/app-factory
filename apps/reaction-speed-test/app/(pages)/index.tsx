import { Link } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView className="h-full">
      <View className="flex-auto items-center justify-center gap-y-10">
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
  );
}
