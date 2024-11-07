import { useColorToken } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { typography } = useColorToken({ typography: true });

  return (
    <SafeAreaView className={"flex-1 "}>
      {/*  head */}
      <View className="p-2.5 px-5">
        <View className="flex flex-row justify-between">
          <Text className="title-3">서초구 효령로 32s1</Text>
          <View className="flex flex-row gap-7">
            <Ionicons name={"search"} size={24} color={typography} />
            <Ionicons name={"search"} size={24} color={typography} />
            <Ionicons name={"search"} size={24} color={typography} />
          </View>
        </View>

        {/* input */}
        <View className="" />

        {/* AD */}
        <View className="flex flex-row items-center justify-center gap-2 text-nowrap p-5">
          <Text className={"title-4"}>{"🎉B마트"}</Text>
          <Text className={"title-4"}>|</Text>
          <Text className={"title-4"}>{"여기서 드려요! 100% 당첨 쿠폰 >"}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
