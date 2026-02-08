import "../global.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { RouteSearchProvider } from "@/context/route-search-context";
import { SyncStatusProvider } from "@/context/sync-status-context";
import "@/i18n";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const tabScreenOptions = { headerShown: false };

  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RouteSearchProvider>
          <SyncStatusProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={tabScreenOptions} />
              <Stack.Screen
                name="route-result"
                options={{ title: "", headerShown: false }}
              />
              <Stack.Screen
                name="notification-settings"
                options={{ title: "", headerShown: false }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SyncStatusProvider>
        </RouteSearchProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
