import type { ReactNode } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function InteractionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>{children}</KeyboardProvider>
    </GestureHandlerRootView>
  );
}
