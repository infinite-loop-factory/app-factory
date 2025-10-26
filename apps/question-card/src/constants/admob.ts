import { TestIds } from "react-native-google-mobile-ads";

/**
 * 광고 단위 ID 설정
 * 개발: TestIds 사용 (계정 안전)
 * 프로덕션: 실제 AdMob ID 사용
 */
export const AdMobIds = {
  // 배너 광고 (하단 고정)
  BANNER: __DEV__ ? TestIds.BANNER : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy",

  // 전면 광고 (화면 전환 시)
  INTERSTITIAL: __DEV__
    ? TestIds.INTERSTITIAL
    : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy",

  // 리워드 광고 (보상형)
  REWARDED: __DEV__
    ? TestIds.REWARDED
    : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy",

  // 앱 오픈 광고 (앱 시작 시)
  APP_OPEN: __DEV__
    ? TestIds.APP_OPEN
    : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy",
} as const;

/**
 * 현재 환경 확인 유틸리티
 */
export const isTestAdsEnabled = __DEV__;

/**
 * 광고 환경 정보 출력 (디버깅용)
 */
export const logAdEnvironment = () => {
  // TODO: TBU
};
