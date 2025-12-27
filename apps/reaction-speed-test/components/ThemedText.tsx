import type { TextProps } from "react-native";

import clsx from "clsx";
import { Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      className={clsx({
        "text-base leading-6": type === "default",
        "font-bold text-4xl leading-8": type === "title",
        "font-semibold text-base leading-6": type === "defaultSemiBold",
        "font-bold text-xl": type === "subtitle",
        "text-base text-primary-600 leading-7 dark:text-primary-400":
          type === "link",
      })}
      style={[{ color }, style]}
      {...rest}
    />
  );
}
