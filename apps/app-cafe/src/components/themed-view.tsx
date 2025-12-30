import type { ViewProps } from "react-native";

import { View } from "react-native";

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  return (
    <View
      className="bg-background-0 dark:bg-background-0"
      style={style}
      {...otherProps}
    />
  );
}
