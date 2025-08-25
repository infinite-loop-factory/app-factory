import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "country-tracker",
  slug: "country-tracker",
  owner: "gracefullight",
  scheme: "country-tracker",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./src/assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.gracefullight.countrytracker",
    infoPlist: {
      UIBackgroundModes: ["location"],
      NSLocationWhenInUseUsageDescription:
        "방문 국가 업데이트와 지도 표시를 위해 위치 정보가 필요합니다. 설정에서 언제든지 비활성화할 수 있어요.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "앱이 활성화되지 않아도 자동으로 방문 기록을 저장하려면 백그라운드 위치 권한이 필요합니다. 데이터는 내 계정에 보관되며 언제든 삭제할 수 있어요.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.gracefullight.countrytracker",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./src/assets/images/favicon.png",
  },
  plugins: [
    "expo-localization",
    [
      "expo-location",
      {
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
        locationWhenInUsePermission:
          "We use your location to update visited countries and show your travel history on the map. You can disable this at any time in Settings.",
        locationAlwaysAndWhenInUsePermission:
          "Allow background location so we can automatically save visits while the app is not active. Your data stays in your account and you can delete it anytime.",
      },
    ],
    "expo-router",
    "expo-font",
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    baseUrl: "/app-factory/country-tracker",
  },
  extra: {
    eas: {
      projectId: "8ff90dba-d8e0-48a8-9116-0fc9d41c4396",
    },
    env: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
});
