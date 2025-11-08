import { TestIds } from "react-native-google-mobile-ads";

/**
 * ⚠️ 테스트용 설정: 항상 TestIds 사용
 *
 * EAS Build APK에서는 __DEV__ = false이므로, preview 빌드에서도 테스트 광고를 보려면
 * useTestAds를 true로 설정해야 합니다.
 *
 * ⚠️ 프로덕션 배포 전 반드시 수정:
 * 1. useTestAds = false로 변경
 * 2. 실제 AdMob 계정에서 발급받은 Unit ID로 교체
 */
const useTestAds = true; // TODO: 프로덕션 배포 전 false로 변경

/**
 * 광고 단위 ID 설정
 * 테스트 모드: TestIds 사용 (계정 안전)
 * 프로덕션: 실제 AdMob ID 사용
 */
export const AdMobIds = {
  // 배너 광고 (하단 고정)
  BANNER: useTestAds
    ? TestIds.BANNER
    : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy",

  // 전면 광고 (화면 전환 시)
  INTERSTITIAL: useTestAds
    ? TestIds.INTERSTITIAL
    : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy",

  // 리워드 광고 (보상형)
  REWARDED: useTestAds
    ? TestIds.REWARDED
    : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy",

  // 앱 오픈 광고 (앱 시작 시)
  APP_OPEN: useTestAds
    ? TestIds.APP_OPEN
    : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy",
} as const;

/**
 * 현재 환경 확인 유틸리티
 */
export const isTestAdsEnabled = useTestAds;

/**
 * 광고 환경 정보 출력 (디버깅용)
 */
export const logAdEnvironment = () => {
  // TODO: TBU
};
