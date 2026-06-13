import "../global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect, useRef } from "react";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/i18n";

// LogBox 의 화면 하단 워닝 바가 dev 빌드에서 hit-test 를 흡수해
// e2e (maestro) 의 탭 navigation 을 막는 케이스 회피 (e2e/test-plan.md §발견 이슈 #2).
if (__DEV__) {
  LogBox.ignoreAllLogs();
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  // 디자인 시스템 정책: dark 우선. 디바이스 스킴과 무관하게 최초 1회만 다크로 시작한다.
  // ref 가드가 없으면 nativewind setColorScheme 의 identity 가 매 렌더 바뀌면서
  // effect 가 재발화 → 이후의 setColorScheme("light") 오버라이드(dev?theme / 향후 설정)를
  // 즉시 되돌려 라이트 전환이 불가능해진다.
  const didInitTheme = useRef(false);
  useEffect(() => {
    if (didInitTheme.current) return;
    didInitTheme.current = true;
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GluestackUIProvider mode={themeMode}>
          <ThemeProvider
            value={colorScheme === "light" ? DefaultTheme : DarkTheme}
          >
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={tabScreenOptions} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </BottomSheetModalProvider>
          </ThemeProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
