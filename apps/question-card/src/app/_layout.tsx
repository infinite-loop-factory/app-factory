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

import "@/i18n";

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
    <AppProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="category-selection"
            options={{
              title: "카테고리 선택",
              presentation: "card",
            }}
          />
          {/* TODO: Uncomment when implementing Phase 2 screens */}
          <Stack.Screen
            name="difficulty-selection"
            options={{
              title: "난이도 선택",
              presentation: "card",
            }}
          />
          <Stack.Screen
            name="question-main"
            options={{
              title: "질문 시작",
              presentation: "card",
            }}
          />
          {/* <Stack.Screen
            name="continuous-card"
            options={{
              title: "질문 카드",
              presentation: "card",
            }}
          />
          <Stack.Screen
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
    </AppProvider>
  );
}
