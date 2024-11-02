import { Text, TouchableOpacity } from "react-native";

export default function Button({
  title,
  onPress,
}: { title: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      className="rounded-lg bg-blue-500 p-4"
      onPressIn={onPress}
    >
      <Text className="text-white">{title}</Text>
    </TouchableOpacity>
  );
}
