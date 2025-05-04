import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "dog-walk",
  slug: "dog-walk",
  scheme: "dog-walk",
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
    bundleIdentifier: "com.dog.walk",
    supportsTablet: true,
    googleServicesFile: "./GoogleService-Info.plist",
  },
  android: {
    package: "com.dog.walk",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    googleServicesFile: "./google-services.json",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-localization",
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow '산책 with 댕댕' to use your location.",
      },
    ],
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: `com.googleusercontent.apps.${process.env.EXPO_PUBLIC_GOOGLE_CLIENT_IOS_ID}`,
      },
    ],
    [
      "expo-build-properties",
      {
        android: { googleServicesFile: "./google-services.json" },
      },
    ],
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    baseUrl: "/app-factory/dog-walk",
  },
  extra: {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    googleClientIosId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_IOS_ID,
    googleClientWebId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_WEB_ID,
    eas: {
      projectId: "3eb8ea77-f3c8-4a65-98ae-7149ca5515fb",
    },
  },
});
