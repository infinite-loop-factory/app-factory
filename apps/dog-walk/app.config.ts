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
    newArchEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-localization",
    "expo-font",
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
      "@mj-studio/react-native-naver-map",
      {
        client_id: process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID,
        android: {
          ACCESS_FINE_LOCATION: true,
          ACCESS_COARSE_LOCATION: true,
          ACCESS_BACKGROUND_LOCATION: true,
        },
        ios: {
          NSLocationAlwaysAndWhenInUseUsageDescription:
            "앱이 백그라운드에서도 현재 위치를 사용하여 주변 서비스를 제공할 수 있도록 허용해 주세요.",
          NSLocationWhenInUseUsageDescription:
            "앱 사용 중 현재 위치를 기반으로 맞춤형 정보를 제공하기 위해 위치 접근이 필요합니다.",
          NSLocationTemporaryUsageDescriptionDictionary: {
            purposeKey: "dog-walk",
            usageDescription:
              "주변에 있는 산ㅐ 코스 추천을 위해 현재 위치 정보가 필요합니다.",
          },
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          googleServicesFile: "./google-services.json",
          gradleProperties: {
            "android.useAndroidX": "true",
            "android.enableJetifier": "false",
            "org.gradle.jvmargs":
              "-Xmx4096m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8",
          },
          extraMavenRepos: ["https://repository.map.naver.com/archive/maven"],
        },
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
