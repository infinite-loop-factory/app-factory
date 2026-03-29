import { Text, View } from "react-native";

interface LineBadgeProps {
  line: string;
  color: string;
}

export function LineBadge({ line, color }: LineBadgeProps) {
  return (
    <View
      className="px-2 py-0.5 rounded-full"
      style={{ backgroundColor: color }}
    >
      <Text className="text-xs text-white font-medium">{line}</Text>
    </View>
  );
}
