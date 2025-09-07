import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface MiniPlayerProps {
  currentTrack: string;
  artist: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function MiniPlayer({
  currentTrack,
  artist,
  isPlaying,
  onPlayPause,
}: MiniPlayerProps) {
  return (
    <View className="absolute right-0 bottom-0 left-0 mx-3 flex-row items-center justify-between rounded-xl bg-[#1a1a1a] p-3 shadow-lg">
      <View className="flex-row items-center">
        <Image
          className="h-12 w-12 rounded-md"
          source={require("../assets/images/jennie.png")}
        />
        <View className="ml-3">
          <Text className="font-semibold text-white">{currentTrack}</Text>
          <Text className="text-gray-400 text-sm">{artist}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onPlayPause}>
        <Ionicons color="white" name={isPlaying ? "pause" : "play"} size={25} />
      </TouchableOpacity>
    </View>
  );
}
