import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "sip-note",
  slug: "sip-note",
  scheme: "sip-note",
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
    bundleIdentifier: "com.infinite-loop-factory.sip-note",
    infoPlist: {
      UIBackgroundModes: ["location", "fetch"],
    },
  },
  android: {
    package: "com.infiniteloopfactory.sipnote",
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    // react-native-maps(Android)는 Google provider 전용이라 Maps SDK for Android
    // API 키가 필수다. 키가 없으면 MapView.<init> 가 "API key not found" 로 throw →
    // 지도 화면이 빈 화면으로 렌더된다. prebuild 시 아래 값이
    // AndroidManifest 의 <meta-data com.google.android.geo.API_KEY> 로 주입된다.
    // 키는 환경변수에서만 읽는다(하드코딩 금지). 미설정 시 빈 문자열 → 지도 외 기능 정상.
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY ?? "",
      },
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
      "expo-camera",
      {
        cameraPermission:
          "주류 라벨, 잔, 분위기 사진을 기록에 추가하기 위해 카메라가 필요합니다.",
        microphonePermission: false,
        recordAudioAndroid: false,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "갤러리에서 주류 사진을 선택해 기록에 추가하기 위해 사진 접근 권한이 필요합니다.",
        cameraPermission:
          "주류 라벨, 잔, 분위기 사진을 기록에 추가하기 위해 카메라가 필요합니다.",
      },
    ],
    [
      "expo-location",
      {
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
        locationWhenInUsePermission:
          "마신 장소를 기록에 자동으로 태깅하기 위해 위치 정보가 필요합니다.",
        locationAlwaysAndWhenInUsePermission:
          "위시리스트에 등록한 장소 근처에서 알림을 받으려면 백그라운드 위치 권한이 필요합니다.",
      },
    ],
    "expo-notifications",
    "expo-sqlite",
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    baseUrl: "/app-factory/sip-note",
  },
});
