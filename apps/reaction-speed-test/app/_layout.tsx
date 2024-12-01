import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import WebviewLayout from "@/components/WebviewLayout";
import "@/i18n";
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

function AppContainer({ children }: PropsWithChildren) {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [loaded]);

  if (!(loaded && isReady)) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <AppContainer>
        <WebviewLayout>
          <Stack>
            <Stack.Screen name="(pages)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </WebviewLayout>
      </AppContainer>
    </GluestackUIProvider>
  );
}
