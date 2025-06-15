import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, View } from "react-native";

type Props = {
  onPress: () => void;
};

export default function CircleButton({ onPress }: Props) {
  return (
    <View className="mx-[60px] h-[72px] w-[72px] rounded-full bg-[#1ED760] p-1">
      <Pressable
        className="flex-1 items-center justify-center rounded-full"
        onPress={onPress}
      >
        <MaterialIcons name="play-arrow" size={50} color="#25292e" />
      </Pressable>
    </View>
  );
}
