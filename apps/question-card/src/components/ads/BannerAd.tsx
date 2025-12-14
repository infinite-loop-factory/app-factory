import Constants from "expo-constants";
import { useState } from "react";
import { Text, View } from "react-native";

/**
 * Expo Go 실행 여부 감지
 */
const isExpoGo = Constants.appOwnership === "expo";

/**
 * BannerAdSize enum 정의
 * Expo Go에서는 모의 값 사용, EAS Build에서는 실제 값 로드
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let RNBannerAd: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let AdMobIds: any = { BANNER: "" };

// BannerAdSize는 항상 export해야 하므로 기본값 설정
export const BannerAdSize = {
  BANNER: "BANNER" as const,
  FULL_BANNER: "FULL_BANNER" as const,
  LARGE_BANNER: "LARGE_BANNER" as const,
  LEADERBOARD: "LEADERBOARD" as const,
  MEDIUM_RECTANGLE: "MEDIUM_RECTANGLE" as const,
  WIDE_SKYSCRAPER: "WIDE_SKYSCRAPER" as const,
  ANCHORED_ADAPTIVE_BANNER: "ANCHORED_ADAPTIVE_BANNER" as const,
  INLINE_ADAPTIVE_BANNER: "INLINE_ADAPTIVE_BANNER" as const,
};

// Expo Go가 아닐 때만 실제 AdMob 모듈 로드
if (!isExpoGo) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AdMob = require("react-native-google-mobile-ads");
    RNBannerAd = AdMob.BannerAd;
    // BannerAdSize 값을 실제 값으로 덮어쓰기
    Object.assign(BannerAdSize, AdMob.BannerAdSize);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    AdMobIds = require("@/constants/admob").AdMobIds;
  } catch (_error) {
    // Expo Go에서는 네이티브 모듈 없음 - 정상 동작
  }
}

interface BannerAdComponentProps {
  /** 배너 광고 크기 (기본: BANNER) */
  size?: (typeof BannerAdSize)[keyof typeof BannerAdSize];
}

/**
 * 배너 광고 컴포넌트
 *
 * - Expo Go: 플레이스홀더 표시
 * - EAS Build: 실제 AdMob 배너 표시
 *
 * @example
 * ```tsx
 * <BannerAdComponent />
 * <BannerAdComponent size={BannerAdSize.LARGE_BANNER} />
 * ```
 */
export function BannerAdComponent({
  size = BannerAdSize.BANNER,
}: BannerAdComponentProps) {
  const [adError, setAdError] = useState<string | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  // Expo Go에서는 플레이스홀더 표시
  if (isExpoGo || !RNBannerAd) {
    // 사이즈에 따른 높이 계산
    const getPlaceholderHeight = () => {
      switch (size) {
        case BannerAdSize.LARGE_BANNER:
          return "h-[100px]";
        case BannerAdSize.MEDIUM_RECTANGLE:
          return "h-[250px]";
        case BannerAdSize.ANCHORED_ADAPTIVE_BANNER:
        case BannerAdSize.INLINE_ADAPTIVE_BANNER:
          return "h-[60px]";
        default:
          return "h-[50px]";
      }
    };

    return (
      <View className="items-center py-2">
        <View
          className={`w-full items-center justify-center rounded border border-gray-300 border-dashed bg-gray-100 ${getPlaceholderHeight()}`}
        >
          <Text className="text-gray-400 text-xs">[광고 영역 - Expo Go]</Text>
        </View>
      </View>
    );
  }

  // ⚠️ 테스트용: 항상 디버그 정보 표시 (프로덕션 배포 전 false로 변경 필수)
  const showDebugInfo = true;

  return (
    <View className="items-center py-2">
      {/* 광고 로드 상태 인디케이터 */}
      {showDebugInfo && (
        <Text className="mb-1 text-orange-500 text-xs">
          [테스트 모드] AdMob 배너 {adLoaded ? "✅" : "⏳"}
        </Text>
      )}

      <RNBannerAd
        onAdFailedToLoad={(error: { message: string }) => {
          console.error("[AdMob] Banner ad failed to load:", error);
          setAdError(error.message);
        }}
        onAdLoaded={() => {
          setAdLoaded(true);
          setAdError(null);
        }}
        size={size}
        unitId={AdMobIds.BANNER}
      />

      {/* 에러 메시지 표시 (테스트 모드) */}
      {showDebugInfo && adError && (
        <Text className="mt-1 text-red-500 text-xs">
          광고 로드 실패: {adError}
        </Text>
      )}
    </View>
  );
}
