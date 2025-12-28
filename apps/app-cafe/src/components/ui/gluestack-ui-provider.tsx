import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import { useColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { View, ViewProps } from "react-native";
import { useThemeStore } from "@/hooks/use-theme";
import { useLanguageStore } from "@/hooks/use-language";
import { config } from "./config";

export type ModeType = "light" | "dark" | "system";

export function GluestackUIProvider({
  mode = "light",
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps["style"];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const themeMode = useThemeStore((state) => state.mode);
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    setColorScheme(themeMode === "system" ? mode : themeMode);
  }, [themeMode, mode, language]);

  return (
    <View
      style={[
        config[colorScheme!],
        {
          flex: 1,
          height: "100%",
          width: "100%",
          fontSize: 16,
        },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
