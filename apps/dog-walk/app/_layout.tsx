import "../global.css";
import "@/global.css";

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
import "react-native-reanimated";
import "@/i18n";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { configureGoogleSignin } from "@/config/google";
import { AuthProvider } from "@/contexts/AuthProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60,
      retry: (failureCount, error: unknown) => {
        // 인증 에러는 재시도하지 않음
        const err = error as { code?: string; message?: string };
        if (err?.code === "PGRST301" || err?.message?.includes("JWT")) {
          return false;
        }
        return failureCount < 1;
      },
      staleTime: 1000 * 60 * 10,
    },
    mutations: {
      retry: (failureCount, error: unknown) => {
        // 인증 에러는 재시도하지 않음
        const err = error as { code?: string; message?: string };
        if (err?.code === "PGRST301" || err?.message?.includes("JWT")) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    configureGoogleSignin();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <GestureHandlerRootView>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(screens)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}
