import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "question-card",
  slug: "question-card",
  scheme: "question-card",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: "6513cdb9-4250-4484-bc8d-71f3306e9e12",
    },
  },
  splash: {
    image: "./src/assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.infiniteloop.easytalking",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#00000000",
    },
    permissions: [],
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
      "react-native-google-mobile-ads",
      {
        // TODO: Replace with actual AdMob App IDs from Google AdMob dashboard
        // Get IDs from: https://apps.admob.com/
        androidAppId: "ca-app-pub-3940256099942544~3347511713", // Test App ID
        iosAppId: "ca-app-pub-3940256099942544~1458002511", // Test App ID
        // iOS 14+ App Tracking Transparency message
        userTrackingUsageDescription: "맞춤형 광고를 제공하기 위해 사용됩니다.",
      },
    ],
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    baseUrl: "/app-factory/question-card",
  },
});
