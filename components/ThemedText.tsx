import { useThemeColor } from "@/hooks/useThemeColor";
import clsx from "clsx";
import type { TextProps } from "react-native";
import { Text } from "react-native";

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
      style={[{ color }, style]}
      className={clsx({
        "text-base leading-6": type === "default",
        "text-4xl font-bold leading-8": type === "title",
        "text-base leading-6 font-semibold": type === "defaultSemiBold",
        "text-xl font-bold": type === "subtitle",
        "text-base leading-7 text-[#0a7ea4]": type === "link",
      })}
      {...rest}
    />
  );
}
