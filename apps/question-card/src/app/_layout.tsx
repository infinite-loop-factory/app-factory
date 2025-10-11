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
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
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
              {/* TODO: Uncomment when implementing Phase 2 screens */}
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
              {/* <Stack.Screen
              name="question-list"
              options={{
                title: "질문 목록",
                presentation: "card",
              }}
            />
            <Stack.Screen
              name="individual-card"
              options={{
                title: "질문 카드",
                presentation: "card",
              }}
            /> */}
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </GluestackUIProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
