import { Text, View } from "react-native";

interface LineBadgeProps {
  line: string;
  color: string;
  size?: "sm" | "md";
}

export function LineBadge({ line, color, size = "md" }: LineBadgeProps) {
  return (
    <View
      className={`${size === "sm" ? "px-1.5 py-0" : "px-2 py-0.5"} rounded-full`}
      style={{ backgroundColor: color }}
    >
      <Text
        className={`${size === "sm" ? "text-[10px]" : "text-xs"} text-white font-medium`}
      >
        {line}
      </Text>
    </View>
  );
}
