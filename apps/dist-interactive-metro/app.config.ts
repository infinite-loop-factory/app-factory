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
  plugins: ["expo-router", "expo-localization", "expo-font"],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    baseUrl: "/app-factory/dist-interactive-metro",
  },
});
