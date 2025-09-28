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

import { themeAtom } from "@/atoms/theme.atom";
import WebviewLayout from "@/components/web-view-layout";
import { env } from "@/constants/env";
import "@/features/location/location-task";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNetworkState } from "expo-network";
import { useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocationPermissionDeniedToast } from "@/components/toasts/location-permission-denied";
import { useToast } from "@/components/ui/toast";
import { startLocationTask } from "@/features/location/location-permission";
import { flushLocationQueueIfAny } from "@/features/location/location-task";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false, // RN/web hybrid: disable focus refetch
    },
  },
});

function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  const savedTheme = useAtomValue(themeAtom);
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });
  const net = useNetworkState();
  const wasConnectedRef = useRef(false);
  const toast = useToast();

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
    startLocationTask({
      onPermissionDenied: () => {
        toast.show({
          duration: 3000,
          render: LocationPermissionDeniedToast,
        });
      },
    });
  }, [toast]);

  useEffect(() => {
    const connected =
      Boolean(net.isConnected) && net.isInternetReachable !== false;
    if (connected && !wasConnectedRef.current) {
      flushLocationQueueIfAny().catch((e) =>
        Sentry.captureMessage(`queue flush on reconnect failed: ${String(e)}`),
      );
    }
    wasConnectedRef.current = connected;
  }, [net.isConnected, net.isInternetReachable]);

  if (!loaded) {
    return null;
  }

  return (
    <JotaiProvider store={store}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </SafeAreaProvider>
    </JotaiProvider>
  );
}

export default Sentry.wrap(RootLayout);
