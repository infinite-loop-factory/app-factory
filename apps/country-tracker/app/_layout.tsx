import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { useFonts } from "expo-font";
import { Stack, useNavigationContainerRef } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import "react-native-reanimated";
import "@/i18n";
import WebviewLayout from "@/components/WebviewLayout";
import { env } from "@/constants/env";

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

function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트시점 초기화
  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme || "light");
        return;
      }
      if (theme !== colorScheme) {
        toggleColorScheme();
        return;
      }
    })();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <WebviewLayout>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </WebviewLayout>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}

export default Sentry.wrap(RootLayout);
