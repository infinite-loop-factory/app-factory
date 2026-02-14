import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "dist-interactive-metro",
  slug: "dist-interactive-metro",
  scheme: "dist-interactive-metro",
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
    bundleIdentifier: "com.infinite-loop-factory.dist-interactive-metro",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "현재 위치에서 가장 가까운 지하철역을 추천하기 위해 위치 정보를 사용합니다.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
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
          "현재 위치에서 가장 가까운 지하철역을 추천하기 위해 위치 정보를 사용합니다.",
      },
    ],
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    baseUrl: "/app-factory/dist-interactive-metro",
  },
});
