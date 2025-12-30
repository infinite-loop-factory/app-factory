import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import React from "react";
import { View, ViewProps } from "react-native";
import { useThemeStore } from "@/hooks/use-theme";
import { config } from "./config";

export type ModeType = "light" | "dark";

export function GluestackUIProvider({
  ...props
}: {
  children?: React.ReactNode;
  style?: ViewProps["style"];
}) {
  const mode = useThemeStore((state) => state.mode);

  return (
    <View
      style={[
        config[mode],
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
