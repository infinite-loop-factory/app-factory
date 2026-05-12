import type { View as RNView, ViewProps } from "react-native";

import { forwardRef } from "react";
import { View } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export const ThemedView = forwardRef<RNView, ViewProps>(function ThemedView(
  { style, ...otherProps },
  ref,
) {
  const backgroundColor = useThemeColor("background");

  return (
    <View ref={ref} style={[{ backgroundColor }, style]} {...otherProps} />
  );
});
