import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Expo Go 실행 여부 감지
 * - Expo Go: Constants.appOwnership === "expo"
 * - Development Build / EAS Build: "standalone" 또는 null
 */
export const isExpoGo = Constants.appOwnership === "expo";

// Expo Go가 아닐 때만 TestIds 로드 (네이티브 모듈 필요)
let TestIds: {
  BANNER: string;
  INTERSTITIAL: string;
  REWARDED: string;
  APP_OPEN: string;
} = {
  BANNER: "test-banner-expo-go",
  INTERSTITIAL: "test-interstitial-expo-go",
  REWARDED: "test-rewarded-expo-go",
  APP_OPEN: "test-app-open-expo-go",
};

if (!isExpoGo) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  TestIds = require("react-native-google-mobile-ads").TestIds;
}

/**
 * ===================================================
 * AdMob 환경변수 기반 테스트/프로덕션 설정
 * ===================================================
 *
 * 환경별 자동 전환:
 * - 개발/테스트: .env.development → EXPO_PUBLIC_USE_TEST_ADS=true → TestIds
 * - 프로덕션: .env.production → EXPO_PUBLIC_USE_TEST_ADS=false → 실제 AdMob IDs
 *
 * 프로덕션 배포 전 체크리스트:
 * 1. ✅ .env.production 파일에 실제 AdMob Unit IDs 입력
 * 2. ✅ EXPO_PUBLIC_USE_TEST_ADS=false 설정 확인
 * 3. ✅ eas build -p android --profile production 실행
 * 4. ✅ 빌드 후 logAdEnvironment() 출력 확인
 *
 * ⚠️ 주의:
 * - 개발 중에는 절대 실제 광고 클릭 금지 (AdMob 정책 위반)
 * - TestIds는 언제든 안전하게 사용 가능
 * ===================================================
 */

// 환경변수에서 테스트 모드 여부 읽기
const useTestAds = process.env.EXPO_PUBLIC_USE_TEST_ADS === "true";

/**
 * 프로덕션 AdMob Unit IDs
 * .env.production 파일에서 환경변수로 관리
 */
const PRODUCTION_IDS = {
  BANNER: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || "PLACEHOLDER_BANNER_ID",
  INTERSTITIAL:
    process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID ||
    "PLACEHOLDER_INTERSTITIAL_ID",
  REWARDED:
    process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || "PLACEHOLDER_REWARDED_ID",
  APP_OPEN:
    process.env.EXPO_PUBLIC_ADMOB_APP_OPEN_ID || "PLACEHOLDER_APP_OPEN_ID",
};

/**
 * 광고 단위 ID 설정
 * - 테스트 모드 (useTestAds=true): Google 공식 TestIds 사용
 * - 프로덕션 모드 (useTestAds=false): 환경변수의 실제 AdMob IDs 사용
 */
export const AdMobIds = {
  // 배너 광고 (하단 고정, 인라인)
  BANNER: useTestAds ? TestIds.BANNER : PRODUCTION_IDS.BANNER,

  // 전면 광고 (화면 전환 시 - 향후 사용)
  INTERSTITIAL: useTestAds ? TestIds.INTERSTITIAL : PRODUCTION_IDS.INTERSTITIAL,

  // 리워드 광고 (보상형 - 향후 사용)
  REWARDED: useTestAds ? TestIds.REWARDED : PRODUCTION_IDS.REWARDED,

  // 앱 오픈 광고 (앱 시작 시 - 향후 사용)
  APP_OPEN: useTestAds ? TestIds.APP_OPEN : PRODUCTION_IDS.APP_OPEN,
} as const;

/**
 * 현재 환경 확인 유틸리티
 */
export const isTestAdsEnabled = useTestAds;

/**
 * 광고 환경 정보 출력 (디버깅용)
 *
 * 사용법:
 * import { logAdEnvironment } from '@/constants/admob';
 * logAdEnvironment(); // 앱 시작 시 호출
 */
export const logAdEnvironment = () => {
  // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
  console.log("===== AdMob Environment =====");
  // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
  console.log(`Platform: ${Platform.OS}`);
  // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
  console.log(`Test Ads Enabled: ${useTestAds}`);
  // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
  console.log(`Environment: ${useTestAds ? "DEVELOPMENT/TEST" : "PRODUCTION"}`);

  if (useTestAds) {
    // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
    console.log("✅ Using Google TestIds (Safe for development)");
  } else {
    // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
    console.log("⚠️ Using Production AdMob IDs");
    // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
    console.log(`Banner ID: ${AdMobIds.BANNER}`);

    // 프로덕션 모드인데 PLACEHOLDER 사용 시 경고
    if (AdMobIds.BANNER.includes("PLACEHOLDER")) {
      // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
      console.warn(
        "⛔ WARNING: Production mode enabled but using PLACEHOLDER IDs!",
      );
      // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
      console.warn(
        "⛔ Please update .env.production with actual AdMob Unit IDs",
      );
    }
  }

  // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
  console.log("=============================");
};
