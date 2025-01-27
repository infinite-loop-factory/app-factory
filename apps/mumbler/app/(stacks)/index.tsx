import { Link } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView className="h-full">
      <View className="flex-auto items-center justify-center gap-y-10">
        <Link href={{ pathname: "./stack1" }}>
          <Text>stack1</Text>
        </Link>
        <Link href={{ pathname: "./stack2" }}>
          <Text>stack2</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
