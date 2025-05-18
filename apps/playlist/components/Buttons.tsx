import { FontAwesome } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  theme?: "primary";
};

export default function Button({ label, theme }: Props) {
  if (theme === "primary") {
    return (
      <View className="mx-5 h-[68px] w-80 items-center justify-center rounded-xl border-4 border-[#ffd33d] p-1">
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
        onPress={() => alert("You pressed a button.")}
      >
        <Text className="text-base text-white">{label}</Text>
      </Pressable>
    </View>
  );
}
