import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, View } from "react-native";

type Props = {
  onPress: () => void;
  iconName: React.ComponentProps<typeof MaterialIcons>["name"];
};

export default function CircleButton({ onPress, iconName }: Props) {
  return (
    <View className="mx-[60px] h-[72px] w-[72px] rounded-full bg-[#1ED760] p-1">
      <Pressable
        className="flex-1 items-center justify-center rounded-full"
        onPress={onPress}
      >
        <MaterialIcons color="#25292e" name={iconName} size={50} />
      </Pressable>
    </View>
  );
}
