import type { ConfigContext, ExpoConfig } from "expo/config";

/** Inlined for Expo config eval (Node cannot import app TS modules). */
const ADMOB_APP_IDS = {
  ios:
    process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID ??
    "ca-app-pub-3940256099942544~1458002511",
  android:
    process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID ??
    "ca-app-pub-3940256099942544~3347511713",
} as const;
const ANDROID_PACKAGE = "com.infiniteloopfactory.snakeladder";
const IOS_BUNDLE_ID = "com.infinite-loop-factory.snake-ladder";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Snake & Ladder",
  slug: "snake-ladder",
  scheme: "snake-ladder",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./src/assets/images/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1e3a2c",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: IOS_BUNDLE_ID,
    infoPlist: {
      NSUserTrackingUsageDescription:
        "This identifier will be used to deliver personalized ads to you.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#1e3a2c",
    },
    package: ANDROID_PACKAGE,
  },
  web: {
    bundler: "metro",
    // SPA mode: static prerender breaks on top-level await in "use dom"
    // dice bundles; the privacy URL still resolves client-side.
    output: "single",
    favicon: "./src/assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-localization",
    "expo-font",
    "expo-audio",
    "expo-iap",
    "expo-tracking-transparency",
    [
      "react-native-google-mobile-ads",
      {
        androidAppId: ADMOB_APP_IDS.android,
        iosAppId: ADMOB_APP_IDS.ios,
      },
    ],
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    baseUrl: "/app-factory/snake-ladder",
  },
});
