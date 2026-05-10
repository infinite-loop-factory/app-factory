import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "app-cafe",
  slug: "app-cafe",
  scheme: "app-cafe",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./src/assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#5D4037",
  },
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.infiniteloop.cafe",
  },
  android: {
    package: "com.anonymous.appcafe",
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#5D4037",
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
      "expo-build-properties",
      {
        ios: {
          // newArchEnabled moved to root
        },
        android: {
          // newArchEnabled moved to root
        },
      },
    ],
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    baseUrl: "/app-factory/app-cafe",
  },
  jsEngine: "hermes",
  newArchEnabled: true,
});
