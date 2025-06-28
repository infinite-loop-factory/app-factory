import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
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
import { Provider as JotaiProvider, useAtom } from "jotai";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import "react-native-reanimated";
import "@/libs/i18n";
import { themeAtom } from "@/atoms/theme.atom";
import WebviewLayout from "@/components/web-view-layout";
import { env } from "@/constants/env";
import "@/features/location/location-task";
import { startLocationTask } from "@/features/location/location-permission";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [savedTheme, setSavedTheme] = useAtom(themeAtom);
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: 스킴 변경시 초기화
  useEffect(() => {
    const initialTheme = savedTheme || colorScheme;

    if (savedTheme && savedTheme !== colorScheme) {
      toggleColorScheme();
    }

    if (!savedTheme) {
      setSavedTheme(initialTheme);
    }
  }, [colorScheme, savedTheme]);

  useEffect(() => {
    startLocationTask();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
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
