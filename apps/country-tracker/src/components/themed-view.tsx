import type { ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { View } from "react-native";

export function ThemedView({ style, ...otherProps }: ViewProps) {
  const backgroundColor = useThemeColor("background");

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
