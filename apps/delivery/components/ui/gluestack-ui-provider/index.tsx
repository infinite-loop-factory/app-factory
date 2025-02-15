import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import { colorScheme as colorSchemeNW } from "nativewind";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";
import { config } from "./config";

export function GluestackUIProvider({
  style,
  mode,
  ...props
}: {
  mode: "light" | "dark";
  children?: ReactNode;
  style?: ViewProps["style"];
}) {
  colorSchemeNW.set(mode);

  return (
    <View
      style={[config[mode], { flex: 1, height: "100%", width: "100%" }, style]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
