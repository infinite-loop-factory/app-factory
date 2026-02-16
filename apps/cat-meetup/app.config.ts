import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "냥냥모임",
  slug: "cat-meetup",
  scheme: "cat-meetup",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.infiniteloopfactory.catmeetup",
  },
  android: {
    package: "com.infiniteloopfactory.catmeetup",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    output: "single",
    favicon: "./assets/images/favicon.png",
  },
  plugins: ["expo-router", "expo-font"],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    baseUrl: "/app-factory/cat-meetup",
  },
});
