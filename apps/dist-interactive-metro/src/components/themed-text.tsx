import type { TextProps } from "react-native";

import { cn } from "@infinite-loop-factory/common";
import { Text } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  className,
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      className={cn(
        {
          "text-base leading-6": type === "default",
          "font-bold text-4xl leading-10": type === "title",
          "font-semibold text-base leading-6": type === "defaultSemiBold",
          "font-bold text-xl": type === "subtitle",
          "text-base text-primary-500 leading-7": type === "link",
        },
        className,
      )}
      style={[{ color }, style]}
      {...rest}
    />
  );
}
