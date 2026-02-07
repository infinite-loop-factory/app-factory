import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "shake-it",
  slug: "shake-it",
  scheme: "shake-it",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./src/assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.infinite-loop-factory.shake-it",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "주변 맛집을 찾기 위해 위치 정보가 필요합니다.",
      NSMotionUsageDescription:
        "흔들기 동작을 감지하기 위해 모션 센서가 필요합니다.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    permissions: [
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./src/assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-localization",
    "expo-font",
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "주변 맛집을 찾기 위해 위치 정보가 필요합니다.",
      },
    ],
    [
      "expo-sensors",
      {
        motionPermission: "흔들기 동작을 감지하기 위해 모션 센서가 필요합니다.",
      },
    ],
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    baseUrl: "/app-factory/shake-it",
  },
});
