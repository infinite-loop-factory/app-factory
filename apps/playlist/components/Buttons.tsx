import { FontAwesome } from "@expo/vector-icons";
import {
  type GestureResponderEvent,
  Pressable,
  Text,
  View,
} from "react-native";

type Props = {
  label: string;
  theme?: "primary";
  onPress?: (event: GestureResponderEvent) => void;
};

export default function Button({ label, theme, onPress }: Props) {
  if (theme === "primary") {
    return (
      <View className="mx-5 h-[68px] w-80 items-center justify-center rounded-xl border-4 border-[#1ED760] p-1">
        <Pressable
          className="h-full w-full flex-row items-center justify-center rounded-lg bg-white"
          onPress={() => alert("You pressed a button.")}
        >
          <FontAwesome
            name="music"
            size={18}
            color="#25292e"
            className="pr-2"
          />
          <Text className="text-[#25292e] text-base">{label}</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View className="mx-5 h-[68px] w-80 items-center justify-center p-1">
      <Pressable
        className="h-full w-full flex-row items-center justify-center rounded-lg"
        onPress={onPress}
      >
        <Text className="text-base text-white">{label}</Text>
      </Pressable>
    </View>
  );
}
