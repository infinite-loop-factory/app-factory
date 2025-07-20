import "@/global.css";
import type { PropsWithChildren } from "react";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import AuthGuard from "@/components/AuthGuard";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import WebviewLayout from "@/components/WebviewLayout";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";
import { supabase } from "@/utils/supabase";
import "react-native-reanimated";
import "@/i18n";
import "react-native-url-polyfill/auto";

global.WebSocket = require("react-native-websocket");

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

SplashScreen.preventAutoHideAsync();

function AppContainer({ children }: PropsWithChildren) {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const authValue = useAuthProvider();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [loaded]);

  if (!(loaded && isReady)) {
    return null;
  }

  return (
    <AuthContext.Provider value={authValue}>
      <GluestackUIProvider mode={colorScheme}>
        <AppContainer>
          <AuthGuard>
            <WebviewLayout>
              <Stack>
                <Stack.Screen name="(pages)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </WebviewLayout>
          </AuthGuard>
        </AppContainer>
      </GluestackUIProvider>
    </AuthContext.Provider>
  );
}
