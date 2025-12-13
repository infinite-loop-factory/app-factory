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

import mobileAds from "react-native-google-mobile-ads";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { logAdEnvironment } from "@/constants/admob";
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

  // AdMob SDK 초기화
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        logAdEnvironment();

        // ⚠️ 테스트용: 항상 테스트 디바이스 설정
        // EAS Build APK에서도 테스트 광고가 표시되도록 설정
        mobileAds().setRequestConfiguration({
          testDeviceIdentifiers: [
            "EMULATOR", // 에뮬레이터 자동 인식
            // TODO: 실제 디바이스 ID 추가 (adb logcat | grep "GADMobileAds"에서 확인)
            // 예: "33BE2250B43518CCDA7DE426D04EE231"
          ],
        });
      })
      .catch((error) => {
        console.error("[AdMob] Initialization failed:", error);
      });
  }, []);

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
