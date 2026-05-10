import type { ReactNode } from "react";

import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import { vars } from "nativewind";
import { View, type ViewProps } from "react-native";
import { useThemeStore } from "@/hooks/use-theme";

export function GluestackUiProvider({
  ...props
}: {
  children?: ReactNode;
  style?: ViewProps["style"];
}) {
  const { currentRgb } = useThemeStore();

  return (
    <OverlayProvider>
      <ToastProvider>
        <View
          style={[
            vars(currentRgb),
            {
              flex: 1,
              height: "100%",
              width: "100%",
              fontSize: 16,
            },
            props.style,
          ]}
        >
          {props.children}
        </View>
      </ToastProvider>
    </OverlayProvider>
  );
}
