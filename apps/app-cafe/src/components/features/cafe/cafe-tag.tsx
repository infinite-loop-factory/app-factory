import { View } from "react-native";
import { ThemedText } from "@/components/ui/themed-text";
import { themeConfig, useThemeStore } from "@/hooks/use-theme";

interface CafeTagProps {
  tag: string;
}

export function CafeTag({ tag }: CafeTagProps) {
  const { mode } = useThemeStore();

  const bgColor = themeConfig.getHex(mode, "--color-tag-bg");
  const textColor = themeConfig.getHex(mode, "--color-tag-text");

  return (
    <View
      className="rounded-md px-2.5 py-0.5"
      style={{ backgroundColor: bgColor }}
    >
      <ThemedText style={{ color: textColor, fontSize: 11 }}>#{tag}</ThemedText>
    </View>
  );
}
