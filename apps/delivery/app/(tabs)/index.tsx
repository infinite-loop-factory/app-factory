import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className={"flex-1"}>
      <View className={"flex-1 items-center justify-center"}>
        <Text className={"flex font-bold text-[#285353] text-[28px]"}>
          Home
        </Text>
      </View>
    </SafeAreaView>
  );
}
