import "../global.css";

import {
  IBMPlexSansKR_400Regular,
  IBMPlexSansKR_500Medium,
  IBMPlexSansKR_600SemiBold,
  IBMPlexSansKR_700Bold,
} from "@expo-google-fonts/ibm-plex-sans-kr";
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
import "react-native-reanimated";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import "@/i18n";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AppProvider } from "@/context/AppContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [loaded] = useFonts({
    "IBMPlexSansKR-Regular": IBMPlexSansKR_400Regular,
    "IBMPlexSansKR-Medium": IBMPlexSansKR_500Medium,
    "IBMPlexSansKR-SemiBold": IBMPlexSansKR_600SemiBold,
    "IBMPlexSansKR-Bold": IBMPlexSansKR_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <GluestackUIProvider mode={colorScheme}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="category-selection"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="difficulty-selection"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="question-main"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="continuous-card"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="question-list"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="individual-card"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </GluestackUIProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
