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
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/i18n";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  // 디자인 시스템 정책: dark 우선. 디바이스 스킴과 무관하게 항상 다크로 시작.
  useEffect(() => {
    setColorScheme("dark");
  }, [setColorScheme]);
  const [loaded] = useFonts({
    "Fraunces-Regular": require("../assets/fonts/Fraunces-Regular.ttf"),
    "Fraunces-SemiBold": require("../assets/fonts/Fraunces-SemiBold.ttf"),
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.ttf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.ttf"),
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
  const themeMode = colorScheme === "light" ? "light" : "dark";

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode={themeMode}>
        <ThemeProvider
          value={colorScheme === "light" ? DefaultTheme : DarkTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={tabScreenOptions} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
