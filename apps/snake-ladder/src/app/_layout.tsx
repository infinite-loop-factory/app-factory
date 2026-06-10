import "../global.css";

import { Jua_400Regular } from "@expo-google-fonts/jua";
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
import { Platform } from "react-native";
import { BootScreen } from "@/components/boot-screen";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AppSettingsProvider, useAppSettings } from "@/hooks/use-app-settings";
import { MonetizationProvider } from "@/hooks/use-monetization";
import { requestTrackingPermissionIfNeeded } from "@/lib/monetization/att";
import { preloadInterstitialAd } from "@/lib/monetization/interstitial-ads";
import "@/i18n";

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { settings } = useAppSettings();

  useEffect(() => {
    if (settings.theme === "system") {
      setColorScheme("system");
      return;
    }
    setColorScheme(settings.theme);
  }, [setColorScheme, settings.theme]);

  useEffect(() => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      void requestTrackingPermissionIfNeeded().then(() =>
        preloadInterstitialAd(),
      );
    }
  }, []);

  const navTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const gluestackMode = colorScheme === "dark" ? "dark" : "light";

  return (
    <GluestackUIProvider mode={gluestackMode}>
      <ThemeProvider value={navTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="game" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="shop" />
          <Stack.Screen name="privacy" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}

function AppBootstrap({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { loaded: settingsLoaded } = useAppSettings();
  const ready = fontsLoaded && settingsLoaded;

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return <BootScreen />;
  }

  return (
    <MonetizationProvider>
      <RootNavigation />
    </MonetizationProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Jua: Jua_400Regular,
  });

  return (
    <AppSettingsProvider>
      <AppBootstrap fontsLoaded={fontsLoaded} />
    </AppSettingsProvider>
  );
}
