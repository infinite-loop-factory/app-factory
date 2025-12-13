import { useState } from "react";
import { Text, View } from "react-native";
import {
  type BannerAdProps,
  BannerAdSize,
  BannerAd as RNBannerAd,
} from "react-native-google-mobile-ads";
import { AdMobIds } from "@/constants/admob";

interface BannerAdComponentProps {
  /** 배너 광고 크기 (기본: BANNER) */
  size?: BannerAdProps["size"];
}

/**
 * 배너 광고 컴포넌트
 *
 * 개발 모드: 테스트 광고 표시
 * 프로덕션: 실제 광고 표시
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
        onAdFailedToLoad={(error) => {
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
