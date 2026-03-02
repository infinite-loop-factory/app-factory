import type { TextProps } from "react-native";

import { cn } from "@gluestack-ui/utils";
import Animated from "react-native-reanimated";
import { useTranslation } from "@/hooks/use-translation.ts";
import i18n, { type TranslationKey } from "@/i18n";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  translationKey?: TranslationKey;
};

export function ThemedText({
  children,
  style,
  type = "default",
  className,
  translationKey,
  ...rest
}: ThemedTextProps) {
  const { t } = useTranslation();
  const text = translationKey ? t(translationKey) : (children as string);

  return (
    <Animated.Text
      {...rest}
      className={cn(
        "text-typography-300",
        {
          "text-sm leading-6": type === "default",
          "font-bold text-4xl leading-8": type === "title",
          "font-semibold text-base leading-6": type === "defaultSemiBold",
          "font-bold text-xl": type === "subtitle",
          "text-[#0a7ea4] text-base leading-7": type === "link",
        },
        className,
      )}
      numberOfLines={1}
      style={[style]}
    >
      {text}
    </Animated.Text>
  );
}
