import { ThemedView } from "@/components/ThemedView";
import { Globe } from "lucide-react-native";
import { ImageBackground, Text, View } from "react-native";

export default function MapScreen() {
  return (
    <ThemedView className="flex-1">
      <ImageBackground
        source={{ uri: "https://example.com/globe-background.png" }} // Globe 배경 이미지 URL
        className="flex-1 items-center justify-center"
      >
        <View className="items-center justify-center rounded-lg bg-black bg-opacity-50 p-5">
          <Globe color="white" size={100} />
          <Text className="mt-2 text-2xl text-white">Map Screen</Text>
        </View>
      </ImageBackground>
    </ThemedView>
  );
}
