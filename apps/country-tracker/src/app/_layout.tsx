import "@/global.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { useFonts } from "expo-font";
import { Slot, useNavigationContainerRef } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Provider as JotaiProvider, useAtomValue } from "jotai";
import { colorScheme } from "nativewind"; // Directly import colorScheme
import { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { store } from "@/libs/jotai";
import "react-native-reanimated";
import "@/libs/i18n";

import { themeAtom } from "@/atoms/theme.atom";
import WebviewLayout from "@/components/web-view-layout";
import { env } from "@/constants/env";
import "@/features/location/location-task";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { startLocationTask } from "@/features/location/location-permission";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  const savedTheme = useAtomValue(themeAtom);
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (navigationRef) {
      navigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [navigationRef]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    colorScheme.set(savedTheme);
  }, [savedTheme]);

  useEffect(() => {
    startLocationTask();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider store={store}>
          <GluestackUIProvider mode={savedTheme}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ThemeProvider
                value={savedTheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <WebviewLayout>
                  <Slot />
                </WebviewLayout>
              </ThemeProvider>
            </GestureHandlerRootView>
          </GluestackUIProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(RootLayout);
