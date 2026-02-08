/**
 * EasyTalking 앱의 시작 화면
 * 카테고리 선택 화면으로 자동 이동하는 스플래시 화면
 */

import { useRouter } from "expo-router";
import { Sprout } from "lucide-react-native";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BannerAdComponent, BannerAdSize } from "@/components/ads/BannerAd";
import { Box, Text } from "@/components/ui";
import { styleExamples, themeTailwindClasses } from "@/constants/designSystem";
import { useAppState } from "@/context/AppContext";

export default function IndexScreen() {
  const router = useRouter();
  const { isInitialized, isLoading, error } = useAppState();

  useEffect(() => {
    // 앱이 초기화되면 카테고리 선택 화면으로 이동
    if (isInitialized && !isLoading && !error) {
      const timer = setTimeout(() => {
        router.replace("/category-selection");
      }, 1500); // 1.5초 후 자동 이동

      return () => clearTimeout(timer);
    }
  }, [isInitialized, isLoading, error, router]);

  if (error) {
    return (
      <SafeAreaView
        className={`${styleExamples.layouts.screen} items-center justify-center`}
      >
        <Box className="items-center px-8">
          <Text
            className={`font-semibold text-xl ${themeTailwindClasses.destructiveText} mb-4 text-center`}
          >
            앱 실행 오류
          </Text>
          <Text
            className={`text-base ${themeTailwindClasses.mutedText} text-center leading-relaxed`}
          >
            {error.message}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`${styleExamples.layouts.screen} items-center justify-center`}
    >
      <Box className="items-center px-8">
        {/* 앱 로고/타이틀 */}
        <Box className="mb-6 h-24 w-24 items-center justify-center">
          <Sprout color="#b45309" size={80} strokeWidth={1.5} />
        </Box>
        <Text
          className={`font-bold text-3xl ${themeTailwindClasses.foreground} mb-1 text-center`}
        >
          이지토킹
        </Text>
        <Text
          className={`font-medium text-lg ${themeTailwindClasses.mutedText} mb-8 text-center`}
        >
          EasyTalking
        </Text>

        {/* 설명 */}
        <Box className="mb-12 items-center">
          <Text
            className={`text-base ${themeTailwindClasses.mutedText} text-center leading-relaxed`}
          >
            자기탐구와 의미있는 대화를 위한
          </Text>
          <Text
            className={`text-base ${themeTailwindClasses.mutedText} text-center leading-relaxed`}
          >
            디지털 질문카드
          </Text>
        </Box>

        {/* 로딩 표시 */}
        {isLoading && (
          <Box className="mt-8">
            <Text
              className={`text-sm ${themeTailwindClasses.mutedText} text-center`}
            >
              로딩 중...
            </Text>
          </Box>
        )}
      </Box>

      {/* 하단 광고 (절대 위치) */}
      <Box className="absolute bottom-8 w-full px-5">
        <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </Box>
    </SafeAreaView>
  );
}
